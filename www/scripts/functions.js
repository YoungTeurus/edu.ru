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
    unknown: "❓",
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

// Отправляет серверу запрос на начало новой попытки начать тест.
async function startNewTry(testId){
    let data = {form: {}};
    data["form"]["action"] = "startNewTry";
    data["form"]["testId"] = testId;
    console.log(data);
    return postAjax(
        siteURL + '/tests.php',
        data,
        new ConnectException("Произошла ошибка при отправке запроса на начало новой попытки прохождения теста!")
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

// Получает string, содержащий float в диапазоне [0,1] или -1. Возвращает текст с emoji и процентами.
function getScoreText(score) {
    if (score === "-1"){
        return scoreRanges.unknown;
    }
    score = parseFloat(score);
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

function showModal(headerHTML, bodyHTML, footerHTML){
    const modal = $("#defaultModal");

    modal.find(".modal-header").html(headerHTML);
    modal.find(".modal-body").html(bodyHTML);
    modal.find(".modal-footer").html(footerHTML);

    modal.modal('show');
}