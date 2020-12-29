<?php /** @noinspection PhpUnusedLocalVariableInspection */
/** @noinspection PhpUndefinedVariableInspection */

// Возвращает массив тестов, доступных пользователю с id = userId.
function GetAvailableTestsForUser($db, $userId)
{
    $returnArray = array();
    // Возвращает id пользователя, ник пользователя и дату окончания "сессии" для пользователя с заданным хешем входа и IP-адресом:
    $getAvailableTestsForUser = $db->prepare("SELECT testId, name, creationDatetime, openDatetime, closeDatetime, maxTries, timeToComplete, usedTries, isCompleted, inProgress
                                                FROM testsavaliabletouser
                                                WHERE userId = :userId;");
    $getAvailableTestsForUser->bindParam(':userId', $_userId);

    $_userId = $userId;

    if ($getAvailableTestsForUser->execute()) {
        if ($getAvailableTestsForUser->rowCount() > 0) {
            $returnArray = $getAvailableTestsForUser->fetchAll(PDO::FETCH_ASSOC);
        }
    }

    return $returnArray;
}

// Вовзвращает массив попыток прохождения определённого теста определённым пользователем
function GetTestTries($db, $userId, $testId)
{
    $returnArray = array();
    // Возвращает id пользователя, ник пользователя и дату окончания "сессии" для пользователя с заданным хешем входа и IP-адресом:
    $getTestTries = $db->prepare("SELECT try, finished, score, startedDatetime
                                                FROM testsresults
                                                WHERE testId = :testId AND userId = :userId;");
    $getTestTries->bindParam(':testId', $_testId);
    $getTestTries->bindParam(':userId', $_userId);

    $_userId = $userId;
    $_testId = $testId;

    if ($getTestTries->execute()) {
        if ($getTestTries->rowCount() > 0) {
            $returnArray = $getTestTries->fetchAll(PDO::FETCH_ASSOC);
        }
    }

    return $returnArray;
}

// Возвращает, может ли пользователь userId начать выполнение теста testId
function CanUserStartTest($db, $userId, $testId){
    $returnVar = false;
    // Возвращает 1 или 0. 1 - можно начать тест, 0 - нельзя начать тест.
    $getIsTestAvailableForUser = $db->prepare("SELECT CanStartNewTry(:userId, :testId) AS canStart;");
    $getIsTestAvailableForUser->bindParam(':userId', $_userId);
    $getIsTestAvailableForUser->bindParam(':testId', $_testId);

    $_userId = $userId;
    $_testId = $testId;

    if ($getIsTestAvailableForUser->execute()) {
        if ($getIsTestAvailableForUser->rowCount() > 0) {
            $row = $getIsTestAvailableForUser->fetch(PDO::FETCH_ASSOC);
            $returnVar = $row["canStart"] == "1";
        }
    }

    return $returnVar;
}

// Начинает новую попытку теста
function StartNewTestTry($db, $userId, $testId){
    // Создаёт новую попытку в testsResults
    $getIsTestAvailableForUser = $db->prepare("CALL StartNewTry(:userId, :testId);");
    $getIsTestAvailableForUser->bindParam(':userId', $_userId);
    $getIsTestAvailableForUser->bindParam(':testId', $_testId);

    $_userId = $userId;
    $_testId = $testId;

    if ($getIsTestAvailableForUser->execute()) {
        return true;
    } else {
        return false;
    }
}

// Возвращает true, если тест testId доступен для пользователя userId.
function IsTestAvailableForUser($db, $testId, $userId)
{
    $returnVar = false;
    // Возвращает 1 или 0. 1 - тест доступен, 0 - тест не доступен
    $getIsTestAvailableForUser = $db->prepare("SELECT IF(COUNT(*) > 0, 1, 0) AS available
                                                FROM testsavaliabletouser
                                                WHERE userId = :userId AND testId = :testId;");
    $getIsTestAvailableForUser->bindParam(':userId', $_userId);
    $getIsTestAvailableForUser->bindParam(':testId', $_testId);

    $_userId = $userId;
    $_testId = $testId;

    if ($getIsTestAvailableForUser->execute()) {
        if ($getIsTestAvailableForUser->rowCount() > 0) {
            $row = $getIsTestAvailableForUser->fetch(PDO::FETCH_ASSOC);
            $returnVar = $row["available"] == "1";
        }
    }

    return $returnVar;
}

// Возвращает true, если тест testId не закончен пользователем userId.
function IsTestStartedByUser($db, $testId, $userId)
{
    $returnVar = false;
    // Возвращает 1 или 0. 1 - тест доступен, 0 - тест не доступен
    $getIsTestAvailableForUser = $db->prepare("SELECT edudb.UserHasUnfinishedTest(:userId, :testId) AS 'hasUnfinished';");
    $getIsTestAvailableForUser->bindParam(':userId', $_userId);
    $getIsTestAvailableForUser->bindParam(':testId', $_testId);

    $_userId = $userId;
    $_testId = $testId;

    if ($getIsTestAvailableForUser->execute()) {
        if ($getIsTestAvailableForUser->rowCount() > 0) {
            $row = $getIsTestAvailableForUser->fetch(PDO::FETCH_ASSOC);
            $returnVar = $row["hasUnfinished"] == "1";
        }
    }

    return $returnVar;
}

// Возвращает массив вопросов теста
function GetTestQuestions($db, $testId)
{
    $returnArray = array();
    $getTestQuestions = $db->prepare("SELECT testquestions.id AS id, text, q.id AS questionTypeId, name AS questionTypeName, description AS questionTypeDescription, hasCorrectAnswer, hasVariants
                            FROM testquestions JOIN questiontypes q on q.id = testquestions.questionType
                            WHERE testId = :testId ORDER BY id;");
    $getTestQuestions->bindParam(':testId', $_testId);

    $_testId = $testId;

    if ($getTestQuestions->execute()) {
        if ($getTestQuestions->rowCount() > 0) {
            $returnArray = $getTestQuestions->fetchAll(PDO::FETCH_ASSOC);
        }
    }

    return $returnArray;
}

// Возвращает массив типа "номер вопроса - вариант ответа"
// Возвращает ответы для заданий, у которых hasVariants = 1 !
function GetTestAnswers($db, $testId)
{
    $returnArray = array();
    $getTestTries = $db->prepare("SELECT questionId, answer
                                        FROM testsanswers ta JOIN testquestions tq on tq.testId = ta.testId and tq.id = ta.questionId JOIN questiontypes q on q.id = tq.questionType and hasVariants = 1
                                        WHERE ta.testId = :testId;");
    $getTestTries->bindParam(':testId', $_testId);

    $_testId = $testId;

    if ($getTestTries->execute()) {
        if ($getTestTries->rowCount() > 0) {
            $returnArray = $getTestTries->fetchAll(PDO::FETCH_ASSOC);
        }
    }

    return $returnArray;
}

// Возвращает массив типа "номер вопроса - вариант ответа - правильный ли ответ".
// Возвращает ответы для заданий, у которых hasCorrectAnswer = 1 !
function GetTestAnswersWithCorrectness($db, $testId)
{
    $returnArray = array();
    $getTestTries = $db->prepare("SELECT ta.id AS answerId, questionId, answer, correct
                                    FROM testsanswers ta JOIN testquestions tq on tq.testId = ta.testId and tq.id = ta.questionId JOIN questiontypes q on q.id = tq.questionType and hasCorrectAnswer = 1
                                    WHERE ta.testId = :testId;");
    $getTestTries->bindParam(':testId', $_testId);

    $_testId = $testId;

    if ($getTestTries->execute()) {
        if ($getTestTries->rowCount() > 0) {
            $returnArray = $getTestTries->fetchAll(PDO::FETCH_ASSOC);
        }
    }

    return $returnArray;
}

// Возвращает информацию о тесте
function GetTestInfo($db, $testId)
{
    $getTestName = $db->prepare("SELECT name, timeToComplete FROM tests WHERE id = :testId;");
    $getTestName->bindParam(':testId', $_testId);

    $_testId = $testId;

    if ($getTestName->execute()) {
        if ($getTestName->rowCount() > 0) {
            return $getTestName->fetch(PDO::FETCH_ASSOC);
        }
    }

    return null;
}

// Добавляет ответ к вопросу:
function AddAnswer($db, $userId, $testId, $questionId, $answer){
    $addNewAnswer = $db->prepare("CALL AddNewAnswer(:userId, :testId, :questionId, :answer);");
    $addNewAnswer->bindParam(':userId', $_userId);
    $addNewAnswer->bindParam(':testId', $_testId);
    $addNewAnswer->bindParam(':questionId', $_questionId);
    $addNewAnswer->bindParam(':answer', $_answer);

    $_userId = $userId;
    $_testId = $testId;
    $_questionId = $questionId;
    $_answer = $answer;

    if ($addNewAnswer->execute()) {
        return true;
    }

    return false;
}

// Заканчивает тест testId, который проходит userId.
// Вызывается соответсвующая процедура, попытка заканчивается, происходит попытка авто-проверки.
function EndTest($db, $userId, $testId){
    $endTest = $db->prepare("CALL EndCurrentTestTry(:userId, :testId);");
    $endTest->bindParam(':userId', $_userId);
    $endTest->bindParam(':testId', $_testId);

    $_userId = $userId;
    $_testId = $testId;

    if ($endTest->execute()) {
        return true;
    }

    return false;
}

// Возвращает true, если пользователь обладает возможностью редактировать тесты
function IfUserCanEditTests($db, $userId){
    $returnVar = false;
    // Возвращает 1 или 0. 1 - пользователь обладает нужными правами, 0 - ... не обладает
    $ifUserCanEditTests = $db->prepare("SELECT ableToEditTests FROM usersgroups JOIN users u on usersgroups.id = u.groupId and u.id = :userId;");
    $ifUserCanEditTests->bindParam(':userId', $_userId);

    $_userId = $userId;

    if ($ifUserCanEditTests->execute()) {
        if ($ifUserCanEditTests->rowCount() > 0) {
            $row = $ifUserCanEditTests->fetch(PDO::FETCH_ASSOC);
            $returnVar = $row["ableToEditTests"] == "1";
        }
    }

    return $returnVar;
}

// Возвращает true, если пользователь обладает возможностью проверять тесты
function IfUserCanCheckTests($db, $userId){
    $returnVar = false;
    // Возвращает 1 или 0. 1 - пользователь обладает нужными правами, 0 - ... не обладает
    $ifUserCanEditTests = $db->prepare("SELECT ableToCheckTests FROM usersgroups JOIN users u on usersgroups.id = u.groupId and u.id = :userId;");
    $ifUserCanEditTests->bindParam(':userId', $_userId);

    $_userId = $userId;

    if ($ifUserCanEditTests->execute()) {
        if ($ifUserCanEditTests->rowCount() > 0) {
            $row = $ifUserCanEditTests->fetch(PDO::FETCH_ASSOC);
            $returnVar = $row["ableToCheckTests"] == "1";
        }
    }

    return $returnVar;
}

// Возвращает массив, содержащий все тесты
function GetAllTests($db){
    $returnArray = array();
    // Возвращает id пользователя, ник пользователя и дату окончания "сессии" для пользователя с заданным хешем входа и IP-адресом:
    $getAllTests = $db->prepare("SELECT id, name, creationDatetime, openDatetime, closeDatetime, maxTries, timeToComplete, locked FROM tests;");

    if ($getAllTests->execute()) {
        if ($getAllTests->rowCount() > 0) {
            $returnArray = $getAllTests->fetchAll(PDO::FETCH_ASSOC);
        }
    }

    return $returnArray;
}

// Возвращает массив, содержащий все студенческие группы
function GetAllStudentsGroups($db){
    $returnArray = array();
    $getAllStudentsGroups = $db->prepare("SELECT id, name FROM studentsgroups;");

    if ($getAllStudentsGroups->execute()) {
        if ($getAllStudentsGroups->rowCount() > 0) {
            $returnArray = $getAllStudentsGroups->fetchAll(PDO::FETCH_ASSOC);
        }
    }

    return $returnArray;
}

// Возвращает массив студенческих групп, которым разрешено прохождение теста
function GetTestStudentsGroups($db, $testId){
    $returnArray = array();
    $getTestStudentsGroups = $db->prepare("SELECT id, name
                                        FROM studentsgroups JOIN testsstudentsgroups t on studentsgroups.id = t.studentgroupId and testId = :testId;");
    $getTestStudentsGroups->bindParam(':testId', $_testId);

    $_testId = $testId;

    if ($getTestStudentsGroups->execute()) {
        if ($getTestStudentsGroups->rowCount() > 0) {
            $returnArray = $getTestStudentsGroups->fetchAll(PDO::FETCH_ASSOC);
        }
    }

    return $returnArray;
}

// Добавляет студенческую группу к тесту, разрешая студентам из этой группы проходить данный тест
function AddStudentsGroupToTest($db, $testId, $groupId){
    $addStudentsGroupToTest = $db->prepare("CALL AddStudentsGroupToTest(:testId, :studentsgroupId);");
    $addStudentsGroupToTest->bindParam(':testId', $_testId);
    $addStudentsGroupToTest->bindParam(':studentsgroupId', $_groupId);

    $_testId = $testId;
    $_groupId = $groupId;

    if ($addStudentsGroupToTest->execute()) {
        return true;
    }

    return false;
}

// Удаляет студенческую группу из тесту, запрещая студентам из этой группы проходить данный тест
function RemoveStudentsGroupFromTest($db, $testId, $groupId){
    $addStudentsGroupToTest = $db->prepare("CALL RemoveStudentsGroupFromTest(:testId, :studentsgroupId);");
    $addStudentsGroupToTest->bindParam(':testId', $_testId);
    $addStudentsGroupToTest->bindParam(':studentsgroupId', $_groupId);

    $_testId = $testId;
    $_groupId = $groupId;

    if ($addStudentsGroupToTest->execute()) {
        return true;
    }

    return false;
}

// Вовзвращает массив типов вопросов
function GetQuestionTypes($db){
    $returnArray = array();
    $getQuestionTypes = $db->prepare("SELECT id, name, description, hasCorrectAnswer, hasVariants FROM questiontypes;");

    if ($getQuestionTypes->execute()) {
        if ($getQuestionTypes->rowCount() > 0) {
            $returnArray = $getQuestionTypes->fetchAll(PDO::FETCH_ASSOC);
        }
    }

    return $returnArray;
}

// Обновляет или вставляет вопрос в тест
function UpdateOrInsertQuestion($db, $testId, $questionId, $questionText, $questionTypeId){
    $updateOrInsertQuestion = $db->prepare("INSERT INTO testquestions(testId, id, text, questionType) VALUE (:testId, :id, :text, :questionType)
                                                ON DUPLICATE  KEY UPDATE text = :text, questionType = :questionType;");
    $updateOrInsertQuestion->bindParam(':testId', $_testId);
    $updateOrInsertQuestion->bindParam(':id', $_id);
    $updateOrInsertQuestion->bindParam(':text', $_text);
    $updateOrInsertQuestion->bindParam(':questionType', $_questionType);

    $_testId = $testId;
    $_id = $questionId;
    $_text = $questionText;
    $_questionType = $questionTypeId;

    if ($updateOrInsertQuestion->execute()) {
        return true;
    }

    return false;
}

// Удаляет все ответы на определённый тест
function RemoveAllTestAnswers($db, $testId){
    $removeAllTestAnswers = $db->prepare("DELETE FROM testsanswers
                                                WHERE testId = :testId;");
    $removeAllTestAnswers->bindParam(':testId', $_testId);

    $_testId = $testId;

    if ($removeAllTestAnswers->execute()) {
        return true;
    }

    return false;
}

// Добавляет новый ответ на вопрос определённого теста
function AddNewTestAnswer($db, $testId, $questionId, $answerText, $correct){
    $addNewTestAnswer = $db->prepare("INSERT INTO testsanswers(testId, questionId, answer, correct)
                                            VALUE (:testId, :questionId, :answer, :correct);");
    $addNewTestAnswer->bindParam(':testId', $_testId);
    $addNewTestAnswer->bindParam(':questionId', $_questionId);
    $addNewTestAnswer->bindParam(':answer', $_answer);
    $addNewTestAnswer->bindParam(':correct', $_correct);

    $_testId = $testId;
    $_questionId = $questionId;
    $_answer = $answerText;
    $_correct = $correct;

    if ($addNewTestAnswer->execute()) {
        return true;
    }

    return false;
}

function CreateNewTest($db, $name, $creationDatetime, $openDatetime, $closeDatetime, $maxTries, $timeToComplete, $locked){
    $createNewTest = $db->prepare("INSERT INTO tests(name, creationDatetime, openDatetime, closeDatetime, maxTries, timeToComplete, locked)
                                     VALUE (:name, :creationDatetime, :openDatetime, :closeDatetime, :maxTries, :timeToComplete, :locked);");
    $createNewTest->bindParam(':name', $_name);
    $createNewTest->bindParam(':creationDatetime', $_creationDatetime);
    $createNewTest->bindParam(':openDatetime', $_openDatetime);
    $createNewTest->bindParam(':closeDatetime', $_closeDatetime);
    $createNewTest->bindParam(':maxTries', $_maxTries);
    $createNewTest->bindParam(':timeToComplete', $_timeToComplete);
    $createNewTest->bindParam(':locked', $_locked);

    $_name = $name;
    $_creationDatetime = $creationDatetime;
    $_openDatetime = ($openDatetime === "" ? null : $openDatetime);
    $_closeDatetime = ($closeDatetime === "" ? null : $closeDatetime);
    $_maxTries = $maxTries;
    $_timeToComplete = ($timeToComplete === "" ? null : $timeToComplete);
    $_locked = $locked;

    if ($createNewTest->execute()) {
        return true;
    }

    return false;
}

function UpdateTest($db, $testId, $name, $creationDatetime, $openDatetime, $closeDatetime, $maxTries, $timeToComplete, $locked){
    $updateTest = $db->prepare("UPDATE tests
                                    SET name = :name, creationDatetime = :creationDatetime, openDatetime = :openDatetime, closeDatetime = :closeDatetime, maxTries = :maxTries, timeToComplete = :timeToComplete, locked = :locked
                                    WHERE id = :id;");
    $updateTest->bindParam(':id', $_id);
    $updateTest->bindParam(':name', $_name);
    $updateTest->bindParam(':creationDatetime', $_creationDatetime);
    $updateTest->bindParam(':openDatetime', $_openDatetime);
    $updateTest->bindParam(':closeDatetime', $_closeDatetime);
    $updateTest->bindParam(':maxTries', $_maxTries);
    $updateTest->bindParam(':timeToComplete', $_timeToComplete);
    $updateTest->bindParam(':locked', $_locked);

    $_id = $testId;
    $_name = $name;
    $_creationDatetime = $creationDatetime;
    $_openDatetime = ($openDatetime === "" ? null : $openDatetime);
    $_closeDatetime = ($closeDatetime === "" ? null : $closeDatetime);
    $_maxTries = $maxTries;
    $_timeToComplete = ($timeToComplete === "" ? null : $timeToComplete);
    $_locked = $locked;

    if ($updateTest->execute()) {
        return true;
    }

    return false;
}

// Получает все прохождения теста, в которых есть непроверенные ответы
function GetResultsWithReviewNeeded($db, $testId){
    $returnArray = array();
    $getResultsWithReviewNeeded = $db->prepare("SELECT testId, testsresults.userId AS userId, try, firstName, surname, secondName
                                                FROM testsresults JOIN users u on u.id = testsresults.userId and testId = :testId and needsReview = 1 JOIN usersinfo u2 on u.id = u2.userId
                                                ORDER BY surname, firstName, secondName, try;");
    $getResultsWithReviewNeeded->bindParam(':testId', $_testId);

    $_testId = $testId;

    if ($getResultsWithReviewNeeded->execute()) {
        if ($getResultsWithReviewNeeded->rowCount() > 0) {
            $returnArray = $getResultsWithReviewNeeded->fetchAll(PDO::FETCH_ASSOC);
        }
    }

    return $returnArray;
}

// Получает все тесты, у которых есть вопросы без правильного ответа (которые нужно проверять вручную)
function GetTestsWithQuestionsWithoutCorrectAnswer($db){
    $returnArray = array();
    $getTestsWithQuestionsWithoutCorrectAnswer = $db->prepare("SELECT t2.id, t2.name, COUNT(needsReview) AS countOfNeededReviews
                                                                            FROM questiontypes JOIN testquestions t on questiontypes.id = t.questionType and hasCorrectAnswer = 0 JOIN tests t2 on t.testId = t2.id
                                                                            JOIN testsresults t3 on t2.id = t3.testId AND needsReview = 1
                                                                            GROUP BY t2.id, t2.name
                                                                            ORDER BY id;");

    if ($getTestsWithQuestionsWithoutCorrectAnswer->execute()) {
        if ($getTestsWithQuestionsWithoutCorrectAnswer->rowCount() > 0) {
            $returnArray = $getTestsWithQuestionsWithoutCorrectAnswer->fetchAll(PDO::FETCH_ASSOC);
        }
    }

    return $returnArray;
}

// Получает вопрос, который нужно досмотреть, и ответ студента
function GetQuestionsWithoutCorrectAnswerWithUserAnswers($db, $testId, $userId, $try){
    $returnArray = array();
    $getQuestionsWithoutCorrectAnswerWithUserAnswers = $db->prepare("SELECT testquestions.testId AS testId, userId, try, testquestions.id AS questionId, text, answer
                                                                            FROM testquestions JOIN testsusersanswers t on testquestions.testId = t.testId and testquestions.id = t.questionId
                                                                                AND testquestions.testId = :testId AND userId = :userId AND try = :try
                                                                                               JOIN questiontypes q on q.id = testquestions.questionType AND q.hasCorrectAnswer = 0;");

    $getQuestionsWithoutCorrectAnswerWithUserAnswers->bindParam(':testId', $_testId);
    $getQuestionsWithoutCorrectAnswerWithUserAnswers->bindParam(':userId', $_userId);
    $getQuestionsWithoutCorrectAnswerWithUserAnswers->bindParam(':try', $_try);

    $_testId = $testId;
    $_userId = $userId;
    $_try = $try;

    if ($getQuestionsWithoutCorrectAnswerWithUserAnswers->execute()) {
        if ($getQuestionsWithoutCorrectAnswerWithUserAnswers->rowCount() > 0) {
            $returnArray = $getQuestionsWithoutCorrectAnswerWithUserAnswers->fetchAll(PDO::FETCH_ASSOC);
        }
    }

    return $returnArray;
}

// Устанавливает правильность вопроса
function SetAnswerCorrectness($db, $testId, $userId, $tryId, $questionId, $correctness){
    $setAnswerCorrectness = $db->prepare("CALL SetAnswerCorrectness(:testId, :questionId, :try, :userId, :correct);");
    $setAnswerCorrectness->bindParam(':testId', $_testId);
    $setAnswerCorrectness->bindParam(':questionId', $_questionId);
    $setAnswerCorrectness->bindParam(':try', $_try);
    $setAnswerCorrectness->bindParam(':userId', $_userId);
    $setAnswerCorrectness->bindParam(':correct', $_correct);

    $_testId = $testId;
    $_questionId = $questionId;
    $_try = $tryId;
    $_userId = $userId;
    $_correct = $correctness;

    if ($setAnswerCorrectness->execute()) {
        return true;
    }

    return false;
}

// Форсированно завершает указанный тест и пересчитывает оценку теста
function ForceEndTest($db, $testId, $userId, $tryId){
    $forceEndTest = $db->prepare("CALL ForceCountTestScore(:userId,:testId,:try);");
    $forceEndTest->bindParam(':testId', $_testId);
    $forceEndTest->bindParam(':try', $_try);
    $forceEndTest->bindParam(':userId', $_userId);

    $_testId = $testId;
    $_try = $tryId;
    $_userId = $userId;

    if ($forceEndTest->execute()) {
        return true;
    }

    return false;
}

// Получает результаты выполнения для теста
// Если groupId === "", сортировка по группе не осуществляется
function GetTestResults($db, $testId, $groupId){
    $returnArray = array();
    if ($groupId === ""){
        $GetTestResults = $db->prepare("SELECT firstName, surname, secondName, testId, MAX(finished) AS finished, IFNULL(MAX(score), 0) as score
                                            FROM testsresults JOIN users u on u.id = testsresults.userId JOIN usersinfo u2 on u.id = u2.userId
                                            WHERE testId = :testId and needsReview = 0
                                            GROUP BY testsresults.userId, testId;");
    } else {
        $GetTestResults = $db->prepare("SELECT firstName, surname, secondName, testId, MAX(finished) AS finished, IFNULL(MAX(score), 0) as score
                                            FROM testsresults JOIN users u on u.id = testsresults.userId JOIN usersinfo u2 on u.id = u2.userId JOIN usersstudentsgroups u3 on testsresults.userId = u3.userId and studentgroupId = :groupId
                                            WHERE testId = :testId and needsReview = 0
                                            GROUP BY testsresults.userId, testId;");
        $GetTestResults->bindParam(':groupId', $_groupId);
        $_groupId = $groupId;
    }

    $GetTestResults->bindParam(':testId', $_testId);

    $_testId = $testId;

    if ($GetTestResults->execute()) {
        if ($GetTestResults->rowCount() > 0) {
            $returnArray = $GetTestResults->fetchAll(PDO::FETCH_ASSOC);
        }
    }

    return $returnArray;
}
?>