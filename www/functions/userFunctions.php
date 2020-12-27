<?php

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

?>