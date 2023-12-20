import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Home from "./component/Home";
import Create from "./component/Create";
import Vote from "./component/Vote";
import Navbar from './component/Navbar';
import Footer from './component/Footer';
import QuestionList from './component/QuestionList';
function App() {
  return (
    <Router>
      <div className='App'>
        <Navbar />

          <Routes>
            <Route
                path="/"
                element={<Home />}
            ></Route>
            <Route
                path="/create"
                element={<Create />}
            ></Route>
            <Route
                path="/vote/:question_id"
                element={<Vote />}
            ></Route>
            <Route
                path="/question_list"
                element={<QuestionList />}
            ></Route>
        </Routes>
        <Footer/>
      </div>
    </Router>
  );
}

export default App;
