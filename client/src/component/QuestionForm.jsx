import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const QuestionForm = () => {
  const [question, setQuestion] = useState('');
  const [answers, setAnswers] = useState([
    { text: '', isCorrect: false },
  ]);
  const [questionType, setQuestionType] = useState('trivia');
  const [error, setError] = useState('');

  const handleQuestionChange = (e) => {
    setQuestion(e.target.value);
  };
  
  const handleQuestionTypeChange = (e) => {
    setQuestionType(e.target.value);
  };

  const handleAnswerChange = (e, index) => {
    const newAnswers = [...answers];
    newAnswers[index].text = e.target.value;
    setAnswers(newAnswers);
  };

  const handleCorrectAnswerChange = (index) => {
    if (error === "Please choose correct answer.")setError('')
    const newAnswers = answers.map((answer, i) => ({
      ...answer,
      isCorrect: i === index,
    }));
    setAnswers(newAnswers);
  };

  const handleAddAnswer = () => {
    if (answers.length < 5) {
      setAnswers([...answers, { text: '', isCorrect: false }]);
    }
  };

  const handleRemoveAnswer = (index) => {
    const newAnswers = answers.filter((_, i) => i !== index);
    setAnswers(newAnswers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let answer = answers.filter((x)=> x.isCorrect)
    if (answer.length === 0 && questionType === 'trivia') {
      setError('Please choose correct answer.')
      return;
    };
    
    try {
      // Assuming you have a backend endpoint for handling question submissions
      const response = await fetch('http://localhost:3020/insertNewQuestion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question,questionType, answers }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to submit question');
      }
  
      const responseData = await response.json();
    } catch (error) {
      console.error('Error submitting question:', error.message);
    }
  };

  return (
    <form className='question_form' onSubmit={handleSubmit}>
      <label className='question_label' style={{width:"100%"}}>
        Question Text : <br/>
        <Form.Control
          as="textarea"
          placeholder="Leave your question ..."
          style={{ height: '100px', width: '90%', marginLeft:"5%" }}
          value={question} onChange={handleQuestionChange}
        />
        {/* <input type="text" /> */}
      </label>
      <label style={{width:"100%", padding: '15px'}}>
        Question Type:<br/>
        <Form.Select aria-label="select" onChange={handleQuestionTypeChange}  value={questionType}>
          <option value="trivia">Trivia</option>
          <option value="poll">Poll</option>
        </Form.Select>
      </label>
      <div className='answers_inputs'>
        <h3>Answers:</h3>
        {answers.map((answer, index) => (
          <div key={index} className='each_answer'>
            <label>
              <span className='answer_tag'><strong>#{index+1}</strong></span><br /> <br /> 
              Text : 
            <input
              type="text"
              style={{width:"100%"}}
              value={answer.text}
              onChange={(e) => handleAnswerChange(e, index)}
            />
            </label>
            <br />
            <br />
            { questionType !== "poll" && <label style={{width:"100%"}}>
            <input
                type="checkbox"
                checked={answer.isCorrect}
                style={{marginRight:'3%'}}
                onChange={() => handleCorrectAnswerChange(index)}
              />

              Check if This is the Correct
            </label>}
            <br />  
            <br />  
            <Button variant="outline-danger" onClick={() => handleRemoveAnswer(index)}>
              Remove
            </Button>
          </div>
        ))}
      </div>
      { error !== '' && <div className='error_place'>
        {error}
      </div>}
        <div className={`form_buttons_area text-center`}>
      {answers.length < 5 && <Button variant="outline-primary" type="button" onClick={handleAddAnswer}>
        Add Answer
      </Button>}

      <Button className='mx-2' type='submit'>Create</Button>
      </div>
      
    </form>
  );
};

export default QuestionForm;