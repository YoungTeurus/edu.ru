<?php
include_once("./functions/loginFunctions.php");
include_once("./functions/userFunctions.php");
header("access-control-allow-origin: *");

$message = array();
// Флаг успеха операции. Обязательно должен выставляться в true, если отправлены какие-либо данные.
$message["success"] = false;

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
    switch ($_POST["form"]["action"]){
        case "login":{
            if (checkIfUserLogined($db, $_SERVER['REMOTE_ADDR'], $_COOKIE['loginHash'])->logined){
                // Если пользователь уже вошёл:
                $message["success"] = true;
                $message["logined"] = true;
            } else {
                // Если пользователь хочет войти:
                $cookieObject = loginUser($db, $_POST["form"]["userLogin"], $_POST["form"]["userPassword"], $_SERVER['REMOTE_ADDR']);
                if ($cookieObject !== null){
                    updateCookies("loginHash", $cookieObject->cookieHash, $cookieObject->expiresDateSeconds);
                    $message["logined"] = true;
                } else {
                    $message["logined"] = false;
                    $message["error"] = 'Введена недействительная пара логин/пароль.';
                }
                $message["success"] = true;
            }
            break;
        }
        case "logout":{
            if (checkIfUserLogined($db, $_SERVER['REMOTE_ADDR'], $_COOKIE['loginHash'])->logined) {
                // Если пользователь залогинен
                removeUserCookie($db, $_COOKIE['loginHash'], $_SERVER['REMOTE_ADDR']);
                removeCookieFromBrowser('loginHash');
                $message["success"] = true;
            }
            break;
        }
        case "register":{
            $registerObject = registerUser($db, $_POST["form"]["userLogin"], $_POST["form"]["userPassword"]);
            if($registerObject->completed){
                $message["registered"] = true;
            } else {
                $message["registered"] = false;
                $message["test"] = array($registerObject->err, $registerObject->err1, $registerObject->err2, $registerObject->err3);
                $message["errorObject"] = $registerObject->errorObject;
                $message["error"] = $registerObject->errorText;
            }
            $message["success"] = true;
            break;
        }
        case "checkLoginStatus":{
            if (checkIfUserLogined($db, $_SERVER['REMOTE_ADDR'], $_COOKIE['loginHash'])->logined){
                // Если пользователь уже вошёл:
                $message["success"] = true;
                $message["logined"] = true;
            } else {
                $message["success"] = true;
                $message["logined"] = false;
            }
            break;
        }
        case "getUserInfo":{
            $userlogin = checkIfUserLogined($db, $_SERVER['REMOTE_ADDR'], $_COOKIE['loginHash']);
            if ($userlogin->logined) {
                // Если пользователь вошёл:
                $message["success"] = true;
                $message["logined"] = true;
                $message["userinfo"] = getUserInfo($db, $userlogin->userId);
            } else {
                // Если пользователь не авторизован:
                $message["success"] = true;
                $message["logined"] = false;
            }
            break;
        }
    }
}

//$message["test"] = registerUser($db, "user1", "password");
//$message["test"] = checkCredentials($db, "user1", "password");
//$message["test"] = loginUser($db, "user1", "password", $_SERVER['REMOTE_ADDR']);
// $cookieObject = loginUser($db, "user1", "password", $_SERVER['REMOTE_ADDR']);
// updateCookies("loginHash", $cookieObject->cookieHash, $cookieObject->expiresDateSeconds);
// $message["test"] = checkIfUserLogined($db, $_SERVER['REMOTE_ADDR'], $_COOKIE['loginHash']);

echo json_encode($message);
?>