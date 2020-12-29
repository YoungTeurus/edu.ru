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