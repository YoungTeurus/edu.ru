// Фабрика объекто типа selectOption
const getSelectOption = (text, value) => ({
    text: text,
    value: value,
})

// Очищает таблицу доступных тестов
// TODO: вынести функционал в отдельную функцию с параметром?
function clearAvailableTests() {
    $("#availableTests tbody tr").remove();
}

// Добавляет в таблицу новый тест
function appendNewAvailableTest(testRowObject) {
    // Вычисление статуса:
    let _status = (testRowObject["isCompleted"] === "1" ? (
            testRowObject["inProgress"] === "1" ? (
                // Если был выполнен, но сейчас запущена ещё одна попытка:
                testsStatuses.completedInProgress
            ) : (
                // Если был выполнен:
                ((testRowObject["maxTries"] === "-1" || testRowObject["maxTries"] > testRowObject["usedTries"]) ?
                    // Если попыток больше, чем сделано (или их бесконечно много):
                    testsStatuses.completedCanTryAgain :
                    // Если попыток не осталось
                    testsStatuses.completed)
            )

        ) : (
            // Если ещё не выполнен:
            (testRowObject["usedTries"] > 0 ?
                    // Если сделана хотя бы одна попытка и она не закончена:
                    testsStatuses.inProgress :
                    // Если ещё ни одной попытки не сделано :
                    (
                        (testRowObject["openDatetime"] === null && testRowObject["closeDatetime"] === null) ?
                            // Если время открытия/закрытия теста не указано
                            testsStatuses.available :
                            (
                                ((testRowObject["openDatetime"] !== null)
                                    && (new Date(Date.now()).getTime() < new Date(testRowObject["openDatetime"]).getTime())) ?
                                    // Если тест скоро откроется
                                    testsStatuses.availableInTime :
                                    (
                                        ((testRowObject["closeDatetime"] !== null)
                                            && (new Date(Date.now()).getTime() < new Date(testRowObject["closeDatetime"]).getTime())) ?
                                            // Если тест ещё не закрыт:
                                            testsStatuses.available :
                                            // Если тест уже закрыт:
                                            testsStatuses.notAvailable
                                    )
                            )
                    )
            )
        )
    );

    testRowObject._status = _status;

    $("#availableTests tbody").append(
        $("<tr>")
            .append(
                $("<th scope='row'>").text(testRowObject["name"])
            )
            .append(
                $("<td>").text(testRowObject._status.text)
            )
            .append(
                $("<td>").text(getStringOrDash(testRowObject["openDatetime"]))
            )
            .append(
                $("<td>").text(getStringOrDash(testRowObject["closeDatetime"]))
            )
            .on('click', () => {
                console.log(testRowObject["testId"]);
                showTestInfo(testRowObject);
            })
    );
}

// Получает информацию о тесте и загружает информацию о нём на страничку.
function showTestInfo(testRowObject) {
    console.log(testRowObject);
    const isAvailableToStartTest = testRowObject._status === testsStatuses.available || testRowObject._status === testsStatuses.completedCanTryAgain;

    const spinner = $("<span class=\"spinner spinner-border spinner-border-sm hidden\" role=\"status\" aria-hidden=\"true\"></span>");

    $("#selectedTestInfo div").remove();
    $("#selectedTestInfo").append(
        $("<div class=\"container border border-dark mb-2 col-xl-8 col-md-12\">")
            .append(
                $("<h1 class=\"text-center\">").text(testRowObject["name"])
            )
            .append(
                $("<div class=\"container border border-dark col-10\">")
                    .append(
                        $("<div class=\"row\">")
                            .append(
                                $("<p>").html(
                                    'Статус: <b>' + testRowObject._status.text + '</b>'
                                )
                            )
                            .append(
                                $("<p>").html(
                                    'Тест был создан: <b>' + testRowObject["creationDatetime"] + '</b>'
                                )
                            )
                            .append(
                                $("<p>").html(
                                    'Тест будет доступен для прохождения с: <b>' + (testRowObject["openDatetime"] !== null ? testRowObject["openDatetime"] : "-") + '</b>'
                                )
                            )
                            .append(
                                $("<p>").html(
                                    'Тест будет доступен для прохождения по: <b>' + (testRowObject["closeDatetime"] !== null ? testRowObject["closeDatetime"] : "-") + '</b>'
                                )
                            )
                            .append(
                                $("<p>").html(
                                    'Количество попыток сдачи: <b>' + (testRowObject["maxTries"] === "-1" ? "не ограничено" : testRowObject["maxTries"]) + '</b>'
                                )
                            )
                    )
            )
            .append(
                $("<h2 class=\"text-center\">").text("Ваши попытки")
            )
            .append(
                generateTriesTable(testRowObject["testId"])
            )
            .append(
                $("<h2 class=\"text-center mb-4\">").text("Действия")
            )
            .append(
                $("<div class=\"container col-10 mb-3 text-center\">")
                    .append(
                        (isAvailableToStartTest ?
                            // Если возможно начать тест:
                            $("<button id='startNewTry' class=\"btn btn-primary\">")
                                .append(
                                    spinner
                                )
                                .append(
                                    $("<span>").text("Начать новую попытку")
                                )
                                .on('click', e => {
                                    e.preventDefault();
                                    // TODO: код начала теста
                                    // Показываем спиннер:
                                    spinner[0].classList.remove('hidden');
                                    startNewTry(testRowObject["testId"])
                                        .then(
                                            msg => {
                                                console.log(msg);
                                                // Скрываем спиннер:
                                                spinner[0].classList.add('hidden');
                                                if (msg["success"]) {
                                                    if (!msg["error"]) {
                                                        if (msg["hasStarted"]) {
                                                            // Если начали тест:
                                                            const testUrl = siteURL + "/test.html?testId=" + testRowObject["testId"];
                                                            openUrlInNewTab(testUrl);
                                                            // TODO: переделать так, чтобы вставлять сюда не весь код Modal-а
                                                            showModal(
                                                                "<h5 class=\"modal-title\">Тест успешно начат</h5>\n" +
                                                                "                    <button type=\"button\" class=\"btn-close\" data-bs-dismiss=\"modal\" aria-label=\"Закрыть\"></button>",
                                                                "<div class=\"container text-center\">\n" +
                                                                "                        <div class=\"row col-6 m-auto\">\n" +
                                                                "                            <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"100%\" height=\"100%\" viewBox=\"0 -2 24 24\">\n" +
                                                                "                                <g id=\"Lager_17\" data-name=\"Lager 17\" transform=\"translate(-4 -6)\">\n" +
                                                                "                                    <path id=\"Path_19\" data-name=\"Path 19\" d=\"M22.091,16.681a1.97,1.97,0,0,0,.278-.732,1,1,0,0,0-.278-.679L16.574,9.538a2.116,2.116,0,0,1-.01-2.887l.028-.03a1.958,1.958,0,0,1,2.854-.008l8.267,8.613a1.077,1.077,0,0,1,.287.723,2.115,2.115,0,0,1-.287.775l-8.267,8.665a1.959,1.959,0,0,1-2.854-.012l-.028-.036a2.134,2.134,0,0,1,.01-2.9Z\" fill=\"#040505\"/>\n" +
                                                                "                                    <path id=\"Path_20\" data-name=\"Path 20\" d=\"M10.091,16.681a1.97,1.97,0,0,0,.278-.732,1,1,0,0,0-.278-.679L4.574,9.538a2.116,2.116,0,0,1-.01-2.887l.028-.03a1.958,1.958,0,0,1,2.854-.008l8.267,8.613a1.077,1.077,0,0,1,.287.723,2.115,2.115,0,0,1-.287.775L7.446,25.389a1.959,1.959,0,0,1-2.854-.012l-.028-.036a2.134,2.134,0,0,1,.01-2.9Z\" fill=\"#040505\"/>\n" +
                                                                "                                </g>\n" +
                                                                "                            </svg>\n" +
                                                                "                        </div>\n" +
                                                                "                        <div class=\"row\">\n" +
                                                                "                            <p>Тест был успешно начат.</p>\n" +
                                                                "                            <p>Если вы не были перенаправлены на страницу с тестом, нажмите <a class=\"link-primary\" href=\"" + testUrl + "\">сюда</a>.</p>\n" +
                                                                "                        </div>\n" +
                                                                "                    </div>",
                                                                ""
                                                            );
                                                        }
                                                    }
                                                }
                                            }
                                        )
                                        .catch(e => console.log(e))
                                })
                            :
                            // Если тест невозможно начать:
                            $("<button class=\"btn btn-outline-secondary\">").text("Недоступно"))
                    )
            )
    );
}

// Возвращает объект jQuery, который содержит информацию о всех попытках прохождения тестов.
// Информация дополняется async-ом.
function generateTriesTable(testId) {
    let tbody = $("<tbody>");

    // Получаем попытки прохождения и заполняем таблицу с помощью async
    asyncGetTriesTable(testId).then(
        testTries => {
            if (testTries.length > 0) {
                // Если была найдена хотя бы одна попытка...
                testTries.forEach(
                    testTry => {
                        // Для каждой попытки добавляем строку с соответствующими данными:
                        tbody.append(
                            $("<tr>")
                                .append(
                                    // Номер теста
                                    $("<th scope=\"row\">").text(testTry["try"])
                                )
                                .append(
                                    // Дата начала прохождения
                                    $("<td>").text(testTry["startedDatetime"])
                                )
                                .append(
                                    // Оценка тесирования
                                    $("<td>").text(
                                        (testTry["finished"] === "1" ?
                                                // Если тест был пройден:
                                                getScoreText(testTry["score"])
                                                :
                                                // Если тест ещё в прогрессе:
                                                "-"
                                        ))
                                )
                                .append(
                                    // Статус тестирования
                                    $("<td>").text(
                                        (testTry["finished"] === "1" ?
                                                // Если тест был пройден:
                                                triesStasuses.completed.text
                                                :
                                                // Если тест ещё в прогрессе:
                                                triesStasuses.inProgress.text
                                        ))
                                )
                                .append(
                                    // Кнопка "Просмотреть"/"Продолжить"
                                    $("<td>").append(
                                        (testTry["finished"] === "1" ?
                                                // Если тест был пройден:
                                                $("<button class=\"btn btn-outline-secondary\">").data("try", testTry["try"]).text("Просмотреть")
                                                :
                                                // Если тест ещё в прогрессе:
                                                $("<button class=\"btn btn-primary\">").data("try", testTry["try"]).text("Продолжить")
                                                    .on('click', () => {
                                                        const testUrl = siteURL + "/test.html?testId=" + testId;
                                                        openUrlInNewTab(testUrl);
                                                        // TODO: переделать так, чтобы вставлять сюда не весь код Modal-а
                                                        showModal(
                                                            "<h5 class=\"modal-title\">Продолжить тест</h5>\n" +
                                                            "                    <button type=\"button\" class=\"btn-close\" data-bs-dismiss=\"modal\" aria-label=\"Закрыть\"></button>",
                                                            "<div class=\"container text-center\">\n" +
                                                            "                        <div class=\"row col-6 m-auto\">\n" +
                                                            "                            <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"100%\" height=\"100%\" viewBox=\"0 -2 24 24\">\n" +
                                                            "                                <g id=\"Lager_17\" data-name=\"Lager 17\" transform=\"translate(-4 -6)\">\n" +
                                                            "                                    <path id=\"Path_19\" data-name=\"Path 19\" d=\"M22.091,16.681a1.97,1.97,0,0,0,.278-.732,1,1,0,0,0-.278-.679L16.574,9.538a2.116,2.116,0,0,1-.01-2.887l.028-.03a1.958,1.958,0,0,1,2.854-.008l8.267,8.613a1.077,1.077,0,0,1,.287.723,2.115,2.115,0,0,1-.287.775l-8.267,8.665a1.959,1.959,0,0,1-2.854-.012l-.028-.036a2.134,2.134,0,0,1,.01-2.9Z\" fill=\"#040505\"/>\n" +
                                                            "                                    <path id=\"Path_20\" data-name=\"Path 20\" d=\"M10.091,16.681a1.97,1.97,0,0,0,.278-.732,1,1,0,0,0-.278-.679L4.574,9.538a2.116,2.116,0,0,1-.01-2.887l.028-.03a1.958,1.958,0,0,1,2.854-.008l8.267,8.613a1.077,1.077,0,0,1,.287.723,2.115,2.115,0,0,1-.287.775L7.446,25.389a1.959,1.959,0,0,1-2.854-.012l-.028-.036a2.134,2.134,0,0,1,.01-2.9Z\" fill=\"#040505\"/>\n" +
                                                            "                                </g>\n" +
                                                            "                            </svg>\n" +
                                                            "                        </div>\n" +
                                                            "                        <div class=\"row\">\n" +
                                                            "                            <p>Страница для продолжения теста открыта.</p>\n" +
                                                            "                            <p>Если вы не были перенаправлены на страницу с тестом, нажмите <a class=\"link-primary\" href=\"" + testUrl + "\">сюда</a>.</p>\n" +
                                                            "                        </div>\n" +
                                                            "                    </div>",
                                                            ""
                                                        );
                                                    })
                                        )
                                    )
                                )
                        )
                        ;
                    });
            } else {
                // Если попыток не было найдено...
                tbody.append(
                    $("<tr>")
                        .append(
                            $("<td colspan='5' class='text-center'>").text("Вы ещё не проходили данный тест.")
                        )
                );
            }
        }
    ).catch(e => console.log(e));

    return $("<table id=\"testTries\" class=\"table\">")
        .append(
            $("<thead>").html('<tr>' +
                '<th scope="col">Номер попытки</th>' +
                '<th scope="col">Дата начала</th>' +
                '<th scope="col">Оценка</th>' +
                '<th scope="col">Статус</th>' +
                '<th scope="col">Действие</th>' +
                '</tr>')
        )
        .append(tbody)
}

// Производит действия после получения UserInfo
function reactOnUserInfo() {
    if (userInfo["ableToEditTests"] === "1") {
        // Если пользователь может редактировать тесты
        // Показываем соответствующую кнопку:
        $("#editTests").parent().removeClass('hidden');
    }
    if (userInfo["ableToCheckTests"] === "1") {
        // Елси пользователь может проверять тесты
        // Показываем соответствующую кнопку:
        $("#checkTests").parent().removeClass('hidden');
    }

    // TODO: Выводить имя пользователя куда-нибудь
}

// Все действия, проиходящие после получения информации о статусе входа пользователя:
function doAfterCheckingLoginStatus(logined) {
    isUserLogined = logined["logined"];

    // В любом случае:
    $("#navButtonPlaceholder")[0].classList.add('hidden');

    if (isUserLogined) {
        // Если пользователь авторизован на момент входа на сайт:

        // Показываем кнопку выхода из аккаунта:
        $("#logoutButtonListItem")[0].classList.remove('hidden');
        // Получаем инфомрацию о пользователе:
        getUserInfo().then(
            msg => {
                console.log(msg);
                if (msg["success"]) {
                    userInfo = msg["userinfo"];
                    reactOnUserInfo();
                }
            }
        ).catch(e => console.log(e));
        // Получаем список тестов, доступных для прохождения пользователю:
        getAvailableTests().then(
            msg => {
                console.log(msg);
                clearAvailableTests();
                msg["availableTests"].forEach(
                    test => {
                        appendNewAvailableTest(test);
                    }
                );
            }
        ).catch(
            e => console.log(e)
        );
    } else {
        // Если пользователь не авторизован на момент входа на сайт:

        // Показываем кнопки входа в аккаунт и регистрации нового аккаунта:
        $("#loginButtonListItem")[0].classList.remove('hidden');
        $("#registerButtonListItem")[0].classList.remove('hidden');
    }
}

// Возваращает информацию о всех тестах
function getAllTests() {
    let data = {form: {}};
    data["form"]["action"] = "getAllTests";
    console.log(data);
    return postAjax(
        siteURL + '/tests.php',
        data,
        new ConnectException("Произошла ошибка при отправке запроса на получение информации о тестах!")
    );
}

// Очищает содержимое таблицы editTestsTable
// TODO: вынести функционал в отдельную функцию с параметром?
function clearEditTestsTable() {
    $("#editTestsTable tbody tr").remove();
}

// Добавляет тест в таблицу тестов для редактирования
function appendTestToEditTestsTable(editTestRowObject) {
    $("#editTestsTable tbody").append(
        $("<tr>")
            .append(
                $("<th scope='row'>").text(editTestRowObject["name"])
            )
            .append(
                $("<td>").text(getStringOrDash(editTestRowObject["creationDatetime"]))
            )
            .append(
                $("<td>").text(getStringOrDash(editTestRowObject["openDatetime"]))
            )
            .append(
                $("<td>").text(getStringOrDash(editTestRowObject["closeDatetime"]))
            )
            .append(
                $("<td>")
                    .append(
                        $("<button class=\"btn btn-primary\">")
                            .on('click', () => editStudentsGroupsOfTest(editTestRowObject))
                            .text("Редактировать")
                    )
            )
            .append(
                $("<td>")
                    .append(
                        $("<button class=\"btn btn-primary\">")
                            .on('click', () => {
                                console.log('Edit questions testId: ', editTestRowObject["id"]);
                                // TODO: Код для кнопки редактирования вопросов
                            })
                            .text("Редактировать")
                    )
            )
            .append(
                $("<td>").append(
                    $("<div class=\"container text-center\">")
                        .append(
                            $("<div class=\"row mb-1\">").append(
                                $("<div>")
                                    .append(
                                        $("<button class=\"btn btn-primary\">")
                                            .on('click', () => {
                                                console.log('Edit whole testId: ', editTestRowObject["id"]);
                                                // TODO: Код для кнопки редактирования теста
                                            })
                                            .text("Редактировать")
                                    )
                            )
                        )
                        .append(
                            $("<div class=\"row mb-1\">").append(
                                $("<div>")
                                    .append(
                                        $("<button class=\"btn btn-danger\">")
                                            .on('click', () => {
                                                console.log('Delete testId: ', editTestRowObject["id"]);
                                                // TODO: Код для кнопки удаления теста
                                            })
                                            .text("Удалить")
                                    )
                            )
                        )
                )
            )
    );

    function editStudentsGroupsOfTest(editTestRowObject) {
        console.log('Edit groups of testId: ', editTestRowObject["id"]);
        // Код для кнопки редактирования групп
        getTestStudentsGroups(editTestRowObject["id"]).then(msg => {
            console.log(msg);
            // TODO: дополнить
            if (msg["success"]) {
                if (!msg["error"]) {
                    const optionsArray = Array();
                    msg["allStudentsGroups"].forEach(studentsGroup => {
                        optionsArray.push(getSelectOption(studentsGroup["name"], studentsGroup["id"]));
                    });
                    setupGroupsAvailability(editTestRowObject["name"], optionsArray);
                    msg["testStudentsGroups"].forEach(studentGroup => appendGroupToGroupsAvailabilityTable(studentGroup));
                }
            }
        }).catch(e => console.log(e));
    }
}

// Возвращает информацию о студенческих группах, для которых открыто прохождение теста
// Также возвращает список всех групп
function getTestStudentsGroups(testId) {
    let data = {form: {}};
    data["form"]["action"] = "getTestStudentsGroups";
    data["form"]["testId"] = testId;
    console.log(data);
    return postAjax(
        siteURL + '/tests.php',
        data,
        new ConnectException("Произошла ошибка при отправке запроса на получение информации о группах, для которых открыто прохождение теста!")
    );
}

// Настраивает groupsAvailabilityPlaceholder
// optionsArray содержит массив объектов типа selectOption (см. выше)
//  - Изменяет название блока
//  - Заменяет option-ы select-а
//  - Очищает содержимое таблицы groupsAvailabilityTable
function setupGroupsAvailability(testName, optionsArray) {
    $("#editGroupsAvailabilityTestName").text(testName);
    setSelectOptions("#editGroupsGroupName", optionsArray);
    clearGroupsAvailabilityTable();
}

// Очищает содержимое таблицы groupsAvailabilityTable
// TODO: вынести функционал в отдельную функцию с параметром?
function clearGroupsAvailabilityTable() {
    $("#groupsAvailabilityTable tbody tr").remove();
}

// Добавляет группу в таблицу групп для редактирования
function appendGroupToGroupsAvailabilityTable(groupRowObject) {
    $("#groupsAvailabilityTable tbody").append(
        $("<tr>").append(
            $("<th scope=\"row\">").text(groupRowObject["name"])
        ).append(
            $("<td>").append(
                $("<div class=\"container text-center\">").append(
                    $("<div class=\"row mb-1\">").append(
                        $("<div>").append(
                            $("<button class=\"btn btn-danger\">")
                                .on('click', () => {
                                    // TODO: Код для удаления группы.
                                    console.log('Delete group: ', groupRowObject["id"]);
                                })
                                .text("Удалить")
                        )
                    )
                )
            )
        )
    )
}

$(() => {
    $('#logIn').on('click', e => {
        e.preventDefault();

        // Если неверные данные - не отправляем запрос на регистрацию.
        if (!validateLoginForm()) {
            return;
        }

        let lul = $("#luserLogin");
        let lup = $("#luserPassword");

        lul[0].disabled = true;
        lup[0].disabled = true;

        // Показываем спиннер:
        $('#logIn .spinner')[0].classList.remove('hidden');
        logIntoAccount(lul.val(), lup.val())
            .then(msg => {
                console.log(msg);
                if (msg["success"]) {
                    if (msg["logined"]) {
                        console.log("Успешно вошли!");
                        $("#loginCompleted")[0].classList.remove('hidden');
                        $("#loginForm")[0].classList.add('hidden');
                    } else {
                        $("#luserPasswordValidation")
                            .text(msg["error"]);
                        lup[0].classList.add('is-invalid');
                    }
                }
                lul[0].disabled = false;
                lup[0].disabled = false;
                // Скрываем спиннер:
                $('#logIn .spinner')[0].classList.add('hidden');
            });
    });
    $('#register').on('click', e => {
        e.preventDefault();

        // Если неверные данные - не отправляем запрос на регистрацию.
        if (!validateRegisterForm()) {
            return;
        }

        let rul = $("#ruserLogin");
        let rue = $("#ruserEmail");
        let rup = $("#ruserPassword");
        let rupa = $("#ruserPasswordAgain");

        rul[0].disabled = true;
        rue[0].disabled = true;
        rup[0].disabled = true;
        rupa[0].disabled = true;

        // Показываем спиннер:
        $('#register .spinner')[0].classList.remove('hidden');
        registerAccount(rul.val(), rup.val(), rue.val())
            .then(msg => {
                console.log(msg);
                if (msg["success"]) {
                    if (msg["registered"]) {
                        console.log("Успешно вошли!");
                        $("#registerCompleted")[0].classList.remove('hidden');
                        $("#registerForm")[0].classList.add('hidden');
                    } else {
                        if (msg["errorObject"] === "login") {
                            $("#ruserLoginValidation")
                                .text(msg["error"]);
                            rul[0].classList.add('is-invalid');
                        }
                    }
                }
                rul[0].disabled = false;
                rue[0].disabled = false;
                rup[0].disabled = false;
                rupa[0].disabled = false;
                // Скрываем спиннер:
                $('#register .spinner')[0].classList.add('hidden');
            });
    });
    $('#logOut').on('click', e => {
        e.preventDefault();
        // Показываем спиннер:
        $("#loginFormLoader")[0].style.display = "";
        // Скрываем блок краткого описания выхода из аккаунта.
        $("#userShortInfo")[0].classList.add("hidden");
        logOutOfAccount()
            .then(
                msg => {
                    console.log(msg);
                    // Скрываем спиннер:
                    $("#loginFormLoader")[0].style.display = "none";
                    // Показываем блок входа.
                    $("#loginForm")[0].classList.remove("hidden");
                }
            )
            .catch(
                e => console.log(e)
            );
    });
    $('#editTests').on('click', e => {
        e.preventDefault();
        clearEditTestsTable();
        getAllTests().then(
            msg => {
                console.log(msg);
                if (msg["success"]) {
                    if (!msg["error"]) {
                        msg["tests"].forEach(
                            test => appendTestToEditTestsTable(test)
                        );
                    }
                }
            }
        ).catch(e => console.log(e));
    });
    $('#checkTests').on('click', e => {
        e.preventDefault();
    });

    checkUserLoginStatus()
        .catch(e => console.log(e))
        .then(
            logined => {
                doAfterCheckingLoginStatus(logined);
            }
        );

    // $("#devModal").modal('show');
});