const checkTestsUserTableColNumber = 4;

function setDisabledInput(jQueryObject, state) {
    jQueryObject.attr('disabled', state)
}

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
        // Кнопка для запуска проверки тестов
        const checkTestsPlacehoder = $("#checkTestsPlacehoder");
        const checkTestSelect = $("#checkTestSelect");
        const checkButton = checkTestsPlacehoder.find("form button");
        const checkButtonLoader = checkButton.find(".spinner");
        // Показываем блок
        unhideElement(checkTestsPlacehoder);
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
                    // Разблокируем кнопку:
                    setDisabledInput($(this), false);
                    setDisabledInput(checkTestSelect, false);
                    // После получения объекта, заполняем select
                    const optionsArray = [];
                    msg["tests"].forEach(test => {
                        optionsArray.push(
                            getSelectOption(test["name"], test["id"])
                        );
                    });
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