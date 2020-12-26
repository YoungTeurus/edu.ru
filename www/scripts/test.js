const urlParams = new URLSearchParams(window.location.search);
const testId = urlParams.get('testId');

function doAfterCheckingLoginStatus(logined) {
    isUserLogined = logined["logined"];

    getQuestions().then(
        msg => {
            console.log(msg);
            msg["questions"].forEach(
                question => {
                    appendQuestion(question, msg["answers"].filter(
                        answer => {
                            return answer["questionId"] === question["id"];
                        }
                    ));
                }
            );
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

function appendQuestion(questionObject, answerObjectsArray){
    const questionId = questionObject["id"];
    $("#testQuestions").append(
        $("<div class=\"test-question container border border-dark mb-2\">")
            .append(
                $("<form>")
                    .append(
                        $("<h5 class=\"text-center\">")
                            .text("Вопрос ".concat(questionId))
                    )
                    .append(
                        $("<div class=\"questionQuestion\">")
                            .text(questionObject["text"])
                    )
                    .append(
                        $("<div id=\"questionAnswer-" + questionId + "\" class=\"container questionAnswer mb-2\" data-answer=\"\">")
                            .append(
                                $("<div class=\"row\">")
                            )
                    )
            )
    );

    const answers = $("#questionAnswer-" + questionId + " .row");
    if (answerObjectsArray.length > 0){
        // Если вопрос с вариантами ответа:
        answerObjectsArray.forEach((answer, index) => {
            answers.append(
                // Здесь ответы:
                // Например:
                $("<div>")
                    .append(
                        $("<input id=\"radio"+ questionId +"-" + index.toString() +"\" name=\"radio-1\" class=\"form-check-input\" type=\"radio\" data-answer-for=\"questionAnswer-"+ questionId +"\">")
                            .val(answer["answer"])
                    )
                    .append(
                        $("<label for=\"radio"+ questionId +"-" + index.toString() +"\" class=\"form-check-label\">")
                            .text("\xa0" + answer["answer"])
                    )
            );
        });
    } else {
        // Если вопрос без вариантов ответа:
    }
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