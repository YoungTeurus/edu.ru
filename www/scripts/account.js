function doAfterCheckingLoginStatus(logined){
    isUserLogined = logined["logined"];

    // В любом случае:

    if (isUserLogined) {
        // Если пользователь авторизован на момент входа на сайт:
        unhideElementBySelector("userInfo");
        updateUserInfo();
    } else {
        // Если пользователь не авторизован на момент входа на сайт:
        showErrorModal("Вы не авторизованы для просмотра данной страницы.");
    }
}

// Загружает информцию о пользователе
function getUserInfo(){
    let data = {form: {}};
    data["form"]["action"] = "getUserInfo";
    console.log(data);
    return postAjax(
        siteURL + '/users.php',
        data,
        new ConnectException("Произошла ошибка при отправке запроса на Загружает информцию о пользователе!")
    );
}

// Отправляет информацию о пользователе
function saveUserInfo(userInfoObject){
    let data = {form: {}};
    data["form"]["action"] = "saveUserInfo";
    data["form"]["userInfo"] = userInfoObject;
    console.log(data);
    return postAjax(
        siteURL + '/users.php',
        data,
        new ConnectException("Произошла ошибка при отправке запроса на Отправляет информацию о пользователе!")
    );
}

// Загружает информцию о пользователе на страницу, делая элементы активными:
function updateUserInfo(){
    const userFirstName = $("#userFirstName");
    const userSurname = $("#userSurname");
    const userSecondName = $("#userSecondName");
    const userEmail = $("#userEmail");

    const saveInfo = $("#saveInfo");
    const saveInfoLoader = saveInfo.find(".spinner");

    setDisabledInput(saveInfo, true);
    hideElement(saveInfoLoader);
    unhideElementBySelector("#userInfo");

    getUserInfo().then(
        msg => {
            console.log(msg);
            if(msg["success"]){
                if(!msg["error"]){
                    userFirstName.val(msg["userInfo"]["firstName"]);
                    userSecondName.val(msg["userInfo"]["secondName"]);
                    userSurname.val(msg["userInfo"]["surname"]);
                    userEmail.val(msg["userInfo"]["email"]);

                    setDisabledInput(saveInfo, false);
                    saveInfo.off('click').on('click', () => {
                        setDisabledInput(saveInfo, true);
                        unhideElement(saveInfoLoader);

                        saveUserInfo({
                            firstName: userFirstName.val(),
                            secondName: userSecondName.val(),
                            surname: userSurname.val(),
                            email: userEmail.val()
                        }).then(
                            msg => {
                                console.log(msg);
                                hideElement(saveInfoLoader);
                                setDisabledInput(saveInfo, false);
                            }
                        ).catch(e => console.log(e));
                    });
                }
            }
        }
    ).catch(e => console.log(e));
}

$(() => {

    checkUserLoginStatus()
        .catch(e => console.log(e))
        .then(
            msg => {
                console.log(msg);
                doAfterCheckingLoginStatus(msg);
            }
        );
});