// src/components/AnswersList.tsx
import React,{useEffect} from 'react';
import { ListGroup } from 'react-bootstrap';

const AnswersList = ({answers, setChosenAnswer, chosenAnswer, correctAnswer,votes,setAnswers}) => {
  function handleChooseAnswer(answer_id) {
    if (correctAnswer === 0) setChosenAnswer(answer_id);
  }
  useEffect(() => {
    const addVotes = () => {
      const rows = [];
  
      answers.forEach((answer) => {
        for (let i = 0; i < votes.length; i++) {
          if (votes[i].answer_id === answer.id) {
            rows.push({
              id: answer.id,
              text: answer.text,
              vote: votes[i].votes,
            });
          }
        }
      });
    
      console.log("vote", rows);
      setAnswers(rows)
    }
    if (votes.length !== 0) addVotes();
  }, [votes]);
  return (
    <ListGroup variant="flush">
      {answers.map((answer,index) => {
        return (
          <div  className={`option 
                            ${answer.id === chosenAnswer ? 'chosen_option':''} 
                            ${chosenAnswer > 0 && answer.id === correctAnswer ? 'right_option':''}
                            ${correctAnswer > 0 && chosenAnswer > 0 && chosenAnswer !== correctAnswer && correctAnswer !== answer.id && chosenAnswer===answer.id ? "bad_option" : ""}`}    
              key={answer.id} 
              onClick={() => handleChooseAnswer(answer.id)}>

            <span>{index}</span>{" - "}
            <span>{answer.text}</span>
            {votes.length !== 0 && <span className={`${correctAnswer !== answer.id ? "bad_count" : "right_count"}`}>{answer.vote} choosed it</span>}
        </div>
        )
        
      })}
      </ListGroup>

  );
};

export default AnswersList;
