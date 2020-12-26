const siteURL = "http://edu.ru";

// Является ли пользователь авторизованым?
let isUserLogined = false;

const testsStatuses = {
    completed: {text: "☑ Выполнен"},
    completedCanTryAgain: {text: "✔ Выполнен, доступен"},
    completedInProgress: {text: "✔⭕ Выполнен, в процессе"},
    inProgress: {text: "⭕ В процессе"},
    available: {text: "❔ Доступен"},
    availableInTime: {text: "🔒 Скоро будет доступен"},
    notAvailable: {text: "🔒 Не доступен"},
}

const triesStasuses = {
    completed: {text: "✔ Закончена"},
    inProgress: {text: "⭕ В процессе"},
}

const scoreRanges = {
    ranges: [0, 50, 75, 90, 100],
    0: "❌",
    50: "❗",
    75: "✔",
    90: "✅",
    100: "⚜",
}

function ConnectException(message) {
    this.message = message;
    this.name = "Проблема с подключением";
}

// Вызывает ajax указанного типа по указанному url с указанной data.
// В случае успеха возвращает msg, в случае неудачи вызывает исключение failException.
async function ajaxWithData(type, url, data, failException) {
    return $.ajax({
        type: type,
        url: url,
        data: data,
        dataType: "json",
    })
        .done(msg => {
            return (msg);
        })
        .fail(() => {
            throw failException;
        });
}

async function postAjax(url, data, failException) {
    return ajaxWithData('POST', url, data, failException);
}

// Производит вход в аккаунт по переданным данным.
async function logIntoAccount(userLogin, userPassword) {
    let data = {form: {}};
    data["form"]["action"] = "login";
    data["form"]["userLogin"] = userLogin;
    data["form"]["userPassword"] = userPassword;
    console.log(data);

    return postAjax(
        siteURL + '/login.php',
        data,
        new ConnectException("Произошла ошибка при отправке запроса на вход в аккакунт!")
    );
}

// Производит выход из аккаунта.
async function logOutOfAccount() {
    let data = {form: {}};
    data["form"]["action"] = "logout";
    console.log(data);

    return postAjax(
        siteURL + '/login.php',
        data,
        new ConnectException("Произошла ошибка при отправке запроса на выход из аккакунта!")
    );
}

// Производит регистрацию аккаунта по переданным данным.
async function registerAccount(userLogin, userPassword, userEmail) {
    let data = {form: {}};
    data["form"]["action"] = "register";
    data["form"]["userLogin"] = userLogin;
    data["form"]["userEmail"] = userEmail;
    data["form"]["userPassword"] = userPassword;
    $("#loginError").text("");  // Очищаем имеющиеся ошибки входа
    console.log(data);

    return postAjax(
        siteURL + '/login.php',
        data,
        new ConnectException("Произошла ошибка при отправке запроса на регистрацию в аккакунт!")
    );
}

// Вовзвращает true, если все поля userRegisterModal верно заполнены.
function validateRegisterForm() {
    let isCorrect = true;

    // Сброс ошибки логина пользователя на стандартную:
    $("#ruserLoginValidation")
        .text("Заполните это поле!");

    let rul = $("#ruserLogin");
    let rue = $("#ruserEmail");
    let rup = $("#ruserPassword");
    let rupa = $("#ruserPasswordAgain");

    if (rul.val().length === 0) {
        rul[0].classList.add('is-invalid');
        isCorrect = false;
    } else {
        rul[0].classList.remove('is-invalid');
    }

    if (rue.val().length === 0) {
        rue[0].classList.add('is-invalid');
        isCorrect = false;
    } else {
        rue[0].classList.remove('is-invalid');
    }

    if (rup.val().length === 0) {
        rup[0].classList.add('is-invalid');
        rupa[0].classList.add('is-invalid');
        isCorrect = false;
    } else {
        rup[0].classList.remove('is-invalid');
        if (rup.val() !== rupa.val()) {
            rupa[0].classList.add('is-invalid');
            isCorrect = false;
        } else {
            rupa[0].classList.remove('is-invalid');
        }
    }

    return isCorrect;
}

// Вовзвращает true, если все поля userLoginModal верно заполнены.
function validateLoginForm() {
    let isCorrect = true;

    // Сброс ошибки пароля пользователя на стандартную:
    $("#luserPasswordValidation")
        .text("Заполните это поле!");

    let lul = $("#luserLogin");
    let lup = $("#luserPassword");

    if (lul.val().length === 0) {
        lul[0].classList.add('is-invalid');
        isCorrect = false;
    } else {
        lul[0].classList.remove('is-invalid');
    }

    if (lup.val().length === 0) {
        lup[0].classList.add('is-invalid');
        isCorrect = false;
    } else {
        lup[0].classList.remove('is-invalid');
    }

    return isCorrect;
}

// Проверяет статус авторизации пользователя.
// Возвращает true, если пользователь авторизован, иначе - false.
async function checkUserLoginStatus() {
    let data = {form: {}};
    data["form"]["action"] = "checkLoginStatus";
    console.log(data);
    return $.ajax({
        type: "POST",
        url: siteURL + '/login.php',
        data: data,
        dataType: "json",
    })
        .done(msg => {
            return (msg["logined"]);
        })
        .fail(() => {
            throw new ConnectException("Произошла ошибка при отправке запроса на устанолвение статуса авторизации аккаунта!");
        });
}

// Получает информацию о пользователе.
async function getUserInfo() {
    let data = {form: {}};
    data["form"]["action"] = "getUserInfo";
    console.log(data);
    return postAjax(
        siteURL + '/login.php',
        data,
        new ConnectException("Произошла ошибка при отправке запроса на получение информации о пользователе!")
    );
}

// Получает информацию о доступных пользователю тестах.
async function getAvailableTests() {
    let data = {form: {}};
    data["form"]["action"] = "getAvailableTests";
    console.log(data);
    return postAjax(
        siteURL + '/tests.php',
        data,
        new ConnectException("Произошла ошибка при отправке запроса на получение списка достуаных тестов!")
    );
}

// Очищает таблицу доступных тестов
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
                $("<th>").text(testRowObject._status.text)
            )
            .append(
                $("<th>").text(testRowObject["openDatetime"] !== null ? testRowObject["openDatetime"] : "-")
            )
            .append(
                $("<th>").text(testRowObject["closeDatetime"] !== null ? testRowObject["closeDatetime"] : "-")
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
                        $("<button class=\"btn btn-primary\">").text("Начать новую попытку")
                    )
            )
    );
}

// Отправляет серверу запрос
async function getTestTries(testId) {
    let data = {form: {}};
    data["form"]["action"] = "getTestTries";
    data["form"]["testId"] = testId;
    console.log(data);
    return postAjax(
        siteURL + '/tests.php',
        data,
        new ConnectException("Произошла ошибка при отправке запроса на получение информации о поптыках прохождения теста!")
    );
}

// Возвращает массив состояний прохождения тестирования
async function asyncGetTriesTable(testId) {
    return new Promise(async (resolve, reject) => {
        let msg = await getTestTries(testId);
        console.log(msg);
        if (msg["success"]) {
            if (!msg["error"]) {
                resolve(msg["testTries"]);
            } else {
                reject(msg["errorText"]);
            }
        } else {
            reject("Неизвестная ошибка!")
        }
    });
}

// Получает float в диапазоне [0,1]. Возвращает текст с emoji и процентами.
function getScoreText(score) {
    let percent = score * 100;
    percent = Math.round(percent);
    for (let i = 0; i < scoreRanges.ranges.length; i++) {
        if (percent === scoreRanges.ranges[i]) {
            return (scoreRanges[scoreRanges.ranges[i]].concat(percent.toString()).concat('%'));
        } else if (percent <= scoreRanges.ranges[i]) {
            return (scoreRanges[scoreRanges.ranges[i - 1]].concat(percent.toString()).concat('%'));
        }
    }
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
                                                getScoreText(parseFloat(testTry["score"]))
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