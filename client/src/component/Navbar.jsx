// src/components/Navbar.tsx
import React from 'react';
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <header>
        <Link className="active" to="/">Home</Link>
        <Link to="/vote/1">Vote</Link>
        <Link to="/create">Create</Link>
        <Link to="/question_list">Questions List</Link>
    </header>
  );
};

export default Navbar;
