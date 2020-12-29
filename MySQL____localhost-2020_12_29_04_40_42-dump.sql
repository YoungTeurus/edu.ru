-- MySQL dump 10.13  Distrib 5.5.25a, for Win64 (x86)
--
-- Host: 127.0.0.1    Database: edudb
-- ------------------------------------------------------
-- Server version	5.5.25

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES cp1251 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Temporary table structure for view `questionscount`
--

DROP TABLE IF EXISTS `questionscount`;
/*!50001 DROP VIEW IF EXISTS `questionscount`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `questionscount` (
  `testId` int(11),
  `questionsCount` bigint(21)
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `questiontypes`
--

DROP TABLE IF EXISTS `questiontypes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `questiontypes` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'РРґРµРЅС‚РёС„РёРєР°С‚РѕСЂ С‚РёРїР° РІРѕРїСЂРѕСЃР°',
  `name` varchar(64) DEFAULT NULL COMMENT 'РќР°РёРјРµРЅРѕРІР°РЅРёРµ С‚РёРїР° РІРѕРїСЂРѕСЃР°',
  `description` varchar(1024) DEFAULT NULL COMMENT 'РћРїРёСЃР°РЅРёРµ С‚РёРїР° РІРѕРїСЂРѕСЃР°',
  `hasCorrectAnswer` tinyint(1) NOT NULL DEFAULT '1' COMMENT 'РРјРµРµС‚ Р»Рё РІРѕРїСЂРѕСЃ РїСЂР°РІРёР»СЊРЅС‹Р№ РѕС‚РІРµС‚? Р’Р»РёСЏРµС‚ РЅР° Р°РІС‚Рѕ-РїСЂРѕРІРµСЂРєСѓ.',
  `hasVariants` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'РРјРµРµС‚ Р»Рё РІРѕРїСЂРѕСЃ РІР°СЂРёР°РЅС‚С‹ РѕС‚РІРµС‚Р°?',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COMMENT='РўРёРїС‹ РІРѕРїСЂРѕСЃР°';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `questiontypes`
--

LOCK TABLES `questiontypes` WRITE;
/*!40000 ALTER TABLE `questiontypes` DISABLE KEYS */;
INSERT INTO `questiontypes` VALUES (1,'Выбор ответа','Вопрос, на который есть один или несколько правильных ответов. Ответ вводится с помощью radiobutton.',1,1),(2,'Ручной ввод ответа','Вопрос, на который есть один или несколько правильных ответов. Ответ вводится с помощью textbox.',1,0),(3,'Свободный ответ','Вопрос, на которого нет правильного ответа. Проверяется преподавателем.',0,0);
/*!40000 ALTER TABLE `questiontypes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `studentsgroups`
--

DROP TABLE IF EXISTS `studentsgroups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `studentsgroups` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(128) NOT NULL COMMENT 'РќР°РёРјРµРЅРѕРІР°РЅРёРµ РіСЂСѓРїРїС‹',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COMMENT='Р“СЂСѓРїРїС‹, Рє РєРѕС‚РѕС‹СЂРј РјРѕРіСѓС‚ РѕС‚РЅРѕСЃРёС‚СЃСЏ СЃС‚СѓРґРµРЅС‚С‹';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `studentsgroups`
--

LOCK TABLES `studentsgroups` WRITE;
/*!40000 ALTER TABLE `studentsgroups` DISABLE KEYS */;
INSERT INTO `studentsgroups` VALUES (1,'Общая'),(2,'18-ИВТ-1'),(3,'18-ПРИ'),(4,'Преподавтели');
/*!40000 ALTER TABLE `studentsgroups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `testquestions`
--

DROP TABLE IF EXISTS `testquestions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `testquestions` (
  `testId` int(11) NOT NULL COMMENT 'РРґРµРЅС‚РёС„РёРєР°С‚РѕСЂ С‚РµСЃС‚Р°, Рє РєРѕС‚РѕСЂРѕРјСѓ РѕС‚РЅРѕСЃРёС‚СЃСЏ РІРѕРїСЂРѕСЃ',
  `id` int(11) NOT NULL COMMENT 'РРґРµРЅС‚РёС„РёРєР°С‚РѕСЂ РІРѕРїСЂРѕСЃР°',
  `text` varchar(1024) NOT NULL DEFAULT 'РџСЂРёРјРµСЂ РІРѕРїСЂРѕСЃР°' COMMENT 'РўРµРєСЃС‚ РІРѕРїСЂРѕСЃР°',
  `questionType` int(11) NOT NULL COMMENT 'РўРёРї РІРѕРїСЂРѕСЃР°',
  PRIMARY KEY (`testId`,`id`),
  KEY `testQuestions_questiontypes_id_fk` (`questionType`),
  CONSTRAINT `testQuestions_questiontypes_id_fk` FOREIGN KEY (`questionType`) REFERENCES `questiontypes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `testquestions_tests_id_fk` FOREIGN KEY (`testId`) REFERENCES `tests` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `testquestions`
--

LOCK TABLES `testquestions` WRITE;
/*!40000 ALTER TABLE `testquestions` DISABLE KEYS */;
INSERT INTO `testquestions` VALUES (1,1,'Сколько будет 2 + 2',1),(1,2,'Вычислите: 10 - 5',2),(1,3,'Что для вас самое сложное в математике?',3),(3,1,'Кто кладёт подарки под ёлку?',1),(3,2,'Что ставят в квартиру на Новый год?',1),(3,3,'Почему Вам нравится Новый Год?',3),(8,1,'Тестовый вопрос 3',3),(8,2,'Новый вопрос',1),(18,1,'На кого вы учитесь?',1),(18,2,'Что выведет следующий код: \'console.log(a)\'',1),(18,3,'Назовите язык программирования, который вы проходили в школе',2),(18,4,'Какое из следующих утверждений верно?',1),(19,1,'Какой-то вопрос',1),(19,2,'Какой-то вопрос 2',2);
/*!40000 ALTER TABLE `testquestions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tests`
--

DROP TABLE IF EXISTS `tests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tests` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'РРґРµРЅС‚РёС„РёРєР°С‚РѕСЂ С‚РµСЃС‚Р°',
  `name` varchar(256) NOT NULL COMMENT 'РќР°РёРјРµРЅРѕРІР°РЅРёРµ С‚РµСЃС‚Р°',
  `creationDatetime` datetime NOT NULL COMMENT 'Р”Р°С‚Р° Рё РІСЂРµРјСЏ СЃРѕР·РґР°РЅРёСЏ С‚РµСЃС‚Р°',
  `openDatetime` datetime DEFAULT NULL COMMENT 'Р”Р°С‚Р° Рё РІСЂРµРјСЏ РѕС‚РєСЂС‹С‚РёСЏ С‚РµСЃС‚Р°',
  `closeDatetime` datetime DEFAULT NULL COMMENT 'Р”Р°С‚Р° Рё РІСЂРµРјСЏ Р·Р°РєСЂС‹С‚РёСЏ С‚РµСЃС‚Р°',
  `maxTries` int(11) NOT NULL DEFAULT '1' COMMENT 'РњР°РєСЃРёРјР°Р»СЊРЅРѕРµ РєРѕР»РёС‡РµСЃС‚РІРѕ РїРѕРїС‹С‚РѕРє РїСЂРѕС…РѕР¶РґРµРЅРёСЏ С‚РµСЃС‚Р°',
  `timeToComplete` time DEFAULT NULL COMMENT 'Р’СЂРµРјСЏ, РґР°РІР°РµРјРѕРµ РЅР° РїСЂРѕС…РѕР¶РґРµРЅРёРµ С‚РµСЃС‚Р°',
  `locked` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8 COMMENT='РўРµСЃС‚С‹';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tests`
--

LOCK TABLES `tests` WRITE;
/*!40000 ALTER TABLE `tests` DISABLE KEYS */;
INSERT INTO `tests` VALUES (1,'Тестовый тест','2020-12-22 14:19:17',NULL,'2020-12-25 18:01:55',1,NULL,0),(2,'Тест \"программная инженерия\"','2020-12-25 22:04:53',NULL,NULL,1,NULL,0),(3,'Тест про Новый Год','2020-12-25 23:33:53',NULL,'2020-12-31 18:01:41',-1,NULL,0),(7,'Новогодний тест','2020-12-26 17:42:13','2021-01-01 00:00:00',NULL,1,NULL,0),(8,'Закрытый тест','2020-12-22 14:19:17',NULL,NULL,1,NULL,1),(18,'Тест для ИВТ','2020-12-22 14:19:17',NULL,'2020-12-31 23:59:00',1,NULL,0),(19,'Какой-то тест','2020-12-22 14:19:17','2020-12-20 18:57:00','2021-01-01 18:57:00',1,NULL,0);
/*!40000 ALTER TABLE `tests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `testsanswers`
--

DROP TABLE IF EXISTS `testsanswers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `testsanswers` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'РРґРµРЅС‚РёС„РёРєР°С‚РѕСЂ РѕС‚РІРµС‚Р°',
  `testId` int(11) NOT NULL COMMENT 'РРґРµРЅС‚РёС„РёРєР°С‚РѕСЂ С‚РµСЃС‚Р°',
  `questionId` int(11) NOT NULL COMMENT 'РРґРµРЅС‚РёС„РёРєР°С‚РѕСЂ РІРѕРїСЂРѕСЃР°',
  `answer` varchar(1024) NOT NULL DEFAULT '' COMMENT 'РЎРѕР±СЃС‚РІРµРЅРЅРѕ РѕС‚РІРµС‚.',
  `correct` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'РЇРІР»СЏРµС‚СЃСЏ Р»Рё РѕС‚РІРµС‚ РїСЂР°РІРёР»СЊРЅС‹Рј',
  PRIMARY KEY (`id`),
  KEY `testanswers2_testquestions_testId_id_fk` (`testId`,`questionId`),
  CONSTRAINT `testanswers2_testquestions_testId_id_fk` FOREIGN KEY (`testId`, `questionId`) REFERENCES `testquestions` (`testId`, `id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8 COMMENT='Р’Р°СЂРёР°РЅС‚С‹ РѕС‚РІРµС‚РѕРІ Рё РїСЂР°РІРёР»СЊРЅС‹Рµ РѕС‚РІРµС‚С‹';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `testsanswers`
--

LOCK TABLES `testsanswers` WRITE;
/*!40000 ALTER TABLE `testsanswers` DISABLE KEYS */;
INSERT INTO `testsanswers` VALUES (1,1,1,'4',1),(2,1,1,'5',0),(3,1,1,'-4',0),(4,1,2,'5',1),(5,3,1,'Дед Мороз',1),(6,3,1,'Мой папа',0),(7,3,2,'Ёлку',1),(8,3,2,'Кактус',0),(12,1,1,'3',0),(19,8,2,'3',1),(20,18,1,'Программиста',1),(21,18,1,'Инженера',0),(22,18,1,'Крутого чувака в очках',0),(23,18,2,'\"a\"',0),(24,18,2,'Error: Переменная \'a\' не определена.',1),(25,18,3,'Pascal',1),(26,18,3,'Паскаль',1),(27,18,3,'Pascal.ABC',1),(28,18,4,'Питон - лучший язык программирования?',0),(29,18,4,'Java - лучший язык программирования',0),(30,18,4,'C - лучший язык программирования',0),(31,18,4,'Каждый язык хорош в своей сфере применения',1),(32,19,1,'Ответ 1',1),(33,19,1,'Ответ 2',0),(34,19,1,'Ответ 3',0),(35,19,1,'Ответ 4',0),(36,19,2,'Ответ',1);
/*!40000 ALTER TABLE `testsanswers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary table structure for view `testsavaliabletouser`
--

DROP TABLE IF EXISTS `testsavaliabletouser`;
/*!50001 DROP VIEW IF EXISTS `testsavaliabletouser`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `testsavaliabletouser` (
  `userId` int(11),
  `testId` int(11),
  `name` varchar(256),
  `creationDatetime` datetime,
  `openDatetime` datetime,
  `closeDatetime` datetime,
  `maxTries` int(11),
  `timeToComplete` time,
  `usedTries` bigint(11),
  `isCompleted` bigint(11),
  `inProgress` int(1)
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `testsresults`
--

DROP TABLE IF EXISTS `testsresults`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `testsresults` (
  `userId` int(11) NOT NULL COMMENT 'РРґРµРЅС‚РёС„РёРєР°С‚РѕСЂ РїРѕР»СЊР·РѕРІР°С‚РµР»СЏ',
  `testId` int(11) NOT NULL COMMENT 'РРґРµРЅС‚РёС„РёРєР°С‚РѕСЂ С‚РµСЃС‚Р°',
  `try` int(11) NOT NULL DEFAULT '0' COMMENT 'РџРѕРїС‹С‚РєР° РїРѕР»СЊР·РѕРІР°С‚РµР»СЏ РїСЂРѕР№С‚Рё С‚РµСЃС‚',
  `finished` int(11) DEFAULT NULL COMMENT 'Р—Р°РІРµСЂС€РµРЅР° Р»Рё РїРѕРїС‹С‚РєР°?',
  `score` float DEFAULT NULL COMMENT 'РћС†РµРЅРєР° РїРѕР»СЊР·РѕРІР°С‚РµР»СЏ',
  `startedDatetime` datetime NOT NULL COMMENT 'Р”Р°С‚Р° Рё РІСЂРµРјСЏ РЅР°С‡Р°Р»Р° СЃРґР°С‡Рё',
  `needsReview` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'РўСЂРµР±СѓРµС‚СЃСЏ Р»Рё СЂРµР·СѓР»СЊС‚Р°С‚Сѓ РїСЂРѕСЃРјРѕС‚СЂ РїСЂРµРїРѕРґР°РІР°С‚РµР»РµРј РґР»СЏ РІС‹СЃС‚Р°РІР»РµРЅРёСЏ РѕС†РµРЅРєРё (РІС‹СЃС‚Р°РІР»СЏРµС‚СЃСЏ РїСЂРё РЅР°Р»РёС‡РёРё РІРѕРїСЂРѕСЃРѕРІ СЃРѕ СЃРІРѕР±РѕРґРЅС‹Рј РѕС‚РІРµС‚РѕРј).',
  PRIMARY KEY (`userId`,`testId`,`try`),
  KEY `testsresults_tests_id_fk` (`testId`),
  CONSTRAINT `testsresults_tests_id_fk` FOREIGN KEY (`testId`) REFERENCES `tests` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `testsresults_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Р РµР·СѓР»СЊС‚Р°С‚С‹ С‚РµСЃС‚РѕРІ';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `testsresults`
--

LOCK TABLES `testsresults` WRITE;
/*!40000 ALTER TABLE `testsresults` DISABLE KEYS */;
INSERT INTO `testsresults` VALUES (7,1,1,1,0.333333,'2020-12-22 14:09:54',0),(7,3,1,1,0.666667,'2020-12-26 01:55:05',0),(7,3,2,1,1,'2020-12-27 13:12:02',0),(7,18,1,1,1,'2020-12-28 18:02:13',0),(7,19,1,1,0.5,'2020-12-28 18:59:51',0),(11,1,1,0,NULL,'2020-12-25 23:32:35',0);
/*!40000 ALTER TABLE `testsresults` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `testsstudentsgroups`
--

DROP TABLE IF EXISTS `testsstudentsgroups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `testsstudentsgroups` (
  `testId` int(11) NOT NULL,
  `studentgroupId` int(11) NOT NULL,
  PRIMARY KEY (`testId`,`studentgroupId`),
  KEY `testsstudentsgroups_studentsgroups_id_fk` (`studentgroupId`),
  CONSTRAINT `testsstudentsgroups_studentsgroups_id_fk` FOREIGN KEY (`studentgroupId`) REFERENCES `studentsgroups` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `testsstudentsgroups___fk` FOREIGN KEY (`testId`) REFERENCES `tests` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='РўР°Р±Р»РёС†Р° "С‚РµСЃС‚С‹ - СЃС‚СѓРґРµРЅС‡РµСЃРєРёРµ РіСЂСѓРїРїС‹, РєРѕС‚РѕСЂС‹Рј РґРѕСЃС‚СѓРїРЅРѕ РёС… РїСЂРѕС…РѕР¶РґРµРЅРёРµ".';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `testsstudentsgroups`
--

LOCK TABLES `testsstudentsgroups` WRITE;
/*!40000 ALTER TABLE `testsstudentsgroups` DISABLE KEYS */;
INSERT INTO `testsstudentsgroups` VALUES (1,1),(3,1),(7,1),(8,1),(18,2),(19,2),(2,3);
/*!40000 ALTER TABLE `testsstudentsgroups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `testsusersanswers`
--

DROP TABLE IF EXISTS `testsusersanswers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `testsusersanswers` (
  `testId` int(11) NOT NULL COMMENT 'РРґРµРЅС‚РёС„РёРєР°С‚РѕСЂ С‚РµСЃС‚Р°',
  `questionId` int(11) NOT NULL COMMENT 'РРґРµРЅС‚РёС„РёРєР°С‚РѕСЂ РІРѕРїСЂРѕСЃР°',
  `try` int(11) NOT NULL COMMENT 'РџРѕРїС‹С‚РєР° РїРѕР»СЊР·РѕРІР°С‚РµР»СЏ',
  `userId` int(11) NOT NULL COMMENT 'РРґРµРЅС‚РёС„РёРєР°С‚РѕСЂ РїРѕР»СЊР·РѕРІР°С‚РµР»СЏ',
  `datetime` datetime NOT NULL,
  `answer` varchar(1024) NOT NULL,
  `correct` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'РџСЂР°РІРёР»СЊРЅРѕСЃС‚СЊ РѕС‚РІРµС‚Р° РЅР° РІРѕРїСЂРѕСЃ. РћС‚РјРµС‡Р°РµС‚СЃСЏ Р°РІС‚РѕРјР°С‚РёС‡РµСЃРєРё, Р»РёР±Рѕ РїСЂРµРїРѕРґР°РІР°С‚РµР»РµРј.',
  PRIMARY KEY (`testId`,`questionId`,`try`,`userId`),
  KEY `testsusersanswers_users_id_fk` (`userId`),
  KEY `testsusersanswers_testsresults_testId_userId_try_fk` (`testId`,`userId`,`try`),
  CONSTRAINT `testsusersanswers_testquestions_testId_id_fk` FOREIGN KEY (`testId`, `questionId`) REFERENCES `testquestions` (`testId`, `id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `testsusersanswers_testsresults_testId_userId_try_fk` FOREIGN KEY (`testId`, `userId`, `try`) REFERENCES `testsresults` (`testId`, `userId`, `try`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='РћС‚РІРµС‚С‹ РїРѕР»СЊР·РѕРІР°С‚РµР»РµР№ РЅР° РІРѕРїСЂРѕСЃС‹';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `testsusersanswers`
--

LOCK TABLES `testsusersanswers` WRITE;
/*!40000 ALTER TABLE `testsusersanswers` DISABLE KEYS */;
INSERT INTO `testsusersanswers` VALUES (1,1,1,7,'2020-12-26 01:18:22','4',1),(1,2,1,7,'2020-12-26 01:19:35','-5',0),(1,3,1,7,'2020-12-22 15:00:45','Я гуманитарий',0),(3,1,1,7,'2020-12-26 01:55:27','4',1),(3,1,2,7,'2020-12-27 13:12:15','Дед Мороз',1),(3,2,1,7,'2020-12-26 01:55:37','9',1),(3,2,2,7,'2020-12-27 13:12:15','Ёлку',1),(3,3,1,7,'2020-12-26 01:55:45','21',0),(3,3,2,7,'2020-12-27 13:12:15','Он крутой!',1),(18,1,1,7,'2020-12-28 18:02:29','Программиста',1),(18,2,1,7,'2020-12-28 18:02:29','Error: Переменная \'a\' не определена.',1),(18,3,1,7,'2020-12-28 18:02:29','Паскаль',1),(18,4,1,7,'2020-12-28 18:02:29','Каждый язык хорош в своей сфере применения',1),(19,1,1,7,'2020-12-28 19:00:05','Ответ 2',0),(19,2,1,7,'2020-12-28 19:00:05','Ответ',1);
/*!40000 ALTER TABLE `testsusersanswers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'РРґРµРЅС‚РёС„РёРєР°С‚РѕСЂ РїРѕР»СЊР·РѕРІР°С‚РµР»СЏ',
  `login` varchar(64) NOT NULL COMMENT 'Р›РѕРіРёРЅ РїРѕР»СЊР·РѕРІР°С‚РµР»СЏ',
  `passwordHash` varbinary(256) DEFAULT NULL COMMENT 'РҐРµС€ РїР°СЂРѕР»СЏ РїРѕР»СЊР·РѕРІР°С‚РµР»СЏ',
  `groupId` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_login_uindex` (`login`),
  KEY `users_usersgroups_id_fk` (`groupId`),
  CONSTRAINT `users_usersgroups_id_fk` FOREIGN KEY (`groupId`) REFERENCES `usersgroups` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (7,'user1','5f4dcc3b5aa765d61d8327deb882cf99',4),(11,'pri','e060bb629c10e1b143614cc1e9ccdc67',1);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER ActionsAfterInsert
    AFTER INSERT
    ON users
    FOR EACH ROW
    BEGIN
        -- Р”РѕР±Р°РІР»СЏРµРј РґР»СЏ РїРѕР»СЊР·РѕРІР°С‚РµР»СЏ СЃС‚СЂРѕРєСѓ РІ С‚Р°Р±Р»РёС†Рµ СЃ РґР°РЅРЅС‹РјРё РїРѕР»СЊР·РѕРІР°С‚РµР»СЏ
        INSERT INTO usersinfo(userId) VALUES (NEW.id);
        -- Р’РЅРѕСЃРёРј РїРѕР»СЊР·РѕРІР°С‚РµР»СЏ РІ СЃС‚Р°РЅРґР°СЂС‚РЅСѓСЋ РѕР±С‰СѓСЋ РіСЂСѓРїРїСѓ:
        INSERT INTO usersstudentsgroups(userId, studentgroupId) VALUE (NEW.id, 1);
    END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `userscookies`
--

DROP TABLE IF EXISTS `userscookies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `userscookies` (
  `userId` int(11) NOT NULL COMMENT 'РРґРµРЅС‚РёС„РёРєР°С‚РѕСЂ РїРѕР»СЊР·РѕРІР°С‚РµР»СЏ',
  `hash` varbinary(256) NOT NULL COMMENT 'РҐРµС€, СЃРѕС…СЂР°РЅС‘РЅРЅС‹Р№ РІ РєСѓРєР°С… РґР»СЏ РїСЂРѕРІРµСЂРєРё',
  `expires` datetime NOT NULL COMMENT 'Р”Р°С‚Р° Рё РІСЂРµРјСЏ РёСЃС‚РµС‡РµРЅРёСЏ РІСЂРµРјРµРЅРё РґРµР№СЃС‚РІРёСЏ РєСѓРєРѕРІ',
  `userIp` int(10) NOT NULL COMMENT 'IP-Р°РґСЂРµСЃ РїРѕР»СЊР·РѕРІР°С‚РµР»СЏ',
  KEY `usersCookies_users_id_fk` (`userId`),
  CONSTRAINT `usersCookies_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='РљСѓРєРё РїРѕР»СЊР·РѕРІР°С‚РµР»РµР№';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userscookies`
--

LOCK TABLES `userscookies` WRITE;
/*!40000 ALTER TABLE `userscookies` DISABLE KEYS */;
INSERT INTO `userscookies` VALUES (7,'7ccc1f2db4e49fc9818126c4dac47db5','2020-12-30 05:31:15',2130706433);
/*!40000 ALTER TABLE `userscookies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usersgroups`
--

DROP TABLE IF EXISTS `usersgroups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `usersgroups` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'РРґРµРЅС‚РёС„РёРєР°С‚РѕСЂ РіСЂСѓРїРїС‹',
  `name` varchar(64) DEFAULT NULL COMMENT 'РќР°РёРјРµРЅРѕРІР°РЅРёРµ РіСЂСѓРїРїС‹',
  `ableToCheckTests` tinyint(1) DEFAULT '0' COMMENT 'РњРѕРіСѓС‚ Р»Рё РїРѕР»СЊР·РѕРІР°С‚РµР»Рё РїСЂРѕРІРµСЂСЏС‚СЊ С‚РµСЃС‚С‹',
  `ableToEditTests` tinyint(1) DEFAULT '0' COMMENT 'РњРѕРіСѓС‚ Р»Рё РїРѕР»СЊР·РѕРІР°С‚РµР»Рё СЃРѕР·РґР°РІР°С‚СЊ С‚РµСЃС‚С‹',
  `ableToChangeUsersStudentGroup` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COMMENT='Р“СЂСѓРїРїС‹ РїРѕР»СЊР·РѕРІР°С‚РµР»РµР№';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usersgroups`
--

LOCK TABLES `usersgroups` WRITE;
/*!40000 ALTER TABLE `usersgroups` DISABLE KEYS */;
INSERT INTO `usersgroups` VALUES (1,'Ученик',0,0,0),(2,'Младший преподаватель',1,0,0),(3,'Преподаватель',1,1,0),(4,'Администратор',1,1,1);
/*!40000 ALTER TABLE `usersgroups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usersinfo`
--

DROP TABLE IF EXISTS `usersinfo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `usersinfo` (
  `userId` int(11) DEFAULT NULL COMMENT 'РРґРµРЅС‚РёС„РёРєР°С‚РѕСЂ РїРѕР»СЊР·РѕРІР°С‚РµР»СЏ',
  `firstName` varchar(64) DEFAULT NULL COMMENT 'РРјСЏ РїРѕР»СЊР·РѕРІР°С‚РµР»СЏ',
  `surname` varchar(64) DEFAULT NULL COMMENT 'Р¤Р°РјРёР»РёСЏ РїРѕР»СЊР·РѕРІР°С‚РµР»СЏ',
  `secondName` varchar(64) DEFAULT NULL COMMENT 'РћС‚С‡РµСЃС‚РІРѕ РїРѕР»СЊР·РѕРІР°С‚РµР»СЏ',
  `email` varchar(128) DEFAULT NULL COMMENT 'Р­Р»РµРєС‚СЂРѕРЅРЅР°СЏ РїРѕС‡С‚Р° РїРѕР»СЊР·РѕРІР°С‚РµР»СЏ',
  KEY `usersInfo_users_id_fk` (`userId`),
  CONSTRAINT `usersInfo_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Р›РёС‡РЅР°СЏ РёРЅС„РѕСЂРјР°С†РёСЏ РїРѕР»СЊР·РѕРІР°С‚РµР»РµР№';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usersinfo`
--

LOCK TABLES `usersinfo` WRITE;
/*!40000 ALTER TABLE `usersinfo` DISABLE KEYS */;
INSERT INTO `usersinfo` VALUES (7,'Юзер','Пользователь','Юзеревич','user@usermail.us'),(11,'Пришник','Пришников','Пришникович',NULL);
/*!40000 ALTER TABLE `usersinfo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usersstudentsgroups`
--

DROP TABLE IF EXISTS `usersstudentsgroups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `usersstudentsgroups` (
  `userId` int(11) NOT NULL DEFAULT '0' COMMENT 'РРґРµРЅС‚РёС„РёРєР°С‚РѕСЂ РїРѕР»СЊР·РѕРІР°С‚РµР»СЏ',
  `studentgroupId` int(11) NOT NULL DEFAULT '0' COMMENT 'РРґРµРЅС‚РёС„РёРєР°С‚РѕСЂ СЃС‚СѓРґРµРЅС‡РµСЃРєРѕР№ РіСЂСѓРїРїС‹',
  PRIMARY KEY (`userId`,`studentgroupId`),
  KEY `usersstudentsgroups_studentsgroups_id_fk` (`studentgroupId`),
  CONSTRAINT `usersstudentsgroups_studentsgroups_id_fk` FOREIGN KEY (`studentgroupId`) REFERENCES `studentsgroups` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `usersstudentsgroups_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='РўР°Р±Р»РёС†Р° "РїРѕР»СЊР·РѕРІР°С‚РµР»Рё - СЃС‚СѓРґРµРЅС‡РµСЃРєРёРµ РіСЂСѓРїРїС‹, Рє РєРѕС‚РѕСЂС‹Рј РѕРЅРё РѕС‚РЅРѕСЃС‚СЏСЃСЏ".';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usersstudentsgroups`
--

LOCK TABLES `usersstudentsgroups` WRITE;
/*!40000 ALTER TABLE `usersstudentsgroups` DISABLE KEYS */;
INSERT INTO `usersstudentsgroups` VALUES (7,1),(11,1),(7,2),(11,3);
/*!40000 ALTER TABLE `usersstudentsgroups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary table structure for view `usersteststries`
--

DROP TABLE IF EXISTS `usersteststries`;
/*!50001 DROP VIEW IF EXISTS `usersteststries`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `usersteststries` (
  `userId` int(11),
  `testId` int(11),
  `testTries` bigint(21)
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Final view structure for view `questionscount`
--

/*!50001 DROP TABLE IF EXISTS `questionscount`*/;
/*!50001 DROP VIEW IF EXISTS `questionscount`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `questionscount` AS select `t`.`id` AS `testId`,count(`testquestions`.`id`) AS `questionsCount` from (`tests` `t` left join `testquestions` on((`t`.`id` = `testquestions`.`testId`))) group by `testquestions`.`testId` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `testsavaliabletouser`
--

/*!50001 DROP TABLE IF EXISTS `testsavaliabletouser`*/;
/*!50001 DROP VIEW IF EXISTS `testsavaliabletouser`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `testsavaliabletouser` AS select `u`.`userId` AS `userId`,`tests`.`id` AS `testId`,`tests`.`name` AS `name`,`tests`.`creationDatetime` AS `creationDatetime`,`tests`.`openDatetime` AS `openDatetime`,`tests`.`closeDatetime` AS `closeDatetime`,`tests`.`maxTries` AS `maxTries`,`tests`.`timeToComplete` AS `timeToComplete`,ifnull(max(`tr`.`try`),0) AS `usedTries`,ifnull(max(`tr`.`finished`),0) AS `isCompleted`,if((min(`tr`.`finished`) = 0),1,0) AS `inProgress` from ((((`tests` join `testsstudentsgroups` `t` on(((`tests`.`id` = `t`.`testId`) and (`tests`.`locked` = 0)))) join `studentsgroups` `s` on((`t`.`studentgroupId` = `s`.`id`))) join `usersstudentsgroups` `u` on((`s`.`id` = `u`.`studentgroupId`))) left join `testsresults` `tr` on(((`u`.`userId` = `tr`.`userId`) and (`tests`.`id` = `tr`.`testId`)))) group by `u`.`userId`,`tests`.`id`,`tests`.`name`,`tests`.`creationDatetime`,`tests`.`openDatetime`,`tests`.`closeDatetime`,`tests`.`maxTries`,`tests`.`timeToComplete` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `usersteststries`
--

/*!50001 DROP TABLE IF EXISTS `usersteststries`*/;
/*!50001 DROP VIEW IF EXISTS `usersteststries`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `usersteststries` AS select `testsresults`.`userId` AS `userId`,`testsresults`.`testId` AS `testId`,count(0) AS `testTries` from `testsresults` group by `testsresults`.`userId`,`testsresults`.`testId` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-12-29  4:40:43
