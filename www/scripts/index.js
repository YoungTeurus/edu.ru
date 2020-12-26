const siteURL = "http://edu.ru";

// Является ли пользователь авторизованым?
let isUserLogined = false;
let userInfo = {};

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
    $("#loginError").text("");  // Очищаем имеющиеся ошибки входа
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
function validateRegisterForm(){
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

// Проверяет статус авторизации пользователя.
// Возвращает true, если пользователь авторизован, иначе - false.
async function checkUserLoginStatus() {
    let data = {form: {}};
    data["form"]["action"] = "checkLoginStatus";
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

    return postAjax(
        siteURL + '/login.php',
        data,
        new ConnectException("Произошла ошибка при отправке запроса на получение информации о пользователе!")
    );
}

async function getAvailableTests(){
    let data = {form: {}};
    data["form"]["action"] = "getAvailableTests";

    return postAjax(
        siteURL + '/tests.php',
        data,
        new ConnectException("Произошла ошибка при отправке запроса на получение списка достуаных тестов!")
    );
}

$(() => {
    $('#logIn').on('click', e => {
        e.preventDefault();
        // Показываем спиннер:
        $("#loginFormLoader")[0].style.display = "";
        // Скрываем блок входа:
        $("#loginForm")[0].classList.add("hidden");
        logIntoAccount($("#luserLogin").val(), $("#luserPassword").val())
            .then(
                msg => {
                    console.log(msg);
                    if (msg["success"] && msg["logined"]) {
                        // Если вход успешен
                        isUserLogined = msg["logined"];
                        // Скрываем блок входа:
                        $("#loginForm")[0].classList.add("hidden");
                        // Заполняем блок именем пользователя, получая его из БД:
                        getUserInfo()
                            .catch(e => console.log(e))
                            .then(msg => {
                                userInfo = msg["userinfo"];
                                // Заполняем логин пользователя:
                                $("#userShortInfo #userName").text(userInfo["login"]);
                                // Скрываем спиннер
                                $("#loginFormLoader")[0].style.display = "none";
                                // Показываем блок краткого описания выхода из аккаунта.
                                $("#userShortInfo")[0].classList.remove("hidden");
                            });
                    } else {
                        // Если вход не успешен:
                        // Скрываем спиннер:
                        $("#loginFormLoader")[0].style.display = "none";
                        // Показываем блок входа:
                        $("#loginForm")[0].classList.remove("hidden");
                        // Показываем ошибку:
                        $("#loginForm #loginError").text(msg["error"]);
                    }
                }
            )
            .catch(
                e => console.log(e)
            );
    });
    $('#register').on('click', e => {
        e.preventDefault();

        // Если неверные данные - не отправляем запрос на регистрацию.
        if (!validateRegisterForm()){
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
                        if (msg["errorObject"] === "login"){
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
    $('#getAvailableTests').on('click', e => {
        getAvailableTests().then(
            msg => console.log(msg)
        ).catch(
            e => console.log(e)
        );
    });

    checkUserLoginStatus()
        .catch(e => console.log(e))
        .then(
        logined => {
            isUserLogined = logined["logined"];
            $("#navButtonPlaceholder")[0].classList.add('hidden');
            if (isUserLogined){
                // Если пользователь авторизован на момент входа на сайт:
                // Проказываем кнопку выхода из аккаунта:
                $("#logoutButtonListItem")[0].classList.remove('hidden');
            } else {
                // Если пользователь не авторизован на момент входа на сайт:
                // Показываем кнопки входа в аккаунт и регистрации нового аккаунта:
                $("#loginButtonListItem")[0].classList.remove('hidden');
                $("#registerButtonListItem")[0].classList.remove('hidden');
            }
        }
    );
});
