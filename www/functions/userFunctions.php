<?php /** @noinspection PhpUnusedLocalVariableInspection */
/** @noinspection PhpUndefinedVariableInspection */

// Возвращает массив, содержащий основную информацию о пользователе и группе, к которой он принадлежит.
function getUserInfo($db, $userId){
    $returnArray = array();
    $getUserInfo = $db->prepare("SELECT login, firstName, surname, secondName, email, ug.*
                                FROM users
                                JOIN usersgroups ug ON ug.id = users.groupId AND users.id = :userId
                                JOIN usersinfo u2 on users.id = u2.userId;");
    $getUserInfo->bindParam(':userId', $_userId);
    $_userId = $userId;

    if ($getUserInfo->execute()){
        if ($getUserInfo->rowCount()>0) {
            $returnArray = $getUserInfo->fetch(PDO::FETCH_ASSOC);
        }
    }

    return $returnArray;
}

// Обновляет информацию о пользователе информацией из переданного массива
function UpdateUserInfo($db, $userId, $userInfoArray){
    $updateUserInfo = $db->prepare("UPDATE usersinfo
                SET firstName = :firstName, secondName = :secondName, surname = :surname, email = :email
                WHERE userId = :userId;");
    $updateUserInfo->bindParam(':userId', $_userId);
    $updateUserInfo->bindParam(':firstName', $_firstName);
    $updateUserInfo->bindParam(':secondName', $_secondName);
    $updateUserInfo->bindParam(':surname', $_surname);
    $updateUserInfo->bindParam(':email', $_email);

    $_userId = $userId;
    $_firstName = $userInfoArray["firstName"];
    $_secondName = $userInfoArray["secondName"];
    $_surname = $userInfoArray["surname"];
    $_email = $userInfoArray["email"];

    if ($updateUserInfo->execute()) {
        return true;
    }

    return false;
}
?>