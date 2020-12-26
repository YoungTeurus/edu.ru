create
    definer = root@localhost procedure CreateNewAnswerToQuestion(IN _testId int, IN _questionId int,
                                                                 IN _text varchar(1024), IN _correct tinyint(1))
BEGIN
    INSERT INTO testsanswers(testId, questionId, answer, correct) VALUE (_testId, _questionId, _text, _correct);
    RETURN LAST_INSERT_ID();
end;

