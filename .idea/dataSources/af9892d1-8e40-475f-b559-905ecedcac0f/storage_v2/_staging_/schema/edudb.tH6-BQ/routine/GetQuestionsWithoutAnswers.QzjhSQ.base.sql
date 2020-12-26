create
    definer = root@localhost procedure GetQuestionsWithoutAnswers(IN _testId int)
BEGIN
    SELECT questionId
    FROM (SELECT t.id AS questionId, IF(SUM(correct) IS NULL, 0, SUM(correct)) AS correctAnswersCount
          FROM testsanswers
                   RIGHT JOIN testquestions t on t.testId = testsanswers.testId and t.id = testsanswers.questionId
                   JOIN questiontypes q on q.id = t.questionType and hasCorrectAnswer = 1 and t.testId = _testId
          GROUP BY t.id) AS testQuestionCorrectAnswers
    WHERE correctAnswersCount = 0;
end;

