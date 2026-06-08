import React from 'react'
import Home from './components/home'
import Login from './components/loging'
import FeeManagement from './components/fees';
import AttendenceManagement from './components/attendence';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
function App() {
  
  return (
  <Router>
  <Routes>
    <Route path="/" element={<Login />}/>
    <Route path="/home" element={<Home />}/>
    <Route path="/fee" element={<FeeManagement />}/>
        <Route path="/attendence" element={<AttendenceManagement />}/>
  </Routes>
</Router>
  
  )
}

export default App
