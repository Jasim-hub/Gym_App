import React from "react";
import './home.css';
import logo from './assets/logo.jpeg'
import park from './assets/logo.jpeg'

function FeeManagement() {
  return (
    <div>
<nav className="navbar">
        <div className="logo-section">
        <img src={logo}/>
        <h2>Jasim</h2>
        </div>
        <ul>
          <li><a href="#home">Home</a></li>
          <li>Attendance</li>
          <li>Fees</li>
          <li><a href="#contact">Contact</a></li>
        </ul>
        </nav>
        
        <section className="member-dashboard">
  <h2>My Membership</h2>

  <div className="membership-card">
    <h3>Premium Plan</h3>
    <p>Status: Active ✅</p>
    <p>Start Date: 01-06-2026</p>
    <p>Expiry Date: 30-06-2026</p>
    <p>Remaining Days: 24</p>
    <button>Renew Plan</button>
  </div>
</section>
<h2 className="second">Pick Your Plan</h2>
        <section className="fees-mang">
                <div className="card">
                   <img src={park}/> 
                    <div className="cardtext">
                  <h3>Free Parking</h3>
                  <p>Enjoy Free and Secure Parking During Your Workout.</p>
                  </div>
                </div>
                <div className="card">
                   <img src={park}/> 
                    <div className="cardtext">
                  <h3>Free Parking</h3>
                  <p>Enjoy Free and Secure Parking During Your Workout.</p>
                  </div>
                </div>
                <div className="card">
                   <img src={park}/> 
                    <div className="cardtext">
                  <h3>Free Parking</h3>
                  <p>Enjoy Free and Secure Parking During Your Workout.</p>
                  </div>
                </div>
                </section>

    </div>
  );
}

export default FeeManagement;