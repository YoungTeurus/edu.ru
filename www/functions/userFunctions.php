<?php

// Получает информацию о пользователе, возвращая объект с полями:
// success - флаг успешности выполнения
// login - логин пользователя
// group - группа пользователя
// firstName - имя пользователя
// surname - фамилия пользователя
// secondName - отчество пользователя
// email - почта пользователя
function getUserInfo($db, $userId){
    $getUserInfo = $db->prepare("SELECT login, name, firstName, surname, secondName, email
                                    FROM users
                                    JOIN usersgroups `groups` ON `groups`.id = users.groupId AND users.id = :userId
                                    JOIN usersinfo u2 on users.id = u2.userId");
    $getUserInfo->bindParam(':userId', $_userId);
    $_userId = $userId;

    $returnObject = new stdClass();
    if ($getUserInfo->execute()){
        if ($getUserInfo->rowCount()>0) {
            $returnObject->success = true;
            $result = $getUserInfo->fetch();
            $returnObject->login = $result['login'];
            $returnObject->name = $result['name'];
            $returnObject->firstName = $result['firstName'];
            $returnObject->surname = $result['surname'];
            $returnObject->secondName = $result['secondName'];
            $returnObject->email = $result['email'];
        }
        else{
            $returnObject->success = false;
        }
    }
    else{
        $returnObject->success = false;
    }

    return $returnObject;
}

?>