import React from 'react'
import './App.css'
import { Route, Routes } from "react-router-dom";
import Blogs from './components/Blogs/Blogs';
import Register from './components/Register/Register';
import Login from './components/Login/Login';

function App() {
  return (
    <React.Fragment>
      <Routes>
      <Route path="/" element={<Register />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/blogs" element={<Blogs />} />
      </Routes>
    </React.Fragment>
  )
}

export default App