const urlParams = new URLSearchParams(window.location.search);
const testId = urlParams.get('testId');

function doAfterCheckingLoginStatus(logined) {
    isUserLogined = logined["logined"];


}

function getQuestion(questionId){

}

$(() => {
    if (testId === null){
        $("#errorMissingTestId")[0].classList.remove('hidden');
    } else {
        checkUserLoginStatus()
            .catch(e => console.log(e))
            .then(
                logined => {
                    doAfterCheckingLoginStatus(logined);
                }
            );
    }
});