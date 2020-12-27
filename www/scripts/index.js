let userInfo = {};

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
                                .on('click', () => {
                                    // TODO: код начала теста
                                    // Показываем спиннер:
                                    spinner[0].classList.remove('hidden');
                                    startNewTry(testRowObject["testId"])
                                        .then(
                                            msg => {
                                                console.log(msg);
                                                // Скрываем спиннер:
                                                spinner[0].classList.add('hidden');
                                                if (msg["success"]){
                                                    if (!msg["error"]){
                                                        if (msg["hasStarted"]){
                                                            const testUrl = siteURL + "/test.html?testId="+testRowObject["testId"];
                                                            // Если начали тест:
                                                            window.open(testUrl, "_blank");
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
                                                                "                            <p>Если вы не были перенаправлены на страницу с тестом, нажмите <a class=\"link-primary\" href=\"" + testUrl +"\">сюда</a>.</p>\n" +
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
                            $("<button class=\"btn btn-outline-secondary\">").text("Недоступно") )
                    )
            )
    );
}


// Все действия, проиходящие после получения информации о статусе входа пользователя:
function doAfterCheckingLoginStatus(logined) {
    isUserLogined = logined["logined"];

    // В любом случае:
    $("#navButtonPlaceholder")[0].classList.add('hidden');

    if (isUserLogined) {
        // Если пользователь авторизован на момент входа на сайт:

        // Проказываем кнопку выхода из аккаунта:
        $("#logoutButtonListItem")[0].classList.remove('hidden');
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

    checkUserLoginStatus()
        .catch(e => console.log(e))
        .then(
            logined => {
                doAfterCheckingLoginStatus(logined);
            }
        );

    $("#devModal").modal('show');
});