import React from 'react'
import Home from './components/home';
import Login from './components/loging'
import FeeManagement from './components/fees';
import AttendenceManagement from './components/attendence';
import AdminDashboard from './components/admin_dhashbord';
import AttendenceSummary from './components/attendence_summary';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FeeSummary from './components/feessummary';
import Activity from './components/Activity';
import MembershipProtected from './components/membershipProtected';
function App() {
  
  return (
  <Router>
  <Routes>
    <Route path="/" element={<Login />}/>
    <Route path="/home" element={  <MembershipProtected><Home /></MembershipProtected>}/>
        <Route path="/fee" element={<FeeManagement />}/>
        <Route path="/attendence" element={  <MembershipProtected><AttendenceManagement /></MembershipProtected>}/>
        <Route path="/admin" element={  <AdminDashboard />}/>
        <Route path="/attendencesummary" element={<AttendenceSummary />}/>
        <Route path="/activity" element={<Activity />}/>
        <Route path="/feessummary" element={<FeeSummary />}/>
  </Routes>
</Router>
  
  )
}

export default App
