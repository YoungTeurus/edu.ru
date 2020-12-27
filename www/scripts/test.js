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
                        e => {
                            e.preventDefault();
                            // Показываем спиннер:
                            const spinner = $("#sendAnswers .spinner");
                            spinner[0].classList.remove('hidden');
                            sendAnswers().then(
                                msg => {
                                    console.log(msg);
                                    // Скрываем спиннер:
                                    spinner[0].classList.add('hidden');
                                    if(msg["success"]){
                                        if(!msg["error"]){
                                            if(msg["added"]){
                                                // Если всё успешно...
                                                showModal(
                                                    "<h5 class=\"modal-title\">Тест завершён</h5>",
                                                    "<div class=\"container text-center\">\n" +
                                                    "                        <div class=\"row col-6 m-auto\">\n" +
                                                    "                            <svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" id=\"Layer_1\"style=\"enable-background:new 0 0 512 512;\" version=\"1.1\" viewBox=\"0 0 512 512\"xml:space=\"preserve\"><style type=\"text/css\">.st0 {fill: #41AD49;}</style><g><polygon class=\"st0\" points=\"434.8,49 174.2,309.7 76.8,212.3 0,289.2 174.1,463.3 196.6,440.9 196.6,440.9 511.7,125.8 434.8,49     \"/></g></svg>\n" +
                                                    "                        </div>\n" +
                                                    "                        <div class=\"row\">\n" +
                                                    "                            <p>Тест был успешно завершён!</p>\n" +
                                                    "                            <p>Вы можете закрыть эту страницу, или она сама закроется через 3 секунды.</p>\n" +
                                                    "                        </div>\n" +
                                                    "                    </div>",
                                                    ""
                                                );
                                                setTimeout(() => {
                                                    window.close();
                                                }, 3000)
                                            }
                                        } else {
                                            // Если произошла ошибка:
                                            showErrorModal(msg["errorText"]);
                                        }
                                    }
                                }
                            );
                        }
                    );
                } else {
                    showErrorModal(msg["errorText"]);
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