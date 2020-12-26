<?php
include_once("./functions/loginFunctions.php");
include_once("./functions/testsFunctions.php");
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
        case "getAvailableTests":{
            if ($userStatus->logined) {
                // Если пользователь авторизован:
                $message["availableTests"] = GetAvailableTestsForUser($db, $userStatus->userId);
            } else {
                // Если пользователь не авторизован:
                $message["error"] = true;
                $message["errorText"] = "Пользователь не авторизован.";
            }
            $message["success"] = true;
            break;
        }
        case "getTestTries":{
            if ($userStatus->logined) {
                // Если пользователь авторизован:
                if (isset($_POST["form"]["testId"])){
                    // Если необходимое значение передано
                    $message["testTries"] = GetTestTries($db, $userStatus->userId, $_POST["form"]["testId"]);
                } else {
                    // Если необходимое значение не передано.
                    $message["error"] = true;
                    $message["errorText"] = "Не было передано одно из следующих значений: testId.";
                }
            } else {
                // Если пользователь не авторизован:
                $message["error"] = true;
                $message["errorText"] = "Пользователь не авторизован.";
            }
            $message["success"] = true;
            break;
        }
        case "getTestQuestions":{
            if ($userStatus->logined) {
                // Если пользователь авторизован:
                if (isset($_POST["form"]["testId"])){
                    // Если необходимое значение передано
                    // Проверяем, доступен ли этот тест пользователю:
                    if (IsTestAvailableForUser($db, $_POST["form"]["testId"], $userStatus->userId)){
                        if (IsTestStartedByUser($db, $_POST["form"]["testId"], $userStatus->userId)){
                            $message["questions"] = GetTestQuestions($db, $_POST["form"]["testId"]);
                            $message["answers"] = GetTestAnswers($db, $_POST["form"]["testId"]);
                        } else {
                            // Если пользователь запросил тест, который он не начал
                            $message["error"] = true;
                            $message["errorText"] = "Запрошен тест, который не был начат.";
                        }
                    } else {
                        // Если пользователь запросил тест, к которому не имеет доступа
                        $message["error"] = true;
                        $message["errorText"] = "Запрошен тест, доступ к которому запрещён.";
                    }
                } else {
                    // Если необходимое значение не передано.
                    $message["error"] = true;
                    $message["errorText"] = "Не было передано одно из следующих значений: testId.";
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