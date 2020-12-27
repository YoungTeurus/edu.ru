const urlParams = new URLSearchParams(window.location.search);
const testId = urlParams.get('testId');

// Фабрика объектов:
const getAnswerHolder = (questionId, jQueryObject) => (
    {
        questionId: questionId,
        jQueryObject: jQueryObject,
    })

// Массив где лежат объекты answerHolder.
// В их questionId хранятся идентификаторы вопросов.
// В их jQueryObject.data('answer') хранятся ответы на вопросы.
const questionAnswers = Array();

function doAfterCheckingLoginStatus(logined) {
    isUserLogined = logined["logined"];

    getQuestions().then(
        msg => {
            console.log(msg);
            if(msg["success"]){
                // Скрываем спиннер
                $("#testLoader")[0].classList.add('hidden');
                if (!msg["error"]){
                    setTestName(msg["testInfo"]["name"]);
                    // TODO: обрабатывать время выполнения теста
                    msg["questions"].forEach(
                        question => {
                            appendQuestion(question, msg["answers"].filter(
                                answer => {
                                    return answer["questionId"] === question["id"];
                                }
                            ));
                        }
                    );
                    $("#testContent")[0].classList.remove('hidden');
                    $("#sendAnswers").on('click',
                        () => {
                            sendAnswers().then(
                                msg => {
                                    console.log(msg);
                                    if(msg["added"]){
                                        // Если всё успешно...
                                        // TODO: выводить окошко с уведомлением об успехе.
                                        showModal();
                                        setTimeout(() => {
                                            window.close();
                                        }, 3000)
                                    }
                                }
                            );
                        }
                    );
                } else {
                    showModal(
                        "<h5 class=\"modal-title\">Что-то пошло не так</h5>",
                        "<div class=\"container text-center\">\n" +
                        "                        <div class=\"row col-6 m-auto\">\n" +
                        "                            <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"100%\" height=\"100%\" viewBox=\"0 0 72 72\" id=\"emoji\">\n" +
                        "                                <g id=\"color\">\n" +
                        "                                    <path fill=\"#ea5a47\" d=\"m58.14 21.78-7.76-8.013-14.29 14.22-14.22-14.22-8.013 8.013 14.36 14.22-14.36 14.22 8.014 8.013 14.22-14.22 14.29 14.22 7.76-8.013-14.22-14.22z\"/>\n" +
                        "                                </g>\n" +
                        "                                <g id=\"hair\"/>\n" +
                        "                                <g id=\"skin\"/>\n" +
                        "                                <g id=\"skin-shadow\"/>\n" +
                        "                                <g id=\"line\">\n" +
                        "                                    <path fill=\"none\" stroke=\"#000\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-miterlimit=\"10\" stroke-width=\"2\" d=\"m58.14 21.78-7.76-8.013-14.29 14.22-14.22-14.22-8.013 8.013 14.35 14.22-14.35 14.22 8.014 8.013 14.22-14.22 14.29 14.22 7.76-8.013-14.22-14.22z\"/>\n" +
                        "                                </g>\n" +
                        "                            </svg>\n" +
                        "                        </div>\n" +
                        "                        <div class=\"row\">\n" +
                        "                            <p class='text-danger'>Произошла ошибка:</p>\n" +
                        "                            <p>" + msg["errorText"] +"</p>\n" +
                        "                            <p>Повторите попытку или обратитесь в службу поддержки.</p>\n" +
                        "                        </div>\n" +
                        "                    </div>",
                        ""
                    );
                }
            } else {

            }
        }
    ).catch(e => console.log(e));
}

async function getQuestions() {
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

function setTestName(testName) {
    $("#testName").text(testName);
}

// Добавляет один вопрос на страницу.
// questionObject - объект, содержащий информацию о вопросе (id)
// answerObjectsArray - массив объектов, содержащий информацию об ответах на вопрос,
//  может быть пустой - в этом случае создаётся один input:text (считается, что вопрос без вариантов ответа)
function appendQuestion(questionObject, answerObjectsArray) {
    const questionId = questionObject["id"];

    const answersRow = $("<div class=\"row\">");

    const answers = $("<div id=\"questionAnswer-" + questionId + "\" class=\"container questionAnswer mb-2\">")
        .append(
            answersRow
        )
        .data(
            'answer', ''
        );

    questionAnswers.push(getAnswerHolder(questionId, answers));

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
                        answers
                    )
            )
    );

    // Заполнение ответов:
    if (answerObjectsArray.length > 0) {
        // Если вопрос с вариантами ответа:
        answerObjectsArray.forEach((answer, index) => {
            answersRow.append(
                // Для каждого ответа создаём radio с соттветствующими value:
                $("<div>")
                    .append(
                        $("<input id=\"radio" + questionId + "-" + index.toString() + "\" name=\"radio-1\" class=\"form-check-input\" type=\"radio\">")
                            .val(answer["answer"])
                            .on('click', o => {
                                answers.data('answer', o.target.value);
                            })
                    )
                    .append(
                        $("<label for=\"radio" + questionId + "-" + index.toString() + "\" class=\"form-check-label\">")
                            .text("\xa0" + answer["answer"])
                    )
            );
        });
    } else {
        // Если вопрос без вариантов ответа:
        // Создаём единственный input:text:
        answersRow.append(
            $("<div>")
                .append(
                    $("<label for=\"text" + questionId + "\" class=\"form-label\">")
                )
                .append(
                    $("<input id=\"text" + questionId + "\" class=\"form-control\" type=\"text\">")
                        .on('keyup', o => {
                            answers.data('answer', o.target.value);
                        })
                )
        );
    }
}

// Отправляет ответы из соответствующего массива questionAnswers:
async function sendAnswers(){
    let data = {form: {}};
    data["form"]["action"] = "sendAnswers";
    data["form"]["testId"] = testId;
    data["form"]["answers"] = Array();

    questionAnswers.forEach(
        answer => {
            data["form"]["answers"].push(
                {
                    questionId: answer.questionId,
                answer: answer.jQueryObject.data('answer')
                }
            );
        }
    );

    console.log(data);

    return postAjax(
        siteURL + '/tests.php',
        data,
        new ConnectException("Произошла ошибка при отправке ответов!")
    );
}

$(() => {
    if (testId === null) {
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