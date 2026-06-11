import React from "react";
import './home.css';
import logo from './assets/logo.jpeg'
import basic from './assets/basic.jpeg'
import premium from './assets/premium.jpeg'
import elite from './assets/elite.jpeg'
import { useState, useEffect } from "react";
import Home from "./home";
import { Link, useNavigate } from "react-router-dom";


function FeeManagement() {
   const [showFee, setShowFee] = useState(false);
   const navigation=useNavigate();
   const member = JSON.parse(
  localStorage.getItem("member")
);

  const handleRenw = () =>{
    navigation ("/fee")
  };


  return (
    <div>
<nav className="navbar">
        <div className="logo-section">
        <img src={`http://127.0.0.1:8000${member.profile_image}`} alt='profile'/>
        <h2>{member.name}</h2>
        </div>
        <ul>
          <li><a href="/home">Home</a></li>
          <li><a href="/attendence">Attendance</a></li>
          <li><a href="/fee">Fees</a></li>
          <li><a href="/home#contact">Contact</a></li>
        </ul>
         <button onClick={() => setShowFee(true)}>
  My Membership
</button>
        </nav>
        {showFee && (
  <div className="membership-overlay">
    <div className="membership-card">

       <h2>My Membership</h2>

      <h3>Premium Plan</h3>

      <p>Status: Active ✅</p>
      <p>Start Date: 01-06-2026</p>
      <p>Expiry Date: 30-06-2026</p>
      <p>Remaining Days: 24</p>

      <button className="renew-btn" onClick={() => {
    setShowFee(false);

    setTimeout(() => {
      const feesSection = document.getElementById("fees");

      if (feesSection) {
        feesSection.scrollIntoView({
          behavior: "smooth",
        });
      }
    }, 100);
  }}>
        Renew Plan
      </button>
      <button
        className="renew-btn"
        onClick={() => setShowFee(false)}
      >
       Close
      </button>
    </div>
  </div>
)}
<h2 className="second">Choose Your Fitness Journey</h2>
        <section className="fees-mang" id="fees">
                <div className="fee-card">
                   <img src={basic}/> 
                    <div className="fee-cardtext">
                  <h2>Basic Plan</h2>
                  <h3>Starting from ₹1300</h3>
                  <ul>
                    <li>1 Month Plan</li>
                    <li>✔ Gym Access</li>
                    <li>✔ Locker Facility</li>
                    <li>✔ Free Paraking Access</li>
                    <li>✔ Cardio Access</li>
                  </ul>
                  </div>
                  <button>GET STARTED</button>
                </div>
                <div className="fee-card">
                   <img src={premium}/> 
                    <div className="fee-cardtext">
                  <h2>Premium Plan</h2>
                  <h3>Starting from ₹4500</h3>
                  <ul>
                    <li>6 Month Plan</li>
                    <li>Everything in Basic Plan</li>
                    <li>✔ Personal Trainer Support</li>
                    <li>✔ Locker Facility</li>
                    <li>✔ Diet Plan</li>
                    <li>✔ Monthly Fitness Assessment</li>
                    <li>✔ Yoga Classes</li>
                  </ul>
                  </div>
                  <button>GET STARTED</button>
                </div>
                <div className="fee-card">
                   <img src={elite}/> 
                    <div className="fee-cardtext">
                  <h2>Elite Plan</h2>
                  <h3>Starting from ₹7500</h3>
                  <ul>
                    <li>1 Year Plan</li>
                    <li>Everything in Premium Plan</li>
                    <li>✔ Customized Workout Plan</li>
                    <li>✔ Customized Diet Plan</li>
                    <li>✔ Unlimited Yoga Sessions</li>
                    <li>✔ Priority Trainer Support</li>
                    <li>✔ Body Composition Analysis</li>
                    <li>✔ Premium Member Benefits</li>
                  </ul>
                  
                  </div>
                  <button>GET STARTED</button>
                </div>
                </section>
<footer className="footer">
  <div className="footer-container">

    <div className="footer-box">
      <h3>Infinity Wellness Hub</h3>
      <p>Transform your body and mind with expert training and modern fitness programs.</p>
      <div className="footer-logo">
      <i className="fa-brands fa-whatsapp"></i>
      <i className="fa-brands fa-instagram"></i>
      <i className="fa-brands fa-youtube"></i>
      <i className="fa-brands fa-facebook"></i>
      </div>
    </div>

    <div className="footer-box">
      <h3>Quick Links</h3>
      <ul>
        <li><a href="#home">Home</a></li>
        <li><a href="#">Classes</a></li>
        <li><a href="#">Trainers</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </div>

    <div className="footer-box">
      <h3>Contact</h3>
      <p>📍 Trivandrum, Kerala</p>
      <p>📞 +91 9876543210</p>
      <p>✉ InfinityWellnessHub@gym.com</p>
    </div>

  </div>

  <div className="footer-bottom">
    <p>© 2026 Infinity Wellness Hub. All Rights Reserved.</p>
  </div>
</footer>
               
    
</div>
  )
}

export default FeeManagement;