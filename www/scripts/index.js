let userInfo = {};

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
});