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
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Идентификатор типа вопроса',
  `name` varchar(64) DEFAULT NULL COMMENT 'Наименование типа вопроса',
  `description` varchar(1024) DEFAULT NULL COMMENT 'Описание типа вопроса',
  `hasCorrectAnswer` tinyint(1) NOT NULL DEFAULT '1' COMMENT 'Имеет ли вопрос правильный ответ? Влияет на авто-проверку.',
  `hasVariants` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Имеет ли вопрос варианты ответа?',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COMMENT='Типы вопроса';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `questiontypes`
--

LOCK TABLES `questiontypes` WRITE;
/*!40000 ALTER TABLE `questiontypes` DISABLE KEYS */;
INSERT INTO `questiontypes` VALUES (1,'����� ������','������, �� ������� ���� ���� ��� ��������� ���������� �������. ����� �������� � ������� radiobutton.',1,1),(2,'������ ���� ������','������, �� ������� ���� ���� ��� ��������� ���������� �������. ����� �������� � ������� textbox.',1,0),(3,'��������� �����','������, �� �������� ��� ����������� ������. ����������� ��������������.',0,0);
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
  `name` varchar(128) NOT NULL COMMENT 'Наименование группы',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COMMENT='Группы, к котоырм могут относится студенты';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `studentsgroups`
--

LOCK TABLES `studentsgroups` WRITE;
/*!40000 ALTER TABLE `studentsgroups` DISABLE KEYS */;
INSERT INTO `studentsgroups` VALUES (1,'�����'),(2,'18-���-1'),(3,'18-���'),(4,'������������');
/*!40000 ALTER TABLE `studentsgroups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `testquestions`
--

DROP TABLE IF EXISTS `testquestions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `testquestions` (
  `testId` int(11) NOT NULL COMMENT 'Идентификатор теста, к которому относится вопрос',
  `id` int(11) NOT NULL COMMENT 'Идентификатор вопроса',
  `text` varchar(1024) NOT NULL DEFAULT 'Пример вопроса' COMMENT 'Текст вопроса',
  `questionType` int(11) NOT NULL COMMENT 'Тип вопроса',
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
INSERT INTO `testquestions` VALUES (1,1,'������� ����� 2 + 2',1),(1,2,'���������: 10 - 5',2),(1,3,'��� ��� ��� ����� ������� � ����������?',3),(3,1,'��� ����� ������� ��� ����?',1),(3,2,'��� ������ � �������� �� ����� ���?',1),(3,3,'������ ��� �������� ����� ���?',3),(8,1,'�������� ������ 3',3),(8,2,'����� ������',1),(18,1,'�� ���� �� �������?',1),(18,2,'��� ������� ��������� ���: \'console.log(a)\'',1),(18,3,'�������� ���� ����������������, ������� �� ��������� � �����',2),(18,4,'����� �� ��������� ����������� �����?',1),(19,1,'�����-�� ������',1),(19,2,'�����-�� ������ 2',2);
/*!40000 ALTER TABLE `testquestions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tests`
--

DROP TABLE IF EXISTS `tests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tests` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Идентификатор теста',
  `name` varchar(256) NOT NULL COMMENT 'Наименование теста',
  `creationDatetime` datetime NOT NULL COMMENT 'Дата и время создания теста',
  `openDatetime` datetime DEFAULT NULL COMMENT 'Дата и время открытия теста',
  `closeDatetime` datetime DEFAULT NULL COMMENT 'Дата и время закрытия теста',
  `maxTries` int(11) NOT NULL DEFAULT '1' COMMENT 'Максимальное количество попыток прохождения теста',
  `timeToComplete` time DEFAULT NULL COMMENT 'Время, даваемое на прохождение теста',
  `locked` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8 COMMENT='Тесты';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tests`
--

LOCK TABLES `tests` WRITE;
/*!40000 ALTER TABLE `tests` DISABLE KEYS */;
INSERT INTO `tests` VALUES (1,'�������� ����','2020-12-22 14:19:17',NULL,'2020-12-25 18:01:55',1,NULL,0),(2,'���� \"����������� ���������\"','2020-12-25 22:04:53',NULL,NULL,1,NULL,0),(3,'���� ��� ����� ���','2020-12-25 23:33:53',NULL,'2020-12-31 18:01:41',-1,NULL,0),(7,'���������� ����','2020-12-26 17:42:13','2021-01-01 00:00:00',NULL,1,NULL,0),(8,'�������� ����','2020-12-22 14:19:17',NULL,NULL,1,NULL,1),(18,'���� ��� ���','2020-12-22 14:19:17',NULL,'2020-12-31 23:59:00',1,NULL,0),(19,'�����-�� ����','2020-12-22 14:19:17','2020-12-20 18:57:00','2021-01-01 18:57:00',1,NULL,0);
/*!40000 ALTER TABLE `tests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `testsanswers`
--

DROP TABLE IF EXISTS `testsanswers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `testsanswers` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Идентификатор ответа',
  `testId` int(11) NOT NULL COMMENT 'Идентификатор теста',
  `questionId` int(11) NOT NULL COMMENT 'Идентификатор вопроса',
  `answer` varchar(1024) NOT NULL DEFAULT '' COMMENT 'Собственно ответ.',
  `correct` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Является ли ответ правильным',
  PRIMARY KEY (`id`),
  KEY `testanswers2_testquestions_testId_id_fk` (`testId`,`questionId`),
  CONSTRAINT `testanswers2_testquestions_testId_id_fk` FOREIGN KEY (`testId`, `questionId`) REFERENCES `testquestions` (`testId`, `id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8 COMMENT='Варианты ответов и правильные ответы';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `testsanswers`
--

LOCK TABLES `testsanswers` WRITE;
/*!40000 ALTER TABLE `testsanswers` DISABLE KEYS */;
INSERT INTO `testsanswers` VALUES (1,1,1,'4',1),(2,1,1,'5',0),(3,1,1,'-4',0),(4,1,2,'5',1),(5,3,1,'��� �����',1),(6,3,1,'��� ����',0),(7,3,2,'����',1),(8,3,2,'������',0),(12,1,1,'3',0),(19,8,2,'3',1),(20,18,1,'������������',1),(21,18,1,'��������',0),(22,18,1,'������� ������ � �����',0),(23,18,2,'\"a\"',0),(24,18,2,'Error: ���������� \'a\' �� ����������.',1),(25,18,3,'Pascal',1),(26,18,3,'�������',1),(27,18,3,'Pascal.ABC',1),(28,18,4,'����� - ������ ���� ����������������?',0),(29,18,4,'Java - ������ ���� ����������������',0),(30,18,4,'C - ������ ���� ����������������',0),(31,18,4,'������ ���� ����� � ����� ����� ����������',1),(32,19,1,'����� 1',1),(33,19,1,'����� 2',0),(34,19,1,'����� 3',0),(35,19,1,'����� 4',0),(36,19,2,'�����',1);
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
  `userId` int(11) NOT NULL COMMENT 'Идентификатор пользователя',
  `testId` int(11) NOT NULL COMMENT 'Идентификатор теста',
  `try` int(11) NOT NULL DEFAULT '0' COMMENT 'Попытка пользователя пройти тест',
  `finished` int(11) DEFAULT NULL COMMENT 'Завершена ли попытка?',
  `score` float DEFAULT NULL COMMENT 'Оценка пользователя',
  `startedDatetime` datetime NOT NULL COMMENT 'Дата и время начала сдачи',
  `needsReview` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Требуется ли результату просмотр преподавателем для выставления оценки (выставляется при наличии вопросов со свободным ответом).',
  PRIMARY KEY (`userId`,`testId`,`try`),
  KEY `testsresults_tests_id_fk` (`testId`),
  CONSTRAINT `testsresults_tests_id_fk` FOREIGN KEY (`testId`) REFERENCES `tests` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `testsresults_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Результаты тестов';
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Таблица "тесты - студенческие группы, которым доступно их прохождение".';
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
  `testId` int(11) NOT NULL COMMENT 'Идентификатор теста',
  `questionId` int(11) NOT NULL COMMENT 'Идентификатор вопроса',
  `try` int(11) NOT NULL COMMENT 'Попытка пользователя',
  `userId` int(11) NOT NULL COMMENT 'Идентификатор пользователя',
  `datetime` datetime NOT NULL,
  `answer` varchar(1024) NOT NULL,
  `correct` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Правильность ответа на вопрос. Отмечается автоматически, либо преподавателем.',
  PRIMARY KEY (`testId`,`questionId`,`try`,`userId`),
  KEY `testsusersanswers_users_id_fk` (`userId`),
  KEY `testsusersanswers_testsresults_testId_userId_try_fk` (`testId`,`userId`,`try`),
  CONSTRAINT `testsusersanswers_testquestions_testId_id_fk` FOREIGN KEY (`testId`, `questionId`) REFERENCES `testquestions` (`testId`, `id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `testsusersanswers_testsresults_testId_userId_try_fk` FOREIGN KEY (`testId`, `userId`, `try`) REFERENCES `testsresults` (`testId`, `userId`, `try`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Ответы пользователей на вопросы';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `testsusersanswers`
--

LOCK TABLES `testsusersanswers` WRITE;
/*!40000 ALTER TABLE `testsusersanswers` DISABLE KEYS */;
INSERT INTO `testsusersanswers` VALUES (1,1,1,7,'2020-12-26 01:18:22','4',1),(1,2,1,7,'2020-12-26 01:19:35','-5',0),(1,3,1,7,'2020-12-22 15:00:45','� �����������',0),(3,1,1,7,'2020-12-26 01:55:27','4',1),(3,1,2,7,'2020-12-27 13:12:15','��� �����',1),(3,2,1,7,'2020-12-26 01:55:37','9',1),(3,2,2,7,'2020-12-27 13:12:15','����',1),(3,3,1,7,'2020-12-26 01:55:45','21',0),(3,3,2,7,'2020-12-27 13:12:15','�� ������!',1),(18,1,1,7,'2020-12-28 18:02:29','������������',1),(18,2,1,7,'2020-12-28 18:02:29','Error: ���������� \'a\' �� ����������.',1),(18,3,1,7,'2020-12-28 18:02:29','�������',1),(18,4,1,7,'2020-12-28 18:02:29','������ ���� ����� � ����� ����� ����������',1),(19,1,1,7,'2020-12-28 19:00:05','����� 2',0),(19,2,1,7,'2020-12-28 19:00:05','�����',1);
/*!40000 ALTER TABLE `testsusersanswers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Идентификатор пользователя',
  `login` varchar(64) NOT NULL COMMENT 'Логин пользователя',
  `passwordHash` varbinary(256) DEFAULT NULL COMMENT 'Хеш пароля пользователя',
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
        -- Добавляем для пользователя строку в таблице с данными пользователя
        INSERT INTO usersinfo(userId) VALUES (NEW.id);
        -- Вносим пользователя в стандартную общую группу:
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
  `userId` int(11) NOT NULL COMMENT 'Идентификатор пользователя',
  `hash` varbinary(256) NOT NULL COMMENT 'Хеш, сохранённый в куках для проверки',
  `expires` datetime NOT NULL COMMENT 'Дата и время истечения времени действия куков',
  `userIp` int(10) NOT NULL COMMENT 'IP-адрес пользователя',
  KEY `usersCookies_users_id_fk` (`userId`),
  CONSTRAINT `usersCookies_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Куки пользователей';
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
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Идентификатор группы',
  `name` varchar(64) DEFAULT NULL COMMENT 'Наименование группы',
  `ableToCheckTests` tinyint(1) DEFAULT '0' COMMENT 'Могут ли пользователи проверять тесты',
  `ableToEditTests` tinyint(1) DEFAULT '0' COMMENT 'Могут ли пользователи создавать тесты',
  `ableToChangeUsersStudentGroup` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COMMENT='Группы пользователей';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usersgroups`
--

LOCK TABLES `usersgroups` WRITE;
/*!40000 ALTER TABLE `usersgroups` DISABLE KEYS */;
INSERT INTO `usersgroups` VALUES (1,'������',0,0,0),(2,'������� �������������',1,0,0),(3,'�������������',1,1,0),(4,'�������������',1,1,1);
/*!40000 ALTER TABLE `usersgroups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usersinfo`
--

DROP TABLE IF EXISTS `usersinfo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `usersinfo` (
  `userId` int(11) DEFAULT NULL COMMENT 'Идентификатор пользователя',
  `firstName` varchar(64) DEFAULT NULL COMMENT 'Имя пользователя',
  `surname` varchar(64) DEFAULT NULL COMMENT 'Фамилия пользователя',
  `secondName` varchar(64) DEFAULT NULL COMMENT 'Отчество пользователя',
  `email` varchar(128) DEFAULT NULL COMMENT 'Электронная почта пользователя',
  KEY `usersInfo_users_id_fk` (`userId`),
  CONSTRAINT `usersInfo_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Личная информация пользователей';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usersinfo`
--

LOCK TABLES `usersinfo` WRITE;
/*!40000 ALTER TABLE `usersinfo` DISABLE KEYS */;
INSERT INTO `usersinfo` VALUES (7,'����','������������','��������','user@usermail.us'),(11,'�������','���������','�����������',NULL);
/*!40000 ALTER TABLE `usersinfo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usersstudentsgroups`
--

DROP TABLE IF EXISTS `usersstudentsgroups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `usersstudentsgroups` (
  `userId` int(11) NOT NULL DEFAULT '0' COMMENT 'Идентификатор пользователя',
  `studentgroupId` int(11) NOT NULL DEFAULT '0' COMMENT 'Идентификатор студенческой группы',
  PRIMARY KEY (`userId`,`studentgroupId`),
  KEY `usersstudentsgroups_studentsgroups_id_fk` (`studentgroupId`),
  CONSTRAINT `usersstudentsgroups_studentsgroups_id_fk` FOREIGN KEY (`studentgroupId`) REFERENCES `studentsgroups` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `usersstudentsgroups_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Таблица "пользователи - студенческие группы, к которым они отностяся".';
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
