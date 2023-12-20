// src/components/Vote.tsx
import React from 'react';
import Question from './Question';


const Vote = () => {
  return (
    <div className="vote_page">
      <h2>Vote Page</h2>
      <Question />
      <br />
      <br />
      <p>* This is the Vote page.</p>
    </div>
  );
};

export default Vote;
