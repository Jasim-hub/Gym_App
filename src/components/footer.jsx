import React from 'react'
import { useNavigate } from 'react-router-dom'
import './home.css';

export default function Footer() {
const navigate = useNavigate();

    const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("member");
  navigate("/", { replace: true });
};

  return (
    <div>
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
  <button className="footer-btn" onClick={handleLogout}>logout</button>
</footer>
    </div>
  )
}
