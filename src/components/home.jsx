import React from 'react';
import './home.css';
import logo from './assets/logo.jpeg';
import park from './assets/park.jpeg';
import time from './assets/time.jpeg';
import trainer from './assets/professional.jpeg';
import equments from './assets/equments.jpeg';
import locker from './assets/locker.jpeg';
import diet from './assets/dite.jpeg';
import zumba from './assets/zumba.jpeg';
import yoga from './assets/yoga.jpeg';
import { useEffect } from "react";
import { Link } from 'react-router-dom';
function Home() {
    useEffect(() => {
  const reveal = () => {
    const elements = document.querySelectorAll(".reveal");

    elements.forEach((element) => {
      const windowHeight = window.innerHeight;
      const elementTop = element.getBoundingClientRect().top;

      if (elementTop < windowHeight - 100) {
        element.classList.add("active");
      }
    });
  };

  window.addEventListener("scroll", reveal);
  reveal();

  return () => window.removeEventListener("scroll", reveal);
}, []);
  return (
    <div>
      
      <nav className="navbar">
        <div className="logo-section">
        <img src={logo}/>
        <h2>Jasim</h2>
        </div>
        <ul>
          <li><a href="#home">Home</a></li>
          <li><a href="/attendence">Attendance</a></li>
          <li><a href="/fee">Fees</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
        
      </nav>

      <section className="hero" id="home">
        <div>
        
          <h1>Infinity Wellness Hub</h1>
          <p>
            Build Strength, Boost Confidence, Live Better.
          </p>
          
        </div>
      </section>
    <section className="about reveal">
        <div>
            <h2>Why Choose Infinity Wellness Hub</h2>
            <p>At Infinity Wellness Hub,
                 we provide expert training, modern facilities, and a supportive environment to help you
                  achieve your fitness goals. Thank you for choosing us
                   we're excited to be part of your wellness journey.
</p>
        </div>
    </section>
        <h2 className="feahead reveal">WORKOUT FACILITIES</h2>
      <section className="features reveal">
        <div className="card reveal">
            <img src={park}/>
            <div className="cardtext">
          <h3>Free Parking</h3>
          <p>Enjoy Free and Secure Parking During Your Workout.</p>
          </div>
        </div>

        <div className="card reveal">
            <img src={time}/>
            <div className="cardtext">
          <h3>Train on Your Schedule</h3>
          <p>Operating 15 continuous hours daily to help you train on your schedule.</p>
          </div>
        </div>

        <div className="card reveal">
            <img src={equments}/>
            <div className="cardtext">
          <h3>World-Class Equipment</h3>
          <p>Train with state-of-the-art equipment designed to support every fitness level and help you achieve your goals efficiently.</p>
          </div>
        </div>

        <div className="card reveal">
            <img src={trainer}/>
            <div className="cardtext">
          <h3>Expert Trainers</h3>
          <p>Train with experienced and dedicated professionals committed to your success.</p>
          </div>
        </div>
        <div className="card reveal">
            <img src={locker}/>
            <div className="cardtext">
          <h3>Locker Facilities</h3>
          <p>Secure and spacious locker facilities to keep your belongings safe while you focus on your workout.</p>
          </div>
        </div>
        <div className="card reveal">
            <img src={diet}/>
            <div className="cardtext">
          <h3>Personalized Diet & Workout Plans</h3>
          <p>Get personalized diet and workout plans tailored to your fitness goals.</p>
          </div>
        </div>
        <div className="card reveal">
            <img src={yoga}/>
            <div className="cardtext">
          <h3>Professional Yoga Training</h3>
          <p>Experience balance, flexibility, and inner peace through professional yoga training.</p>
          </div>
        </div>
        <div className="card reveal">
            <img src={zumba}/>
            <div className="cardtext">
          <h3>Zumba Dance</h3>
          <p>Zumba is a fun dance workout that improves fitness and burns calories through energetic music and simple moves.</p>
          </div>
        </div>
      </section>
      <section className="contact" id="contact">
        <h3 className="reveal">HIT US UP ANYTIME</h3>

        <div className="overlay">
           
<div className="img-box">


         <div className="form-box reveal">
      <h2>Contact Us</h2>

      <div className="row">
        <input type="text" placeholder="First Name"/>
        <input type="text" placeholder="Last Name"/>
      </div>

      <div className="row">
        <input type="text" placeholder="Phone Number"/>
        <input type="email" placeholder="abc@gmail.com"/>
      </div>

      <textarea placeholder="Leave us a message..."></textarea>
      <button>Submit</button>
    </div>
 </div>
   </div>
   </section>
<footer className="footer">
  <div className="footer-container">

    <div className="footer-box">
      <h3>Infinity Wellness Hub</h3>
      <p>Transform your body and mind with expert training and modern fitness programs.</p>
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
  );
}

export default Home;