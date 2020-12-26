const urlParams = new URLSearchParams(window.location.search);
const testId = urlParams.get('testId');

function doAfterCheckingLoginStatus(logined) {
    isUserLogined = logined["logined"];
}

function getQuestion(questionId){

}

$(() => {
    if (testId === null){
        console.log('wtf?');
    }

    // checkUserLoginStatus()
    //     .catch(e => console.log(e))
    //     .then(
    //         logined => {
    //             doAfterCheckingLoginStatus(logined);
    //         }
    //     );
});