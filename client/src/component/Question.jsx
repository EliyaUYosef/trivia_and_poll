// src/components/Question.tsx
import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import AnswersList from './AnswersList';
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';


const Question = () => {
  const { question_id } = useParams();
  const [questionObject, setQuestionObject] = useState(null);
  const [answers, setAnswers] = useState(null);
  const [votes, setVotes] = useState([]);
  const [chosenAnswer, setChosenAnswer] = useState(0);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  
  useEffect(() => {
    
    console.log(chosenAnswer)
    fetchQuestionById();
  }, [question_id]);
  
  async function checkAnswerHandler () {
    if (chosenAnswer === 0) {
      return;
    }
    try {
      const response = await fetch(`http://localhost:3020/chooseAnswer?question_id=${question_id}&answer_id=${chosenAnswer}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to check answer');
      }

      const result = await response.json();

      setCorrectAnswer(result.correct_answer_id)
      setVotes(result.answers)
      console.log(result);
    } catch (error) {
      console.error('Error checking answer:', error.message);
    }
  };
  async function fetchQuestionById() {
    try {
      const response = await fetch(`http://localhost:3020/getQuestion?question_id=${question_id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch question');
      }
      const questionData = await response.json();
  
      setQuestionObject(questionData.question);
      setAnswers(questionData.answers);
    } catch (error) {
      console.error('Error fetching question:', error.message);
    }
  };

  if (questionObject === null) return <h1>Please Choose Question</h1>
  
  return (
    <Card className="text-center question_card">
        <Card.Header>
          <div>
          Question {questionObject.id}
          </div>
          <div>
          {/* {question_id > 1 && <Link className='mx-2' to={`/vote/${question_id-1}`}>prev</Link>}
          <Link className='mx-2' to={`/vote/${+question_id+1}`}>next</Link> */}
          </div>
        </Card.Header>
        <Card.Body>
          <Card.Title>{questionObject.text} </Card.Title>
          <div className='question_details'>
              <span ><strong>Type :</strong> {questionObject.type}</span>
              <br />
              <span >( {questionObject.votes_count} answers )</span>
          </div>
        </Card.Body>
        <Card.Footer>
          <AnswersList correctAnswer={correctAnswer} answers={answers} setChosenAnswer={setChosenAnswer} chosenAnswer={chosenAnswer} votes={votes} setAnswers={setAnswers}/>
          <br />
          <Button style={{border:"none",backgroundColor:"#04AA6D"}} onClick={checkAnswerHandler}>
            Check
          </Button>
        </Card.Footer>
    </Card>
  );
};

export default Question;
