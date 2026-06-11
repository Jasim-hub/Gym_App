import React from "react";
import { useState, useEffect } from "react";
import './home.css';
import logo from './assets/logo.jpeg'
import chestFly from './assets/chestFly.jpeg'
import barbellpress from './assets/barbellpress.jpeg'
import lunges from './assets/Lunges.jpeg'
import legpress from './assets/leg_press.jpeg'
import benchpress from './assets/bench_press.jpeg'
import squat from './assets/squat.jpeg'



function AttendenceManagement() {
 const [showAttendance, setShowAttendance] = useState(false);
  const [inTime, setInTime] = useState("");
  const [outTime, setOutTime] = useState("");
  const member = JSON.parse(
  localStorage.getItem("member")
);

  useEffect(() => {
  console.log("Component Loaded");

  const today = new Date().toDateString();
  const attendanceDate = localStorage.getItem("attendanceDate");

  
  console.log("Stored:", attendanceDate);
  

  if (attendanceDate !== today) {
    setShowAttendance(true);
  }
}, []);


  const handleCheckIn = () => {
    const time = new Date().toLocaleTimeString();

    setInTime(time);

    localStorage.setItem("attendanceDate", new Date().toDateString());
    localStorage.setItem("checkInTime", time);
  };

  const handleCheckOut = () => {
  const time = new Date().toLocaleTimeString();

  setOutTime(time);

  localStorage.setItem("checkOutTime", time);

  setTimeout(() => {
    setShowAttendance(false);
  }, 1500);
};
const day = new Date().toLocaleDateString("en-US", {
  weekday: "long",
});

  const workouts = {
  Monday: {
    title: "Leg Day",
    exercises: [
      {
        name: "Squats",
        sets: "4 × 10",
        text:"Builds stronger legs, glutes, and core strength while improving balance and overall lower-body power.",
        image: squat,
      },
      {
        name: "Leg Press",
        sets: "3 × 12",
        image: legpress,
      },
      {
        name: "Lunges",
        sets: "3 × 15",
        image: lunges,
      },
    ],
  },

  Tuesday: {
    title: "Chest Day",
    exercises: [
      {
        name: "Bench Press",
        sets: "4 × 10",
        text:"",
        image: benchpress,
      },
      {
        name: "Incline Press",
        sets: "3 × 12",
        image: barbellpress,
      },
      {
        name: "Chest Fly",
        sets: "3 × 15",
        image: chestFly,
      },
    ],
  },
};
const workout = workouts[day] || {
  title: "Rest Day",
  exercises: [],
};
    return (<>
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
        <button
  onClick={() => setShowAttendance(true)}
>
  Attendance Marking
</button>
      </nav>


   
    {showAttendance && (
        <div className="attendance-overlay">
          <div className="attendance-popup">
            <h2>🏋️ Today's Attendance</h2>

            <p>Welcome Back!</p>

            <div className="attendance-info">
              <p>
                <strong>Date:</strong>{" "}
                {new Date().toLocaleDateString()}
              </p>

              <p>
                <strong>In Time:</strong>{" "}
                {inTime || "Not Marked"}
              </p>

              <p>
                <strong>Out Time:</strong>{" "}
                {outTime || "Not Marked"}
              </p>
            </div>

            {!inTime ? (
              <button onClick={handleCheckIn}>
                Check In
              </button>
            ) : !outTime ? (
              <button onClick={handleCheckOut}>
                Check Out
              </button>
              
            ) : (
              <p className="success">
                Attendance Completed ✅
              </p>
            )}
            <button
  className="close-attendance"
  onClick={() => setShowAttendance(false)}
>
  Close
</button>
          </div>
        </div>
      )}
      <section className="workout-section">
    <h2>Today's Fitness Mission: {workout.title}</h2>

    <div className="exercise-grid">
      {workout.exercises.map((exercise, index) => (
        <div key={index} className="exercise-card">
          <img
            src={exercise.image}
             />

          <h3>{exercise.name}</h3>
          <p>{exercise.text}</p>
          <p>{exercise.sets}</p>
        </div>
      ))}
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
      </>
    )

}
export default AttendenceManagement;