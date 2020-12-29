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
        $("<tr class='testRow'>")
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
            .off('click').on('click', () => {
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
        unhideElement($('#testControls'));
        // Если пользователь может редактировать тесты
        // Показываем соответствующую кнопку:
        $("#editTests").parent().removeClass('hidden');
    }
    if (userInfo["ableToCheckTests"] === "1") {
        unhideElement($('#testControls'));
        // Елси пользователь может проверять тесты
        // Показываем соответствующую кнопку:
        $("#checkTests").parent().removeClass('hidden');
        $("#getResults").parent().removeClass('hidden');
    }
    if (userInfo["ableToChangeUsersStudentGroup"] === "1"){
        unhideElement($('#testControls'));
        // Елси пользователь может менять студенческие группы пользователей
        $('#setUserGroup').parent().removeClass('hidden');
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
        // Показываем таблицу с тестами
        unhideElement($('#availableTestsPlaceholder'));

        // Показываем кнопку выхода из аккаунта:
        $("#logoutButtonListItem")[0].classList.remove('hidden');
        // Показываем кнопку перехода в личный кабинет:
        unhideElement($("#userAccountButtonListItem"));
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

const placeholders = [
    "editGroupsAvailabilityPlaceholder",
    "editTestPlaceholder",
    "editQuestionsPlaceholder",
    "editAnswersPlaceholder",
];

// Делает все PlaceHolder-ы скрытыми
function hideAllPlaceholders() {
    placeholders.forEach(placeholder => hideElementBySelector("#" + placeholder));
}

// Делает все PlaceHolder-ы скрытыми, затем отменяет скрытие одного элемента
function hideAllPlaceholdersExceptOne(showPlaceholder) {
    hideAllPlaceholders();
    unhideElementBySelector("#" + showPlaceholder);
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
                $("<td>").text((editTestRowObject["locked"] === "1" ? "Закрыт" : "Открыт"))
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
                            .on('click', () => editQuestionsOfTest(editTestRowObject))
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
                                                hideAllPlaceholdersExceptOne("editTestPlaceholder");
                                                setupEditTestPlaceholder(editTestRowObject["id"], editTestRowObject["name"], editTestRowObject["openDatetime"], editTestRowObject["closeDatetime"], editTestRowObject["maxTries"], editTestRowObject["locked"]);
                                            })
                                            .text("Редактировать")
                                    )
                            )
                        )
                )
            )
    );

    function editQuestionsOfTest(editTestRowObject) {
        hideAllPlaceholdersExceptOne("editQuestionsPlaceholder");
        console.log('Edit questions testId: ', editTestRowObject["id"]);
        // Подготваливаем placeHolder
        setupEditQuestionsPlaceholder(editTestRowObject["id"], editTestRowObject["name"]);
        getTestQuestionsForEdit(editTestRowObject["id"]).then(msg => {
            console.log(msg);
            if (msg["success"]) {
                if (!msg["error"]) {
                    // Заполяем вопросы:
                    msg["questions"].forEach(
                        question =>
                            appendQuestionToEditTestQuestionsTable(question)
                    );
                    // Нажатие кнопки "Редактировать" вверху таблицы вопросов.
                    $("#addQuestionToTest").off('click');
                    $("#editTestQuestionsButton").off('click').on('click', () => {
                        hideAllPlaceholdersExceptOne("editAnswersPlaceholder");
                        console.log('Edit questions of test tId:', editTestRowObject["id"]);
                        // Выводим все вопросы с ответами, открытыми для редактирования:
                        setupAnswers(editTestRowObject["id"], msg["questions"], msg["answers"], msg["questionTypes"]);
                    })
                }
            }
        }).catch(e => console.log(e));
    }

    function editStudentsGroupsOfTest(editTestRowObject) {
        console.log('Edit groups of testId: ', editTestRowObject["id"]);
        hideAllPlaceholdersExceptOne("editGroupsAvailabilityPlaceholder");
        // Код для кнопки редактирования групп
        getTestStudentsGroups(editTestRowObject["id"]).then(msg => {
            console.log(msg);
            if (msg["success"]) {
                if (!msg["error"]) {
                    const optionsArray = Array();
                    msg["allStudentsGroups"].forEach(studentsGroup => {
                        optionsArray.push(getSelectOption(studentsGroup["name"], studentsGroup["id"]));
                    });
                    // TODO: вынести следующую строку выше .then(), разбив подготвку на две части
                    setupGroupsAvailabilityPlaceholder(editTestRowObject["id"], editTestRowObject["name"], optionsArray);
                    msg["testStudentsGroups"].forEach(studentGroup => appendGroupToGroupsAvailabilityTable(studentGroup, editTestRowObject["id"]));
                }
            }
        }).catch(e => console.log(e));
    }
}

// Устанавливает начальное значение полей editTestPlaceholder, а также настраивает кнопки
function setupEditTestPlaceholder(testId, testName, openDate, closeDate, triesCount, closed, createNew = false) {
    function convertDBTimeToDatetimeInputTime(DBTime) {
        return DBTime.replace(' ', 'T');
    }

    function convertDatetimeInputTimeToDBTime(InputTime) {
        return (InputTime !== "" ? InputTime.replace('T', ' ') : null)
        // if (InputTime === "")
        //     return null;
        // return InputTime.replace('T', ' ');
    }

    const testNameTitle = $("#editTestTestName");
    const testNameInput = $("#editTestName");
    const testOpenDateInput = $("#editTestOpenDate");
    const testCloseDateInput = $("#editTestCloseDate");
    const testClosedCheckbox = $("#editTestClosed");
    const testTriesCount = $("#editTestTriesCount");

    testNameTitle.text(testName);
    testNameInput.val(testName);
    testOpenDateInput.val((openDate !== null ? convertDBTimeToDatetimeInputTime(openDate) : ""));
    testCloseDateInput.val((closeDate !== null ? convertDBTimeToDatetimeInputTime(closeDate) : ""));
    testTriesCount.val(triesCount);
    testClosedCheckbox.attr('checked', (closed === "1"));

    $("#saveTest").off('click').on('click', e => {
        e.preventDefault();
        const tempTest = {
            id: (createNew ? null : testId),
            closeDatetime: convertDatetimeInputTimeToDBTime(testCloseDateInput.val()),
            openDatetime: convertDatetimeInputTimeToDBTime(testOpenDateInput.val()),
            creationDatetime: (createNew ? convertDatetimeInputTimeToDBTime(new Date().toISOString().split('.')[0]) : "2020-12-22 14:19:17"),
            locked: ($("#editTestClosed").is(':checked') ? "1" : "0"),
            name: testNameInput.val(),
            maxTries: testTriesCount.val(),
            timeToComplete: null,
        }
        console.log(tempTest);
        if (createNew) {
            // Создание нового
            createOrUpdateTest(tempTest, true)
                .then(msg => {
                    console.log(msg);
                    reloadTestEditTable();
                }).catch(e => console.log(e));
        } else {
            // Изменение существующего
            createOrUpdateTest(tempTest, false)
                .then(msg => {
                    console.log(msg);
                    reloadTestEditTable();
                }).catch(e => console.log(e));
        }
        hideAllPlaceholders();
    });
    // TODO: удаление теста
    // $("#deleteTest").off('click').on('click', e => {
    //     e.preventDefault();
    //     reloadTestEditTable();
    //     hideAllPlaceholders();
    // });
}

// Перезагружает список тестов для редактирования
function reloadTestEditTable(){
    hideElement($('#editTests .spinner'));
    setDisabledInput($('#editTests'), false);
    // Очищаем список тестов
    hideElementBySelector("#editTestsTableContainer");
    clearEditTestsTable();
    getAllTests().then(
        // Заполняем список тестов
        getAllTestsHandler
    ).catch(e => console.log(e));

    function getAllTestsHandler(msg) {
        console.log(msg);
        if (msg["success"]) {
            if (!msg["error"]) {
                msg["tests"].forEach(
                    test => appendTestToEditTestsTable(test)
                );
                unhideElementBySelector("#editTestsTableContainer");
                $("#createNewTest").off('click').on('click', () => {
                    hideAllPlaceholdersExceptOne("editTestPlaceholder");
                    setupEditTestPlaceholder(null, "Новый тест", null, null, 1, false, true);
                })
            }
        }
    }
}

function createOrUpdateTest(testObject, createNew) {
    let data = {form: {}};
    data["form"]["action"] = "createOrUpdateTest";
    data["form"]["testObject"] = testObject;
    data["form"]["createNew"] = createNew;
    console.log(data);
    return postAjax(
        siteURL + '/tests.php',
        data,
        new ConnectException("Произошла ошибка при отправке запроса на создание/обновление теста!")
    );
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
//  - Добавляет data для кнопки добавления группы
//  - Очищает содержимое таблицы groupsAvailabilityTable
function setupGroupsAvailabilityPlaceholder(testId, testName, optionsArray) {
    $("#editGroupsAvailabilityTestName").text(testName);
    setSelectOptionsBySelector("#editGroupsGroupName", optionsArray);
    $('#addStudentsGroupToTest').data('testId', testId)
    clearGroupsAvailabilityTable();
}

// Очищает содержимое таблицы groupsAvailabilityTable
// TODO: вынести функционал в отдельную функцию с параметром?
function clearGroupsAvailabilityTable() {
    $("#groupsAvailabilityTable tbody tr").remove();
}

// Добавляет группу к тесту, обновляя список групп, которым доступно выполнение теста
function addStudentGroupToTest(testId, groupId) {
    let data = {form: {}};
    data["form"]["action"] = "addStudentsGroupToTest";
    data["form"]["testId"] = testId;
    data["form"]["groupId"] = groupId;
    console.log(data);
    return postAjax(
        siteURL + '/tests.php',
        data,
        new ConnectException("Произошла ошибка при отправке запроса на добавление студенческой группы к тесту!")
    );
}

// Добавляет группу в таблицу групп для редактирования
function appendGroupToGroupsAvailabilityTable(groupRowObject, testId) {
    $("#groupsAvailabilityTable tbody").append(
        $("<tr>").append(
            $("<th scope=\"row\">").text(groupRowObject["name"])
        ).append(
            $("<td>").append(
                $("<div class=\"container text-center\">").append(
                    $("<div class=\"row mb-1\">").append(
                        $("<div>").append(
                            $("<button class=\"btn btn-danger\">")
                                .on('click', e => deleteGroupFromTestsButtonHandle(e, testId))
                                .text("Удалить")
                        )
                    )
                )
            )
        )
    )

    function deleteGroupFromTestsButtonHandle(e, testId) {
        // Код для удаления группы.
        console.log('Delete group: ', groupRowObject["id"]);
        e.preventDefault();
        e.target.setAttribute('disabled', true);
        deleteStudentGroupFromTest(testId, groupRowObject["id"]).then(
            msg => {
                console.log(msg);
                if (msg["success"]) {
                    if (!msg["error"]) {
                        if (msg["removed"]) {
                            clearGroupsAvailabilityTable();
                            msg["currentTestStudentsGroups"].forEach(group => appendGroupToGroupsAvailabilityTable(group));
                        }
                    }
                }
            }
        ).catch(e => console.log(e));
    }
}

// Удаляет группу из таблицы групп для редактирования
function deleteStudentGroupFromTest(testId, groupId) {
    let data = {form: {}};
    data["form"]["action"] = "removeStudentsGroupFromTest";
    data["form"]["testId"] = testId;
    data["form"]["groupId"] = groupId;
    console.log(data);
    return postAjax(
        siteURL + '/tests.php',
        data,
        new ConnectException("Произошла ошибка при отправке запроса на удаление студенческой группы к тесту!")
    );
}

// Возвращает информацию о вопросах теста с их ответами
function getTestQuestionsForEdit(testId) {
    let data = {form: {}};
    data["form"]["action"] = "getTestQuestionsForEdit";
    data["form"]["testId"] = testId;
    console.log(data);
    return postAjax(
        siteURL + '/tests.php',
        data,
        new ConnectException("Произошла ошибка при отправке запроса на получение информации о вопросах теста!")
    );
}

// Настраивает editQuestionsPlaceholder
// optionsArray содержит массив объектов типа selectOption (см. выше)
//  - Изменяет название блока
//  - Очищает содержимое таблицы groupsAvailabilityTable
function setupEditQuestionsPlaceholder(testId, testName) {
    $("#editQuestionsTestName").text(testName);
    clearEditTestQuestionsTable();
}

// Очищает содержимое таблицы editTestQuestionsTable
// TODO: вынести функционал в отдельную функцию с параметром?
function clearEditTestQuestionsTable() {
    $("#editTestQuestionsTable tbody tr").remove();
}

// Добавляет вопрос в таблицу вопросов для редактирования
function appendQuestionToEditTestQuestionsTable(questionRowObject) {
    $("#editTestQuestionsTable tbody").append(
        $("<tr>").append(
            $("<th scope=\"row\">").text(questionRowObject["id"])
        )
            .append(
                $("<td>").text(questionRowObject["text"])
            )
            .append(
                $("<td>").text(questionRowObject["questionTypeName"])
            )
    )
}

// Очищает и заполняет таблицу editQuestionAnswersTable
function setupAnswers(testId, questionsArray, answersArray, questionTypes) {
    clearEditQuestionAnswersTable();
    const tableBody = $("#editQuestionAnswersTable tbody");
    // Записываем в data всю информацию о вопросе
    tableBody.data('questions', questionsArray);
    tableBody.data('answers', answersArray);
    tableBody.data('wasChanged', false); // Флаг, указывающий на то, было ли хоть одно значение в таблице изменено.
    tableBody.data('canUpdate', true); // Флаг, указывающий на то, можно ли загрузить таблицу в БД без пересоздания, а лишь Update-а.


    // Данная функция вызывается при изменении текста вопроса и/или типа вопроса
    // Передаётся вниз по дереву в вызове appendQuestionInEditQuestionAnswersTable
    const updateQuestion = (id, newQuestionText = null, newQuestionType = null, deleted = false) => {
        if (deleted) {
            tableBody.data('wasChanged', true);
            tableBody.data('canUpdate', false);

            // Удаляем вопросы и ответы с соответствующим id
            const idInt = parseInt(id);
            tableBody.data('questions', tableBody.data('questions').filter(
                qst => {
                    if (qst["id"] !== id) {
                        // Если id элемента больше, чем id удаляемого элемента, уменьшаем его на 1.
                        const qstIdInt = parseInt(qst["id"]);
                        if (qstIdInt > idInt) {
                            qst["id"] = (qstIdInt - 1).toString();
                            updateQuestionRowInEditQuestionAnswersTable(qstIdInt.toString(), qst["id"], null, null);
                        }
                        return true;
                    }
                    return false;
                }
            ));
            tableBody.data('answers', tableBody.data('answers').filter(
                ans => {
                    return ans["questionId"] !== id;
                }
            ));
            return;
        }
        let temp = tableBody.data('questions').filter(
            q => {
                return q["id"] === id;
            }
        )[0];
        console.log('Updating question id:', id, 'new qText:', newQuestionText, 'new qType', newQuestionType);
        if (newQuestionText !== null) {
            temp["text"] = newQuestionText;
            tableBody.data('wasChanged', true);
        }
        if (newQuestionType !== null) {
            temp["questionTypeId"] = newQuestionType;
            tableBody.data('wasChanged', true);
            tableBody.data('canUpdate', false);
        }
    }

    const updateAnswer = (answerId, newAnswerText, newAnswerCorrectness, deleted = false, created = false, newAnswer = null) => {
        if (deleted) {
            tableBody.data('wasChanged', true);
            tableBody.data('answers', tableBody.data('answers').filter(
                ans => {
                    return ans["answerId"] !== answerId;
                }
            ));
            console.log('Deleting answer id:', answerId, 'new aText:', newAnswerText, 'new aCorr', newAnswerCorrectness);
            return;
        }
        if (created) {
            tableBody.data('wasChanged', true);
            newAnswer["answerId"] = (getMaxIdFromAnswers(tableBody.data('answers')) + 1).toString();
            tableBody.data('answers').push(newAnswer);
            console.log('Created answer id:', answerId, 'obj:', newAnswer);
            return;
        }
        let temp = tableBody.data('answers').filter(
            a => {
                return a["answerId"] === answerId;
            }
        )[0];
        console.log('Updating answer id:', answerId, 'new aText:', newAnswerText, 'new aCorr', newAnswerCorrectness);
        if (newAnswerText !== null) {
            temp["answer"] = newAnswerText;
            tableBody.data('wasChanged', true);
        }
        if (newAnswerCorrectness !== null) {
            temp["correct"] = newAnswerCorrectness;
            tableBody.data('wasChanged', true);
        }
    }

    // Создание вопросов из переданного массива:
    questionsArray.forEach(
        question => {
            appendQuestionInEditQuestionAnswersTable(testId, question, answersArray.filter(
                answer => {
                    return answer["questionId"] === question.id
                }
            ), questionTypes, updateQuestion, updateAnswer)
        }
    );

    // Создание вопросов по нажатию кнопки:
    $("#addQuestionToTest").off('click').on('click', () => {
        console.log('Add question to test');
        const tableBody = $("#editQuestionAnswersTable tbody");
        tableBody.data('wasChanged', true);
        tableBody.data('canUpdate', false);

        const tempQuestion = {
            id: (getMaxIdFromQuestions(tableBody.data('questions')) + 1).toString(),
            hasCorrectAnswer: questionTypes[0]["hasCorrectAnswer"],
            hasVariants: questionTypes[0]["hasVariants"],
            questionTypeId: questionTypes[0]["id"],
            questionTypeName: questionTypes[0]["name"],
            text: "Новый вопрос",
        }

        appendQuestionInEditQuestionAnswersTable(testId, tempQuestion, [], questionTypes, updateQuestion, updateAnswer);
        tableBody.data('questions').push(tempQuestion);

        // Вовзвращает максимальный id, хранимый в массиве вопросов questions.
        function getMaxIdFromQuestions(questionsArray) {
            if (questionsArray.length > 0) {
                let maxInt = 0;
                questionsArray.forEach(
                    question => {
                        maxInt = Math.max(maxInt, parseInt(question["id"]));
                    }
                );
                return maxInt;
            } else {
                return 0;
            }
        }
    });

    // Сохранение теста по нажатию кнопки:
    $("#saveQuestionToTest").off('click').on('click', () => {
        console.log('Save test');
        const tableBody = $("#editQuestionAnswersTable tbody");
        console.log(tableBody.data());
        sendEditedTest(testId, tableBody.data()).then(msg => {
            console.log(msg);
            // TODO: закрыть редактирование теста
        });
    });
}

// Отправляет на сервер обновлённый (или созданный) тест
// testData - объект, состоящий из массивов answers, questions и двух переменных: canUpdate и wasChanged
function sendEditedTest(testId, testData) {
    let data = {form: {}};
    data["form"]["action"] = "sendEditedTest";
    data["form"]["testId"] = testId;
    data["form"]["testData"] = testData;

    console.log(data);

    return postAjax(
        siteURL + '/tests.php',
        data,
        new ConnectException("Произошла ошибка при отправке теста на сервер!")
    );
}

// Возвращает максимальный id, хранимый в массиве вопросов questions.
function getMaxIdFromAnswers(answersArray) {
    if (answersArray.length > 0) {
        let maxInt = 0;
        answersArray.forEach(
            answer => {
                maxInt = Math.max(maxInt, parseInt(answer["answerId"]));
            }
        );
        return maxInt;
    } else {
        return 0;
    }
}

// Очищает содержимое таблицы editQuestionAnswersTable
// TODO: вынести функционал в отдельную функцию с параметром?
function clearEditQuestionAnswersTable() {
    $("#editQuestionAnswersTable tbody tr").remove();
}

// Обновление ряда в таблице editQuestionAnswersTable
function updateQuestionRowInEditQuestionAnswersTable(questionId, newQuestionId = null, newQuestionText = null, newQuestionType = null) {
    $("#editQuestionAnswersTable tbody>tr").each(
        function () {
            if ($(this).data('questionId') === questionId) {
                if (newQuestionId !== null) {
                    $(this).data('questionId', newQuestionId);
                    $(this).find('.questionId').text(newQuestionId);
                }
                if (newQuestionText !== null) {
                    $(this).data('questionText', newQuestionText);
                    $(this).find('.questionText').val(newQuestionText);
                }
                if (newQuestionType !== null) {
                    $(this).data('questionType', newQuestionType);
                    $(this).find('.questionTypes').val(newQuestionType);
                }
            }
        }
    );
}

// Добавляет в таблицу editQuestionAnswersTable новую заполненную строку
function appendQuestionInEditQuestionAnswersTable(testId, question, answersArray, questionTypes, updateQuestionFunc, updateAnswerFunc) {
    let answersTable = $("<table class=\"table border border-dark\">")
        .append(
            $("<thead>").html(
                "<th>Ответ</th>" +
                "<th>Правильный?</th>" +
                "<th></th>"
            )
        );
    if (question["hasCorrectAnswer"] === "1") {
        // Заполнение таблицы ответов переданными значениями
        answersArray.forEach(
            answ => addAnswerToTableInQuestion(answersTable, answ)
        );
    }

    function addAnswerToTableInQuestion(answersTable, answer) {
        const thisTr = $("<tr>");

        answersTable.append(
            thisTr
                .append(
                    $("<td>").append(
                        $("<input class='form-control' type='text'>").val(answer["answer"])
                            .on('change', function () {
                                // При изменении текста ответа:
                                updateAnswerFunc(answer["answerId"], $(this).val(), null);
                            })
                    )
                )
                .append(
                    $("<td>").append(
                        $("<input class='form-check-input' type=\"checkbox\" " + (answer["correct"] === "1" ? 'checked' : '') + ">")
                            .on('click', function () {
                                // При изменении правильности ответа:
                                updateAnswerFunc(answer["answerId"], null, ($(this).is(":checked") ? "1" : "0"));
                            })
                    )
                )
                .append(
                    $("<td>").append(
                        $("<button class='btn btn-danger'>").text('X')
                            .on('click', deleteQuestionButtonHandler)
                    )
                )
        );

        function deleteQuestionButtonHandler() {
            console.log('Delete questionId:', question["id"])
            thisTr.remove();
            updateAnswerFunc(answer["answerId"], null, null, true);
        }
    }

    const select = $("<select class='questionTypes'>")
        .data('questionType', question["questionTypeId"]);

    questionTypes.forEach(
        qType => {
            select.append(
                $("<option>").val(qType["id"]).text(qType["name"])
            )
        }
    );

    const tRow = $("<tr>");

    $("#editQuestionAnswersTable tbody").append(
        tRow
            .append(
                $("<th class='questionId' scope=\"row\">").text(question["id"])
            )
            .append(
                $("<td>").append(
                    $("<textarea class='questionText form-control' rows='3'>").val(question["text"])
                        .on('change', changeQuestionTextInputHandler)
                )
            )
            .append(
                $("<td>").append(
                    select.val(question["questionTypeId"])
                        .on('change', changeQuestionTypeButtonHandler)
                )
            )
            .append(
                $("<td>")
                    .append(
                        $("<div>")
                            .append(
                                answersTable
                                    .data('answers', answersArray)
                            )
                            .append(
                                $("<button class='btn btn-outline-secondary'>")
                                    .text("Добавить ответ")
                                    .on('click', addNewAnswerToQuestionButtonHandler
                                    )
                            )
                    )
            )
            .append(
                $("<td>").append($("<div class=\"container text-center\">").append(
                    $("<div class=\"row mb-1\">").append($("<div>").append(
                        $("<button class=\"btn btn-danger\">")
                            .text("Удалить")
                            .on('click', deleteQuestionButtonHandler)
                    ))
                ))
            )
            .data('questionId', question["id"])
            .data('questionText', question["text"])
            .data('questionType', question["questionTypeId"])
    );

    function deleteQuestionButtonHandler() {
        console.log('Delete question qId:', question["id"]);
        tRow.remove();
        updateQuestionFunc(question["id"], null, null, true);
    }

    function changeQuestionTextInputHandler() {
        // При изменении текста вопроса
        tRow.data('questionText', $(this).val());
        updateQuestionFunc(question["id"], $(this).val(), null);
    }

    function changeQuestionTypeButtonHandler() {
        // При изменении типа вопроса
        tRow.data('questionType', $(this).val());
        updateQuestionFunc(question["id"], null, $(this).val());

        let doesCurrentQuestionTypeHasCorrectAnswer = true;
        doesCurrentQuestionTypeHasCorrectAnswer = (questionTypes.filter(qt => {
            return qt["id"] === $(this).val();
        })[0]["hasCorrectAnswer"] === "1");
        if (doesCurrentQuestionTypeHasCorrectAnswer) {
            console.log('Showing table!');
            answersTable.parent().removeClass('hidden');
        } else {
            answersTable.parent().addClass('hidden');
            console.log('Hiding table, deleting answers!');
            // Удаляем все вопросы, которые связаны с question["id"]:
            answersTable.find("tr").remove();
            const tBody = $("#editQuestionAnswersTable tbody");
            tBody.data('answers',
                tBody.data('answers').filter(
                    answ => {
                        return answ["questionId"] !== question["id"];
                    }
                )
            );
            tBody.data('wasChanged', true);
            tBody.data('canUpdate', false);
        }
    }

    function addNewAnswerToQuestionButtonHandler(e) {
        console.log('Add answer to qId:', question["id"]);
        let tempAnswer = {
            answer: "",
            answerId: null,
            correct: "0",
            questionId: question["id"],
        }
        updateAnswerFunc(null, null, null, false, true, tempAnswer);
        addAnswerToTableInQuestion(answersTable, tempAnswer);
    }

    if (question["hasCorrectAnswer"] !== "1") {
        answersTable.parent().addClass('hidden');
    }
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
                        // Перезагружаем страницу через 1 секунду
                        setTimeout(() => {
                            document.location.reload();
                        }, 1000)
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

        logOutOfAccount()
            .then(
                msg => {
                    console.log(msg);
                    document.location.reload();
                }
            )
            .catch(e => console.log(e));
    });
    $('#editTests').on('click', function () {
        const editTestsButton = $(this);
        const editTestsButtonLoader = $(this).find(".spinner");

        unhideElement(editTestsButtonLoader);
        setDisabledInput(editTestsButton, true);

        hideAllTestControlsPlaceholders();
        unhideElementBySelector("#editTestsPlaceholder");
        reloadTestEditTable();
    });
    $('#checkTests').on('click', e => {
        e.preventDefault();
    });

    const addStudentsGroupToTestButton = $('#addStudentsGroupToTest');
    addStudentsGroupToTestButton.on('click', addStudentsGroupToTestClickHandler);

    // Добавляет группу к списку и обновляет список
    function addStudentsGroupToTestClickHandler(e) {
        e.preventDefault();
        const _this = addStudentsGroupToTestButton;
        if (_this.data('testId') === undefined) {
            // Если данные не заданы, значит тест для изменения группы ещё не был выбран.
            // Данные для данной кнопки задаются внутри f setupGroupsAvailabilityPlaceholder.
            return;
        }
        // Показываем спиннер:
        _this.find(".spinner").removeClass('hidden');
        // Отправляем запрос на сервер:
        addStudentGroupToTest(_this.data('testId'), $("#editGroupsGroupName").val())
            .then(
                addStudentGroupToTestHandle
            ).catch(e => console.log(e));

        function addStudentGroupToTestHandle(msg) {
            console.log(msg);
            if (msg["success"]) {
                if (!msg["error"]) {
                    if (msg["added"]) {
                        clearGroupsAvailabilityTable();
                        msg["currentTestStudentsGroups"].forEach(group => appendGroupToGroupsAvailabilityTable(group));
                    }
                }
            }
            // Скрываем спиннер:
            _this.find(".spinner").addClass('hidden');
        }
    }

    $("#userAccount").on('click', () => openUrlInNewTab(siteURL + "/account.html"));

    checkUserLoginStatus()
        .catch(e => console.log(e))
        .then(
            logined => {
                doAfterCheckingLoginStatus(logined);
            }
        );

    // $("#devModal").modal('show');
});