<?php
include_once("./functions/loginFunctions.php");
include_once("./functions/userFunctions.php");
header("access-control-allow-origin: *");

$message = array();
// Флаг успеха операции. Обязательно должен выставляться в true, если отправлены какие-либо данные.
$message["success"] = false;
// Флаг ошибки. Обязательно должен выставляться в true, если в процессе выполнения была допущена ошибка.
$message["error"] = false;
// Текст ошибки. Обязательно должен заполняться при $message["error"] = true.
$message["errorText"] = "";

// Подключение к БД:
$db = null;
try{
    $db = new PDO('mysql:host=localhost;dbname=edudb', 'root', '');
}
catch (PDOException $e){
    print "Error!:" . $e->getMessage() . "<br/>";
    die();
}
// Конец настройки БД.
if (isset($_POST["form"])){
    makeArrayValuesSafe($_POST["form"]);
    $userStatus = checkIfUserLogined($db, $_SERVER['REMOTE_ADDR'], $_COOKIE['loginHash']);
    switch ($_POST["form"]["action"]){
        case "getUserInfo":{
            if ($userStatus->logined) {
                // Если пользователь авторизован:
                $message["userInfo"] = getUserInfo($db, $userStatus->userId);
            } else {
                // Если пользователь не авторизован:
                $message["error"] = true;
                $message["errorText"] = "Пользователь не авторизован.";
            }
            $message["success"] = true;
            break;
        }
        case "saveUserInfo":{
            if ($userStatus->logined) {
                // Если пользователь авторизован:
                if (isset($_POST["form"]["userInfo"])){
                    $message["saved"] = UpdateUserInfo($db, $userStatus->userId, $_POST["form"]["userInfo"]);
                } else {
                    // Если необходимое значение не передано.
                    $message["error"] = true;
                    $message["errorText"] = "Не было передано одно из следующих значений: userInfo.";
                }
            } else {
                // Если пользователь не авторизован:
                $message["error"] = true;
                $message["errorText"] = "Пользователь не авторизован.";
            }
            $message["success"] = true;
            break;
        }
    }
}

echo json_encode($message);
?>

