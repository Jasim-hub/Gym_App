import React from 'react'
import Home from './components/home'
import Login from './components/loging'
import FeeManagement from './components/fees';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
function App() {
  
  return (
  <Router>
  <Routes>
    <Route path="/" element={<Login />}/>
    <Route path="/home" element={<Home />}/>
    <Route path="/fee" element={<FeeManagement />}/>
  </Routes>
</Router>
  
  )
}

export default App
