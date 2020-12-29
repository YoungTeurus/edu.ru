const setUserGroupTableColumnCount = 2;

// Получает всех пользователей
function getAllUsers(){
    let data = {form: {}};
    data["form"]["action"] = "getAllUsers";
    console.log(data);
    return postAjax(
        siteURL + '/users.php',
        data,
        new ConnectException("Произошла ошибка при отправке запроса на получение всех возможных студенческих группах!")
    );
}

// Возвращает все группы пользователя
function getUserGroups(userId) {
    let data = {form: {}};
    data["form"]["action"] = "getUserGroups";
    data["form"]["userId"] = userId;
    console.log(data);
    return postAjax(
        siteURL + '/users.php',
        data,
        new ConnectException("Произошла ошибка при отправке запроса на получение всех возможных студенческих группах!")
    );
}

// Добавляет пользователя в студенческую группу
function addUserToGroup(userId, groupId){
    let data = {form: {}};
    data["form"]["action"] = "addUserToGroup";
    data["form"]["userId"] = userId;
    data["form"]["groupId"] = groupId;
    console.log(data);
    return postAjax(
        siteURL + '/users.php',
        data,
        new ConnectException("Произошла ошибка при отправке запроса на Добавляет пользователя в студенческую группу!")
    );
}

// Убирает пользователя из студенческой группы
function removeUserFromGroup(userId, groupId){
    let data = {form: {}};
    data["form"]["action"] = "removeUserFromGroup";
    data["form"]["userId"] = userId;
    data["form"]["groupId"] = groupId;
    console.log(data);
    return postAjax(
        siteURL + '/users.php',
        data,
        new ConnectException("Произошла ошибка при отправке запроса на Убирает пользователя из студенческой группы!")
    );
}

// Очищает содержимое таблицы setUserGroupTable
// TODO: вынести функционал в отдельную функцию с параметром?
function clearSetUserGroupTable() {
    $("#setUserGroupTable tbody tr").remove();
}

// Очищает setUserGroupTable
// Заполняет setUserGroupTable из userStudentsGroupsArray
function setupSetUserGroupTable(userStudentsGroupsArray){
    clearSetUserGroupTable();
    if (userStudentsGroupsArray.length > 0){
        userStudentsGroupsArray.forEach(
            uSG => appendStudentGroupToSetUserGroupTable(uSG)
        );
    } else {
        appendStudentGroupToSetUserGroupTableEmpty();
    }
}

// Добавляет строку к таблице
function appendStudentGroupToSetUserGroupTable(userStudentGroupObject){
    const setUserGroupTableBody = $("#setUserGroupTable tbody");

    const addedRow = $("<tr>").append(
        $("<th scope='col'>").text(userStudentGroupObject["name"])
    ).append(
        $("<td>").append(
            $("<div class=\"container\">").append(
                $("<div class=\"row\">").append(
                    $("<div>").append(
                        $("<button class=\"btn btn-danger\">").text("Удалить")
                            .on('click', () => {
                                // Удаление у пользователя группы
                                removeUserFromGroup(userStudentGroupObject["userId"], userStudentGroupObject["id"])
                                    .then(msg => {
                                        console.log(msg);
                                        addedRow.remove();
                                    }).catch(e => console.log(e));
                            })
                    )
                )
            )
        )
    );

    setUserGroupTableBody.append(
        addedRow
    );
}

// Добавляет пустую строку к таблице с информацией, что таблица пуста
function appendStudentGroupToSetUserGroupTableEmpty(){
    const setUserGroupTableBody = $("#setUserGroupTable tbody");

    setUserGroupTableBody.append(
        $("<tr>").append(
            $("<td colspan='" + setUserGroupTableColumnCount.toString() +"'>")
                .text("Данный пользователь не принадлежит ни одной группе.")
        )
    );
}

$(() => {
    $("#setUserGroup").on('click', function (){
        const setUserGroup = $(this);
        const setUserGroupLoader = setUserGroup.find(".spinner");

        const setUserGroupFormUserSelect = $("#setUserGroupFormUserSelect");
        const setUserGroupFormGroupSelect = $("#setUserGroupFormGroupSelect");

        const addGroupToUser = $("#addGroupToUser");

        hideAllTestControlsPlaceholders();
        unhideElementBySelector("#setUserGroupPlaceholder");
        // Показываем спиннер кнопки "Просмотреть отчёт"
        unhideElement(setUserGroupLoader);
        // Блокируем кнопку "Просмотреть отчёт"
        setDisabledInput(setUserGroup, true);

        setDisabledInput(setUserGroupFormUserSelect, true);
        setDisabledInput(setUserGroupFormGroupSelect, true);

        setDisabledInput(addGroupToUser, true);

        getAllUsers().then(
            msg => {
                console.log(msg);
                if(msg["success"]){
                    if(!msg["error"]){
                        const SO = [];
                        msg["users"].forEach(
                            user => {
                                SO.push(getSelectOption(user["surname"] + " "+ user["firstName"] + " " + user["secondName"], user["id"]));
                            }
                        );
                        setSelectOptions(setUserGroupFormUserSelect,SO, true);

                        setDisabledInput(setUserGroupFormUserSelect, false);
                        setUserGroupFormUserSelect.off('change').on('change', function () {
                            if ($(this).val() === ""){
                                return
                            }

                            unhideElement($("#setUserGroupTable").parent());
                            getUserGroups($(this).val()).then(
                                msg => {
                                    console.log(msg);
                                    if(msg["success"]) {
                                        if (!msg["error"]) {
                                            setupSetUserGroupTable(msg["userGroups"]);
                                        }
                                    }
                                }
                            ).catch(e => console.log(e));
                        });

                        // Скрываем спиннер кнопки "Просмотреть отчёт"
                        hideElement(setUserGroupLoader);
                        setDisabledInput(setUserGroup, false);

                        setDisabledInput(addGroupToUser, false);
                        addGroupToUser.off('click').on('click', (e) => {
                            e.preventDefault();
                            addUserToGroup(setUserGroupFormUserSelect.val(), setUserGroupFormGroupSelect.val())
                                .then(msg => {
                                    console.log(msg);
                                    if(msg["success"]){
                                        if(!msg["error"]){
                                            const temp = {
                                                id: setUserGroupFormGroupSelect.val(),
                                                name: setUserGroupFormGroupSelect.find('option').filter(function() {return $(this).val() === setUserGroupFormGroupSelect.val()}).text(),
                                                userId: setUserGroupFormUserSelect.val(),
                                            }
                                            appendStudentGroupToSetUserGroupTable(temp);
                                        }
                                    }
                                })
                                .catch(e => console.log(e));
                        });
                    }
                }
            }
        ).catch(e => console.log(e));

        getAllStudentsGroups().then(
            msg => {
                console.log(msg);
                if(msg["success"]){
                    if(!msg["error"]){
                        const SO = [];
                        msg["studentsGroups"].forEach(
                            sG => {
                                SO.push(getSelectOption(sG["name"], sG["id"]));
                            }
                        );
                        setSelectOptions(setUserGroupFormGroupSelect,SO);

                        setDisabledInput(setUserGroupFormGroupSelect, false);
                    }
                }
            }
        ).catch(e => console.log(e));
    })
});