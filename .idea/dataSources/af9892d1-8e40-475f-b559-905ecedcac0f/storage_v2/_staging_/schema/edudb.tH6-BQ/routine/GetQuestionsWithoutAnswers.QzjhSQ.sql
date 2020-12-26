create
    definer = root@localhost procedure GetQuestionsWithoutAnswers(IN _testId int)
BEGIN
    SELECT questionId
    FROM (
          -- Сумма correct-ов должна возращать 1+, если есть хотя бы один верный ответ.
          -- Если на вопрос ещё нет ответов тоже вернёт 0.
             SELECT t.id AS questionId, IF(SUM(correct) IS NULL, 0, SUM(correct)) AS correctAnswersCount
             FROM testsanswers
                      RIGHT JOIN testquestions t on t.testId = testsanswers.testId and t.id = testsanswers.questionId
                 -- Здесь последний AND вынесен из предыдущей строки, чтобы testID правильно выбирался, не смотря на RIGHT JOIN
                      JOIN questiontypes q on q.id = t.questionType and hasCorrectAnswer = 1 and t.testId = :testId
             GROUP BY t.id
        ) AS testQuestionCorrectAnswers
    WHERE correctAnswersCount = 0;
end;

