import React from 'react'
import Home from './components/home'
import Login from './components/loging'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
function App() {
  
  return (
  <Router>
  <Routes>
    <Route path="/" element={<Login />}/>
    <Route path="/home" element={<Home />}/>
  </Routes>
</Router>
  
  )
}

export default App
