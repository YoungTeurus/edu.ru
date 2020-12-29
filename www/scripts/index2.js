const checkTestsUserTableColNumber = 4;

// Получает все тесты, у которых есть вопросы без правильного ответа (которые нужно проверять вручную)
function getTestsWithQuestionsWithoutCorrectAnswer() {
    let data = {form: {}};
    data["form"]["action"] = "getTestsWithQuestionsWithoutCorrectAnswer";
    console.log(data);
    return postAjax(
        siteURL + '/tests.php',
        data,
        new ConnectException("Произошла ошибка при отправке запроса на получение всех тестов, у которых есть вопросы без правильного ответа (которые нужно проверять вручную)!")
    );
}

// Получает все прохождения теста, в которых есть непроверенные ответы
function getUncheckedQuestions(testId) {
    let data = {form: {}};
    data["form"]["action"] = "getUncheckedQuestions";
    data["form"]["testId"] = testId;
    console.log(data);
    return postAjax(
        siteURL + '/tests.php',
        data,
        new ConnectException("Произошла ошибка при отправке запроса на получение всех прохождения теста, в которых есть непроверенные ответы!")
    );
}

// Очищает содержимое таблицы checkTestsUserTable
// TODO: вынести функционал в отдельную функцию с параметром?
function clearCheckTestsUserTable() {
    $("#checkTestsUserTable tbody tr").remove();
}

// Получает вопрос, который нужно досмотреть, и ответ студента
function getQuestionsWithoutCorrectAnswerWithUserAnswers(testId, userId, tryId) {
    let data = {form: {}};
    data["form"]["action"] = "getQuestionsWithoutCorrectAnswerWithUserAnswers";
    data["form"]["testId"] = testId;
    data["form"]["userId"] = userId;
    data["form"]["try"] = tryId;
    console.log(data);
    return postAjax(
        siteURL + '/tests.php',
        data,
        new ConnectException("Произошла ошибка при отправке запроса на получение вопросов, которые нужно досмотреть, и ответов студента!")
    );
}

// Устанавливает ответу пользователя правильность
function setAnswerCorrectness(testId, userId, tryId, questionId, correctness){
    let data = {form: {}};
    data["form"]["action"] = "setAnswerCorrectness";
    data["form"]["testId"] = testId;
    data["form"]["userId"] = userId;
    data["form"]["tryId"] = tryId;
    data["form"]["questionId"] = questionId;
    data["form"]["correctness"] = correctness;
    console.log(data);
    return postAjax(
        siteURL + '/tests.php',
        data,
        new ConnectException("Произошла ошибка при отправке запроса на устанавливание ответу пользователя правильность!")
    );
}

// Форсированно завершает указанный тест и пересчитывает оценку теста
function forceEndTest(testId, userId, tryId){
    let data = {form: {}};
    data["form"]["action"] = "forceEndTest";
    data["form"]["testId"] = testId;
    data["form"]["userId"] = userId;
    data["form"]["tryId"] = tryId;
    console.log(data);
    return postAjax(
        siteURL + '/tests.php',
        data,
        new ConnectException("Произошла ошибка при отправке запроса на форсированное завершение указанного теста и пересчитывания оценки теста!")
    );
}

function appendCheckTestsUserTable(result) {
    const tbody = $("#checkTestsUserTable tbody");
    const appendedRow = $("<tr>");

    //<editor-fold desc="Всё, связанное с табличкой вопрос-ответ-действие">
    const tableWithQuestionAndAnswerTbody = $("<tbody>");
    const tableWithQuestionAndAnswer = $("<table class='table hidden'>").html(
        "<thead>" +
        "<tr>" +
        "    <th>Вопрос</th>" +
        "    <th>Ответ</th>" +
        "    <th>Отметить как правильный?</th>" +
        "</tr>" +
        "</thead>"
    ).append(
        tableWithQuestionAndAnswerTbody
    );
    const rowWithTable = $("<tr>").append(
        $("<td colspan='" + checkTestsUserTableColNumber.toString() +"'>").append(
            $("<div class=\"container-fluid\">").append(
                tableWithQuestionAndAnswer
            )
        )
    );
    //</editor-fold>

    function appendTableWithQuestionAndAnswer(questionAnswerCombo) {
        const appendedRow = $("<tr>");

        const acceptButtonLoader = $("<span class=\"spinner-border spinner-border-sm hidden\" role=\"status\" aria-hidden=\"true\">");
        const acceptButton = $("<button class=\"btn btn-outline-success m-1\">")
            .append(
                acceptButtonLoader
            )
            .append(
                $("<span>").text("✔")
            )
            .on('click', () => {
                console.log('ПРИНЯТЬ ОТВЕТ tId', questionAnswerCombo["testId"], 'uId', questionAnswerCombo["userId"], 'qId', questionAnswerCombo["questionId"], 'try', questionAnswerCombo["try"])
                disableButtons();
                unhideElement(acceptButtonLoader);
                setAnswerCorrectness(questionAnswerCombo["testId"], questionAnswerCombo["userId"], questionAnswerCombo["try"], questionAnswerCombo["questionId"], "1")
                    .then(
                        onGetSetAnswerCorrectness
                    ).catch(e => console.log(e));
            });
        const cancelButtonLoader = $("<span class=\"spinner-border spinner-border-sm hidden\" role=\"status\" aria-hidden=\"true\">");
        const cancelButton = $("<button class=\"btn btn-outline-danger m-1\">")
            .append(
                cancelButtonLoader
            )
            .append(
                $("<span>").text("❌")
            )
            .on('click', () => {
                console.log('ОТКЛОНИТЬ ОТВЕТ tId', questionAnswerCombo["testId"], 'uId', questionAnswerCombo["userId"], 'qId', questionAnswerCombo["questionId"], 'try', questionAnswerCombo["try"])
                disableButtons();
                unhideElement(cancelButtonLoader);
                setAnswerCorrectness(questionAnswerCombo["testId"], questionAnswerCombo["userId"], questionAnswerCombo["try"], questionAnswerCombo["questionId"], "0")
                    .then(
                        onGetSetAnswerCorrectness
                    ).catch(e => console.log(e));
            });

        function onGetSetAnswerCorrectness(msg) {
            console.log(msg);
            if(msg["success"]){
                if(!msg["error"]){
                    if(msg["updated"]){
                        appendedRow.remove();
                        checkTableRowsCount();
                    }
                }
            }
        }

        // Проверяет количество строк в таблице.
        // Если их стало 0, убирает таблицу и посылает на сервер сообщение о форсированном завершении теста
        function checkTableRowsCount(){
            if(tableWithQuestionAndAnswerTbody.find(">tr").length === 0){
                tableWithQuestionAndAnswer.remove();
                deleteInfoAndTableRows();
                forceEndTest(questionAnswerCombo["testId"], questionAnswerCombo["userId"], questionAnswerCombo["try"]).then(
                    msg => {
                        console.log(msg);
                        if(msg['success']){
                            if(!msg["error"]){
                                if(msg["ended"]){
                                    // А вдруг пригодится?
                                }
                            }
                        }
                    }
                ).catch(e => console.log(e));
            }
        }

        //<editor-fold desc="Добавление в таблицу строки с кнопками">
        tableWithQuestionAndAnswerTbody.append(
            appendedRow.append(
                $("<td>").text(questionAnswerCombo["text"])
            ).append(
                $("<td>").text(questionAnswerCombo["answer"])
            ).append(
                $("<td>").append(
                    $("<div class='container'>").append(
                        $("<div class=\"row\">").append(
                            $("<div>").append(
                                acceptButton
                            ).append(
                                cancelButton
                            )
                        )
                    )
                )
            )
        );
        //</editor-fold>

        // Отключает кнопки
        function disableButtons(){
            setDisabledInput(acceptButton, true);
            setDisabledInput(cancelButton, true);
        }
    }

    // Удаляет строку и табличку с ответами на вопросы
    function deleteInfoAndTableRows(){
        appendedRow.remove();
        rowWithTable.remove();
        if(tbody.find(">tr").length === 0){
            appendCheckTestsUserTableEmpty();
        }
    }

    const buttonSpinner = $("<span class=\"spinner spinner-border spinner-border-sm hidden\" role=\"status\" aria-hidden=\"true\">");

    if (result !== null) {
        tbody.append(
            appendedRow
                .append(
                    $("<th scope=\"row\">").text(result["secondName"])
                )
                .append(
                    $("<th scope=\"row\">").text(result["surname"])
                )
                .append(
                    $("<th scope=\"row\">").text(result["try"])
                )
                .append(
                    $("<td>").append(
                        $("<div class=\"container\">").append(
                            $("<div class=\"row\">").append(
                                $("<div>").append(
                                    $("<button class=\"btn btn-outline-primary\">")
                                        .on('click', function () {
                                            console.log("ПРОВЕРИТЬ РЕЗУЛЬТАТ tId", result["testId"], "uId", result["userId"], "try", result["try"]);
                                            unhideElement(buttonSpinner);
                                            setDisabledInput($(this), true);

                                            getQuestionsWithoutCorrectAnswerWithUserAnswers(result["testId"], result["userId"], result["try"]).then(
                                                onGetQuestionsWCAWithUserAnswers
                                            ).catch(e => console.log(e));

                                            function onGetQuestionsWCAWithUserAnswers(msg) {
                                                console.log(msg);
                                                if (msg["success"]) {
                                                    if (!msg["error"]) {
                                                        hideElement(buttonSpinner);
                                                        // Дополнять табличку
                                                        msg["questionAnswerCombo"].forEach(
                                                            qAC => {
                                                                appendTableWithQuestionAndAnswer(qAC);
                                                            }
                                                        );
                                                        // Показываем табличку:
                                                        unhideElement(tableWithQuestionAndAnswer);
                                                    }
                                                }
                                            }
                                        })
                                        .append(
                                            buttonSpinner
                                        )
                                        .append(
                                            $("<span>").text('Проверить')
                                        )
                                )
                            )
                        )
                    )
                )
        ).append(
            rowWithTable
        );
    }
}

// Добавляет в таблицу строку с информацией о том, что таблица пуста
function appendCheckTestsUserTableEmpty(){
    const tbody = $("#checkTestsUserTable tbody");
    tbody.append(
        $("<tr>")
            .append(
                $("<td class='text-center' colspan='" + checkTestsUserTableColNumber.toString() +"'>").text("Для данного теста нет непроверенных ответов!")
            )
    );
}

// Очищает таблицу checkTestsUserTable
// Заполняет значениями из resultsArray.
function setupCheckTestsUserTable(resultsArray) {
    clearCheckTestsUserTable();
    if (resultsArray.length > 0) {
        resultsArray.forEach(
            result => appendCheckTestsUserTable(result)
        );
    } else {
        // Если результатов нет:
        appendCheckTestsUserTableEmpty();
    }
}

$(() => {
    $("#checkTests").on('click', function () {
        const checkTestsButton = $(this);
        const checkTestsButtonLoader = $(this).find(".spinner");
        // Показываем спиннер кнопки "Проверить тесты"
        unhideElement(checkTestsButtonLoader);
        // Блокируем кнопку "Проверить тесты":
        setDisabledInput(checkTestsButton, true);
        const checkTestsPlaceholder = $("#checkTestsPlaceholder");
        const checkTestSelect = $("#checkTestSelect");
        // Кнопка для запуска проверки тестов
        const checkButton = checkTestsPlaceholder.find("form button");
        const checkButtonLoader = checkButton.find(".spinner");
        // Показываем блок
        hideAllTestControlsPlaceholders();
        unhideElement(checkTestsPlaceholder);
        // Блокируем select и кнопку "Проверить", прячем загрузчик таблицы
        setDisabledInput(checkTestSelect, true);
        setDisabledInput(checkButton, true);
        // Получение всех тестов, у которых есть вопросы без правильного ответа (которые нужно проверять вручную):
        getTestsWithQuestionsWithoutCorrectAnswer().then(
            doAfterGettingTestsWQWCA
        ).catch(e => console.log(e));

        function doAfterGettingTestsWQWCA(msg) {
            console.log(msg);
            if (msg["success"]) {
                if (!msg["error"]) {
                    // Скрываем спиннер кнопки "Проверить тесты"
                    hideElement(checkTestsButtonLoader);
                    // Разблокируем кнопку "Проверить тесты":
                    setDisabledInput(checkTestsButton, false);
                    // После получения объекта, заполняем select
                    const optionsArray = [];
                    if(msg["tests"].length === 0){
                        optionsArray.push(
                            getSelectOption("Непроверенных тестов не найдено!", "")
                        );
                        setSelectOptions(checkTestSelect, optionsArray);
                        return;
                    }
                    msg["tests"].forEach(test => {
                        optionsArray.push(
                            getSelectOption(test["name"] + " - " + test["countOfNeededReviews"] + " тест(-а/-ов)", test["id"])
                        );
                    });
                    // Разблокируем кнопку:
                    setDisabledInput($(this), false);
                    setDisabledInput(checkTestSelect, false);
                    setSelectOptions(checkTestSelect, optionsArray);
                    setDisabledInput(checkButton, false);
                    // Добавляем действие кнопке "Проверить"
                    checkButton.off('click').on('click', checkButtonClickHandler);

                    function checkButtonClickHandler(e) {
                        e.preventDefault();
                        // Делаю кнопку неактивной, показываю спиннер:
                        setDisabledInput(checkButton, true);
                        unhideElement(checkButtonLoader);
                        getUncheckedQuestions(checkTestSelect.val()).then(msg => {
                            console.log(msg);
                            setDisabledInput(checkButton, false);
                            hideElement(checkButtonLoader);
                            setupCheckTestsUserTable(msg["results"]);
                            unhideElement($("#checkTestsUserTable"));
                        }).catch(e => console.log(e));
                    }
                }
            }
        }
    });
});

const getTestsResultsTableColNumber = 4;

// Получает все возможные студенческие группы
function getAllStudentsGroups() {
    let data = {form: {}};
    data["form"]["action"] = "getAllStudentsGroups";
    console.log(data);
    return postAjax(
        siteURL + '/tests.php',
        data,
        new ConnectException("Произошла ошибка при отправке запроса на получение всех возможных студенческих группах!")
    );
}

// Получает результаты выполнения для теста
// Если groupId === "", сортировка по группе не осуществляется (на стороне сервера)
function getTestResults(testId, groupId) {
    let data = {form: {}};
    data["form"]["action"] = "getTestResults";
    data["form"]["testId"] = testId;
    data["form"]["groupId"] = groupId;
    console.log(data);
    return postAjax(
        siteURL + '/tests.php',
        data,
        new ConnectException("Произошла ошибка при отправке запроса на Получает результаты выполнения для теста!")
    );
}

// Очищает содержимое таблицы getTestsResultsTable
// TODO: вынести функционал в отдельную функцию с параметром?
function clearGetTestsResultsTable() {
    $("#getTestsResultsTable tbody tr").remove();
}

// Дополняет таблицу getTestsResultsTable новой строкой из данных result
function appendGetTestsResultsTable(result) {
    const tbody = $("#getTestsResultsTable tbody");

    tbody.append(
        $("<tr>")
            .append(
                $("<th scope=\"row\">").text(result["surname"])
            )
            .append(
                $("<td>").text(result["firstName"])
            )
            .append(
                $("<td>").text(result["secondName"])
            )
            .append(
                $("<td>").text(
                    (result["finished"] === "1" ? getScoreText(result["score"]) : "В процессе сдачи")
                )
            )
    );
}

// Дополняет таблицу getTestsResultsTable строкой с информацией о том, что таблица пуста
function appendGetTestsResultsTableEmpty() {
    const tbody = $("#getTestsResultsTable tbody");

    tbody.append(
        $("<tr>")
            .append(
                $("<td class='text-center' colspan='" + getTestsResultsTableColNumber.toString() + "'>").text("Данный тест ещё никто не прошёл!")
            )
    );
}

// Очищает таблицу getTestsResultsTable
// Заполняет её данными из resultsArray
function setupGetTestsResultsTable(resultsArray) {
    clearGetTestsResultsTable();
    if (resultsArray.length > 0) {
        resultsArray.forEach(
            result => appendGetTestsResultsTable(result)
        );
    } else {
        // Если результатов нет:
        appendGetTestsResultsTableEmpty();
    }
}

$(() => {
    $("#getResults").on('click', function() {
        const getResultsButton = $(this);
        const getResultsButtonLoader = $(this).find(".spinner");
        // Показываем спиннер кнопки "Просмотреть отчёт"
        unhideElement(getResultsButtonLoader);
        // Блокируем кнопку "Просмотреть отчёт"
        setDisabledInput(getResultsButton, true);

        const getTestsResultsPlaceholder = $("#getTestsResultsPlaceholder");
        // Кнопка для запуска проверки тестов
        const getTestsResult = $("#getTestsResult");
        const getTestsResultLoader = getTestsResult.find(".spinner");
        const getTestsResultTestSelect = $("#getTestsResultsTestName");
        const getTestsResultGroupSelect = $("#getTestsResultsGroupName");

        // Показываем блок
        hideAllTestControlsPlaceholders();
        unhideElement(getTestsResultsPlaceholder);
        // Блокируем select-ы и кнопку "Получить отчёт"
        hideElement(getTestsResultLoader);
        setDisabledInput(getTestsResult, true);
        setDisabledInput(getTestsResultTestSelect, true);
        setDisabledInput(getTestsResultGroupSelect, true);

        // Заполняем select-ы:
        getAllTests().then(
            msg => {
                console.log(msg);
                if (msg["success"]) {
                    if (!msg["error"]) {
                        // Кнопка "Просмотреть отчёт"
                        hideElement(getResultsButtonLoader);
                        setDisabledInput(getResultsButton, false);
                        // После получения объекта, заполняем select
                        const optionsArray = [];
                        if(msg["tests"].length === 0){
                            optionsArray.push(
                                getSelectOption("Тесты не были найдены", "")
                            );
                            setSelectOptions(getTestsResultTestSelect, optionsArray);
                        }
                        msg["tests"].forEach(
                            test => {
                                optionsArray.push(
                                    getSelectOption(test["name"], test["id"])
                                );
                            }
                        );
                        setSelectOptions(getTestsResultTestSelect, optionsArray);
                        // Разблокируем кнопку "Получить отчёт" и сам select
                        setDisabledInput(getTestsResultTestSelect, false);
                        setDisabledInput(getTestsResult, false);

                        getTestsResult.off('click').on('click', getResultsButtonClickHandler);

                        function getResultsButtonClickHandler() {
                            unhideElement(getTestsResultLoader);
                            getTestResults(getTestsResultTestSelect.val(), getTestsResultGroupSelect.val()).then(msg => {
                                console.log(msg);
                                if (msg["success"]) {
                                    if (!msg["error"]) {
                                        setupGetTestsResultsTable(msg["results"]);
                                    }
                                }
                                hideElement(getTestsResultLoader);
                            }).catch(e => console.log(e));
                        }
                    }
                }
            }
        ).catch(e => console.log(e));

        getAllStudentsGroups().then(
            msg => {
                console.log(msg);
                if (msg["success"]) {
                    if (!msg["error"]) {

                        // После получения объекта, заполняем select
                        const optionsArray = [];
                        msg["studentsGroups"].forEach(
                            studentGroup => {
                                optionsArray.push(
                                    getSelectOption(studentGroup["name"], studentGroup["id"])
                                );
                            }
                        );
                        setSelectOptions(getTestsResultGroupSelect, optionsArray, true);
                        setDisabledInput(getTestsResultGroupSelect, false);
                    }
                }
            }
        ).catch(e => console.log(e));
    });
});