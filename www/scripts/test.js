const urlParams = new URLSearchParams(window.location.search);
const testId = urlParams.get('testId');

function doAfterCheckingLoginStatus(logined) {
    isUserLogined = logined["logined"];

    getQuestions().then(
        msg => {
            console.log(msg);
        }
    ).catch(e => console.log(e));
}

async function getQuestions(){
    let data = {form: {}};
    data["form"]["action"] = "getTestQuestions";
    data["form"]["testId"] = testId;
    console.log(data);
    return postAjax(
        siteURL + '/tests.php',
        data,
        new ConnectException("Произошла ошибка при отправке запроса на получение списка вопросов теста!")
    );
}

$(() => {
    if (testId === null){
        $("#errorMissingTestId")[0].classList.remove('hidden');
    } else {
        // checkUserLoginStatus()
        //     .catch(e => console.log(e))
        //     .then(
        //         logined => {
        //             doAfterCheckingLoginStatus(logined);
        //         }
        //     );
    }
});