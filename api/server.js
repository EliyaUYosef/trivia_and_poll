// server.js

const express = require("express");
const cors = require("cors");
const connection = require("./db");
const dotenv = require("dotenv");

const app = express();
const port = process.env.PORT || 3030;

app.use(cors());
app.use(express.json());
dotenv.config();

app.get("/chooseAnswer", async (req, res) => {
  // get params
  const { question_id: temp_question_id, answer_id: temp_answer_id } =
    req.query;
  const question_id = Number(temp_question_id);
  const answer_id = Number(temp_answer_id);

  // validation
  if (!question_id && question_id < 0) {
    return res.status(400).json({ error: "Invalid Question ID." });
  }

  if (!answer_id && answer_id < 0) {
    return res.status(400).json({ error: "Invalid Answer ID." });
  }

  // update counters
  // update question count
  const sql_question =
    "UPDATE tb_questions SET votes_count = votes_count + 1 WHERE id = ? ;";
  connection.query(sql_question, [question_id], (err) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ error: "Internal server error." });
    }
  });

  // updaet answer count
  const sql_answer =
    "UPDATE tb_answer_votes SET count = count + 1 WHERE question_id = ? AND answer_id = ?;";
  connection.query(sql_answer, [question_id, answer_id], (err) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ error: "Internal server error." });
    }
  });

  // get question from db
  const sql = "SELECT * FROM tb_questions WHERE id = ?";

  connection.query(sql, [question_id], (err, questionResults) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ error: "Internal server error." });
    }

    if (questionResults.length === 0) {
      return res.status(404).json({ error: "Question not found." });
    }

    let result = {};

    // check answer
    if (answer_id && answer_id === questionResults[0].answer_id) {
      result.choose_right_choice = 1;
    }

    let statistic_query =
      "select q.votes_count,q.type,q.answer_id as correct_answer,v.* from tb_questions q INNER JOIN tb_answer_votes v ON (q.id=v.question_id) where q.id = ?;";
    connection.query(statistic_query, [question_id], (err, statisticResult) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).json({ error: "Internal server error." });
      }

      if (statisticResult.length === 0) {
        return res.status(404).json({ error: "Question not found." });
      }
      result.answers = statisticResult.map((row) => {
        result.question_solvers = row.votes_count;
        result.correct_answer_id = row.correct_answer;
        return { answer_id: row.answer_id, votes: row.count };
      });

      // result
      res.json(result);
    });
  });
});

app.get("/getQuestion", (req, res) => {
  // get params
  const { question_id: temp_question_id } = req.query;
  const question_id = Number(temp_question_id);

  // validation
  if (question_id && !isValidInteger(question_id)) {
    return res.status(400).json({ error: "Invalid Question ID." });
  }

  // get question from db
  const sql =
    "SELECT id, votes_count, text, type FROM tb_questions WHERE id = ?";

  connection.query(sql, [question_id], (err, questionResults) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ error: "Internal server error." });
    }

    if (questionResults.length === 0) {
      return res.status(404).json({ error: "Question not found." });
    }

    const answerSql = "SELECT * FROM tb_answers WHERE question_id = ?";

    connection.query(answerSql, [question_id], (err, answerResults) => {
      if (err) {
        console.error("Error executing answer query:", err);
        return res.status(500).json({ error: "Internal server error." });
      }
      if (answerResults.length === 0) {
        return res.status(404).json({ error: "Answers not found." });
      }

      // Format the result
      const result = {
        question: questionResults[0],
        answers: answerResults,
      };

      // result
      res.json(result);
    });
    // res.json({ user: results[0] });
  });
});

app.post("/insertNewQuestion", async (req, res) => {
  // get params
  const { question, questionType: question_type, answers } = req.body;

  // validation
  if (!question || question.length < 7) {
    return res.status(400).json({ error: "Invalid Question Text." });
  }
  // check question type
  if (
    !question_type ||
    (!question_type.includes("trivia") && !question_type.includes("poll"))
  ) {
    return res.status(400).json({ error: "Invalid Question Type." });
  }
  if (!answers || answers.length === 0) {
    return res.status(400).json({ error: "Invalid Answer ID." });
  }

  // insert new question
  const sql =
    "INSERT INTO tb_questions (votes_count, text, type) VALUES (0, ?, ?)";
  connection.query(sql, [question, question_type], (err, questionId) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ error: "Internal server error." });
    }
    console.log(questionId.insertId); // question_id
    console.log(answers); // question_id

    // parse answers
    const sortedAnswers = answers.sort((a, b) => {
      if (b.isCorrect) return 1;
      if (a.isCorrect) return -1; // Place the correct answer first
      return 0;
    });

    // Modify the sortedAnswers array to include the question_id
    const finalArray = sortedAnswers.map((answer) => [
      questionId.insertId,
      answer.text,
    ]);
    console.log(finalArray);

    // insert answers
    const sql = "INSERT INTO tb_answers (question_id, text) VALUES ?";
    connection.query(sql, [finalArray], (err, dbResult) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).json({ error: "Internal server error." });
      }

      // update correct answer on question
      const sql_question =
          "UPDATE tb_questions SET answer_id= ? WHERE id = ? ;";
      connection.query(sql_question, [dbResult.insertId ,questionId.insertId], (err) => {
        if (err) {
          console.error("Error executing query:", err);
          return res.status(500).json({ error: "Internal server error." });
        }
      });

      // create answer_votes rows
      answers_length = answers.length;
      const finalAnswers = answers.map((answer, index) => [
        questionId.insertId,
        dbResult.insertId + index,
      ]);
      console.log(finalAnswers)
      const sql = "INSERT INTO tb_answer_votes (question_id, answer_id) VALUES ?";
      connection.query(sql, [finalAnswers], (err, dbResult) => {
        if (err) {
          console.error("Error executing query:", err);
          return res.status(500).json({ error: "Internal server error." });
        }
        if (dbResult.length === 0) {
          console.error("Error executing query:", err);
          return res.status(400).json({ error: "Failed on rows create process." });
        }
      })
      // result
      res.json({ message: "Question created." });
    });
  });
});

app.get("/getQuestionsList", (req, res) => {
  const sql =
    "SELECT id, votes_count, text, type FROM tb_questions WHERE ? ORDER BY id DESC LIMIT 25";

  connection.query(sql, [1], (err, questionResults) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ error: "Internal server error." });
    }

    if (questionResults.length === 0) {
      return res.status(404).json({ error: "Question not found." });
    }
    console.log(questionResults)

    // result
    return res.json({data:questionResults});
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

function isValidInteger(value) {
  if (typeof value === "number" && Number.isInteger(value) && value > 0) {
    return true;
  }
  return false;
}
