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

// Возвращает true, если пользователь обладает возможностью менять студенческие группы других пользователей
function IfUserCanChangeStudentsGroup($db, $userId){
    $returnVar = false;
    // Возвращает 1 или 0. 1 - пользователь обладает нужными правами, 0 - ... не обладает
    $ifUserCanEditTests = $db->prepare("SELECT ableToChangeUsersStudentGroup FROM usersgroups JOIN users u on usersgroups.id = u.groupId and u.id = :userId;");
    $ifUserCanEditTests->bindParam(':userId', $_userId);

    $_userId = $userId;

    if ($ifUserCanEditTests->execute()) {
        if ($ifUserCanEditTests->rowCount() > 0) {
            $row = $ifUserCanEditTests->fetch(PDO::FETCH_ASSOC);
            $returnVar = $row["ableToChangeUsersStudentGroup"] == "1";
        }
    }

    return $returnVar;
}

// Возвращает всех пользователей с их информацией
function GetAllUsers($db){
    $returnArray = array();
    $getAllUsers = $db->prepare("SELECT id, id, groupId, firstName, surname, secondName, email
                                        FROM users JOIN usersinfo u on users.id = u.userId;");
    $getAllUsers->bindParam(':userId', $_userId);

    $_userId = $userId;

    if ($getAllUsers->execute()){
        if ($getAllUsers->rowCount()>0) {
            $returnArray = $getAllUsers->fetchAll(PDO::FETCH_ASSOC);
        }
    }

    return $returnArray;
}

// Возвращает все группы пользователя
function GetUserGroups($db, $userId){
    $returnArray = array();
    $getUserGroups = $db->prepare("SELECT id, name, userId
                                        FROM studentsgroups JOIN usersstudentsgroups u on studentsgroups.id = u.studentgroupId AND userId = :userId;");
    $getUserGroups->bindParam(':userId', $_userId);
    $_userId = $userId;

    if ($getUserGroups->execute()){
        if ($getUserGroups->rowCount()>0) {
            $returnArray = $getUserGroups->fetchAll(PDO::FETCH_ASSOC);
        }
    }

    return $returnArray;
}

function RemoveUserFromGroup($db, $userId, $groupId){
    $removeUserFromGroup = $db->prepare("DELETE FROM usersstudentsgroups
                        WHERE userId = :userId AND studentgroupId = :groupId;");
    $removeUserFromGroup->bindParam(':userId', $_userId);
    $removeUserFromGroup->bindParam(':groupId', $_groupId);

    $_userId = $userId;
    $_groupId = $groupId;

    if ($removeUserFromGroup->execute()) {
        return true;
    }

    return false;
}

function AddUserToGroup($db, $userId, $groupId){
    $addUserToGroup = $db->prepare("INSERT INTO usersstudentsgroups(userId, studentgroupId) VALUE (:userId, :groupId);");
    $addUserToGroup->bindParam(':userId', $_userId);
    $addUserToGroup->bindParam(':groupId', $_groupId);

    $_userId = $userId;
    $_groupId = $groupId;

    if ($addUserToGroup->execute()) {
        return true;
    }

    return false;
}
?>