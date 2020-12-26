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

?>