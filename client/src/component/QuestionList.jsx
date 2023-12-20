// QuestionList.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ListGroup } from 'react-bootstrap';
function QuestionList() {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3020/getQuestionsList')
      .then(response => response.json())
      .then(data => {
        console.log(data)
        return setQuestions(data.data)
      })
      .catch(error => console.error('Error fetching questions:', error));
  }, []); 

  return (
    <div style={{width:"90%",marginLeft:"5%"}}>
      <h2 className='m-3'>Question List</h2>
      <ListGroup style={{textAlign:"center"}}>
        {questions.map((question,index) => (
          <ListGroup.Item key={question.id}>
            <Link style={{textDecoration:"none"}} to={`/vote/${question.id}`}>{index+1+" - "+question.text}</Link>
          </ListGroup.Item>
        ))}
      </ListGroup>
      </div>
  );
}

export default QuestionList;
