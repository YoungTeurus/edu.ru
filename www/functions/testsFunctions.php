<?php

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

// Возвращает true, если тест testId доступен для пользователя userId.
function IsTestAvailableForUser($db, $testId, $userId){
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
function IsTestStartedByUser($db, $testId, $userId){
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
function GetTestQuestions($db, $testId){
    $returnArray = array();
    // Возвращает id пользователя, ник пользователя и дату окончания "сессии" для пользователя с заданным хешем входа и IP-адресом:
    $getTestQuestions = $db->prepare("SELECT id, text, questionType
                                    FROM testquestions
                                    WHERE testId = :testId;");
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
function GetTestAnswers($db, $testId){
    $returnArray = array();
    // Возвращает id пользователя, ник пользователя и дату окончания "сессии" для пользователя с заданным хешем входа и IP-адресом:
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

?>