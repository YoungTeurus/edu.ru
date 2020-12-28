<?php
// Генерирует случайную строку
// useLetters - использовать при генерации буквы
// useNumbers - использовать при генерации цифры
// useSpecial - использовать при генерации спецсимволы
// При установке всех флагов в false возвращает пустую строку.
function generateCode($length=10, $useLetters = true, $useNumbers = true, $useSpecial = false) {
    $chars = "";
    if ($useLetters){
        // Если можно генерировать с буквами, добавляем их к алфавиту.
        $chars .= "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPRQSTUVWXYZ";
    }
    if ($useNumbers){
        // Если можно генерировать с числами, добавляем их к алфавиту.
        $chars .= "0123456789";
    }
    if ($useSpecial){
        // Если можно генерировать со спецсимволами, добавляем их к алфавиту.
        $chars .= "^\\$*+_@";
    }
    $code = "";
    $clen = strlen($chars) - 1;  
    if ($clen < 0){
        return "";
    }
	while (strlen($code) < $length) {
			$code .= $chars[mt_rand(0,$clen)];  
	}
	return $code;
}

// Применяет функцию htmlspecialchars для каждого элемента массива и возвращает его.
// Меняет исходный массив!
function makeArrayValuesSafe(&$array){
    if ($array == null){
        return null;
    }
    foreach(array_keys($array) as $key) {
        if (!is_string($array[$key])){
            continue;
        }
        $array[$key] = htmlspecialchars($array[$key]);
    }
    return $array;
}

// Проверяет, существует ли пользователь с логином login
// Возвращает userId, если да, или NULL, если нет.
function checkIfUserExists($db, $login){
    // Возвращает id пользователя с заданным ником и хешем пароля:
	$getUserId = $db->prepare("SELECT id FROM users WHERE login=:_login");
	$getUserId->bindParam(':_login', $_login);

    $returnValue = null;

    $_login = $login;

    if ($getUserId->execute()){
		if ($getUserId->rowCount()>0){
            $result = $getUserId->fetch();
            $returnValue = $result['id'];
        }
    }

    $getUserId = null;
    return $returnValue;
}

// Проверяет, является ли пользователь с IP-адресом userIp залогинненным с помощью куков loginHash.
// db - база данных для проверки.
// Если loginHash == null, logined всегда равен false.
// Если пользователь залогинен и updateExpireTime == true, то продлевает время жизней куков (используя setcookie).
// Возвращает объект с полями:
// logined - Является ли пользователь залогиненным?
// cookiesExpired - Закончился срок жизни куков? (всегда false при logined = true)
// cookiesNotFound - Куки не были найдены? (всегда false при logined = true)
// userId - Идентификатор зашедшего пользователя (всегда null при logined = false)
function checkIfUserLogined($db, $userIp, $loginHash, $updateExpireTime = true){
    $returnObject = new stdClass();

    // Возвращает id пользователя, ник пользователя и дату окончания "сессии" для пользователя с заданным хешем входа и IP-адресом:
	$getLoginnedUserId = $db->prepare("SELECT userId, expires FROM userscookies JOIN users u ON userscookies.userId = u.id AND hash=:loginHash AND userIp = INET_ATON(:userIp)");
	$getLoginnedUserId->bindParam(':loginHash', $_loginHash);
    $getLoginnedUserId->bindParam(':userIp', $_userIp);
    // Изменяет дату истечения действия куков определённого пользователя:
	$updateCookieExpires = $db->prepare("UPDATE userscookies SET expires = :newExpires WHERE userId = :userId;");
	$updateCookieExpires->bindParam(':newExpires', $newExpires);
	$updateCookieExpires->bindParam(':userId', $userId);

    $returnObject->logined = false;  // Успешный вход пользователя?
    $returnObject->cookiesExpired = false;  // Закончился срок жизни куков?
    $returnObject->cookiesNotFound = false;  // Куки не были найдены?
    $returnObject->userId = null;  // Идентификатор зашедшего пользователя
    // Проверка залогиненного пользователя:
    $_loginHash = $loginHash;
    $_userIp = $userIp;
    if ($_loginHash){
        if ($getLoginnedUserId->execute()){
            if ($getLoginnedUserId->rowCount()>0){
                $result = $getLoginnedUserId->fetch();
                $userId = $returnObject->userId = $result['userId'];
    
                if (strtotime($result['expires']) < time()){
                    // Если срок жизни куков истёк, удаляем запись о них и сообщаем пользователю о необходимости залогиниться ещё раз
                    // $removeHash = $_COOKIE["loginHash"];
                    // $removeLoginnedUser->execute();
                    $returnObject->cookiesExpired = true;
                }
                else{
                    // Если куки действительны, и пользователь уже вошёл на сайт
                    $returnObject->logined = true;
                    
                    if ($updateExpireTime){
                        // Продляем срок жизни куков:
                        $newExpiresDateSeconds = time() + 60*60*24; // Дата окончания действия куков в секундах
                        $newExpires = date("Y-m-d H:i:s", $newExpiresDateSeconds); // Дата окончания действия куков в формате DateTime
                        $updateCookieExpires->execute();
                        setcookie("loginHash", $_COOKIE["loginHash"], $newExpiresDateSeconds, "/", null, null, true);
                    }
                }
            }
            else{
                $returnObject->cookiesNotFound = true;
            }
        }
    }

    $updateCookieExpires = null;
    $getLoginnedUserId = null;
    return $returnObject;
}

// Проверяет, является ли пара логин-пароль верной.
// Возвращает id пользователя, если такая комбинация есть в БД, иначе - null.
function checkCredentials($db, $login, $password){
    // Возвращает id пользователя с заданным ником и хешем пароля:
	$getUserId = $db->prepare("SELECT id FROM users WHERE login=:_login AND passwordHash = :passwordHash");
	$getUserId->bindParam(':_login', $_login);
    $getUserId->bindParam(':passwordHash', $passwordHash);

    $_userId = null; // Флаг правильности учётных данных
    
    $_login = $login;
    $passwordHash = md5($password);

    if ($getUserId->execute()){
		if ($getUserId->rowCount()>0){
            $result = $getUserId->fetch();
			// Если нашли совпадение логина/пароля
			$_userId = $result['id'];
		}
	}

    $getUserId = null;
    return $_userId;
}

// Осуществляет процедуру входа пользователя по паре логин-пароль, проверяя пару на правильность,
// а также занося куки в базу данных.
// Возвращает объект с двумя полями: cookieHash (хеш куков) и expiresDateSeconds (дата окончания действия куков в секундах).
// Если переданная пара логин-пароль была неверной, возвращает null.
function loginUser($db, $login, $password, $userIp){
    // Добавляет строку в таблицу "userscookies":
	$writeUserCookie = $db->prepare("INSERT INTO userscookies (userId, hash, userIp, expires) VALUES (:userId, :randHash, INET_ATON(:userIp), :expiresDate)");
	$writeUserCookie->bindParam(':userId', $userId);
	$writeUserCookie->bindParam(':randHash', $cookieHash);  
	$writeUserCookie->bindParam(':userIp', $_userIp);
    $writeUserCookie->bindParam(':expiresDate', $expiresDate);
    
    $returnObject = null;

    $userId = checkCredentials($db, $login, $password);
    if ($userId){
        $returnObject = new stdClass();
        $cookieHash = $returnObject->cookieHash = md5(generateCode(10));
        $returnObject->expiresDateSeconds = time() + 60*60*24;  // Дата окончания действия куков в секундах
        $_userIp = $userIp;
        // Записываем куки в БД:
        $expiresDate = date("Y-m-d H:i:s", $returnObject->expiresDateSeconds); // Дата окончания действия куков в формате DateTime
        $writeUserCookie->execute();
    }

    $writeUserCookie = null;

    return $returnObject;
}

// Удаляет из БД все куки определённого пользователя, тем самым принудительно осуществляя выход из аккаунта на всех его устройствах.
// Возвращает true, если операция успешно выполнена, иначе - false.
function removeAllUserCookies($db, $userId){
    $removeUserCookie = $db->prepare("DELETE FROM userscookies WHERE userId = :userId;");
    $removeUserCookie->bindParam(':userId', $_userId);

    $_userId = $userId;

    if($removeUserCookie->execute()){
        return true;
    }

    $removeUserCookie = null;

    return false;
}

// Удаляет из БД определённый куки по определённому IP-адресу, осуществляя выход из аккаунта на одном устройстве.
// Проверка на IP-адрес необходима, чтобы не позволять выходить из аккаунта при перехвате куков.
// Возвращает true, если выход был совершён успешно, инчае - false.
function removeUserCookie($db, $cookieHash, $userIp){
    // Подготовленные запросы:
	// Удаляет строку из таблицы "userscookies":
	$removeUserCookie = $db->prepare("DELETE FROM userscookies WHERE hash=:logoutHash AND userIp = INET_ATON(:userIp);");
	$removeUserCookie->bindParam(':logoutHash', $logoutHash);
    $removeUserCookie->bindParam(':userIp', $_userIp);
    
    $logoutHash = $cookieHash;
    $_userIp = $userIp;
    if (!$removeUserCookie->execute()){
        return false;
    }

    $removeUserCookie = null;
    return true;
}

// Осуществляет процедуру регистрации пользователя по паре логин-пароль.
// Зарегестрироваться невозможно, если пользователь с таким ником уже создан.
// Возвращает объект с полями:
//  completed (true/false в зависимости от успешности регистрации),
//  errorText (текст ошибки, если есть),
//  errorObject (к какому элементу относится ошибка),
//  userId (идентификатор зарегистрированного пользователя или NULL при ошибке).
function registerUser($db, $login, $password){
    // Добавляет строку в таблицу "users":
    $addUser = $db->prepare("CALL RegisterUser(:_login, :password_hash)");
    $addUser->bindParam(':_login', $_login);
    $addUser->bindParam(':password_hash', $passwordHash);

    $returnObject = new stdClass();
    $returnObject->completed = false;
    $returnObject->errorText = "Неизвестная ошибка.";
    $returnObject->userId = null;
    // Проверяем, есть ли пользователь с таким же ником:
    if (checkIfUserExists($db, $login)){
        $returnObject->errorObject = "login";
        $returnObject->errorText = "Пользователь с таким ником уже зарегистрирован.";
    }
    else{
        $_login = htmlspecialchars($login);
        $passwordHash = md5(htmlspecialchars($password));

        if ($addUser->execute()){
            if ($addUser->rowCount()>0){
                $result = $addUser->fetch();
                $returnObject->userId = $result['id'];
                $returnObject->completed = true;
            }
        } else {
            $returnObject->err = $db->errorInfo();
            $returnObject->err1 = $_login;
            $returnObject->err2 = $passwordHash;
            $returnObject->err3 = $addUser;
        }
    }

    return $returnObject;
}

// Записывает куки с ключом cookieKey и значением value в браузер клиента.
// Куки действуют до даты expiresSeconds выраженной в количестве секунд.
// Куки действуют на всех страницах сайта и их невозможно вызвать в JS.
function updateCookies($cookieKey, $value, $expiresSeconds){
    setcookie($cookieKey, $value, $expiresSeconds, "/", null, null, true);
}

// Стирает указанные куки из браузера при следующей перезагрузке страницы
function removeCookieFromBrowser($cookieKey){
    setcookie($cookieKey, '', time() - 3600, '/');
}

?>