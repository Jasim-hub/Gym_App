import React from "react";
import { useState, useEffect } from "react";
import './home.css';
import API from "./api";


function AttendenceManagement() {
 const [showAttendance, setShowAttendance] = useState(false);
 const [workouts, setWorkouts] = useState([]);
  const [inTime, setInTime] = useState("");
  const [outTime, setOutTime] = useState("");
  const day = new Date().toLocaleDateString(
  "en-US",
  {
    weekday: "long",
  }
);
  const member = JSON.parse(
  localStorage.getItem("member")
);

  useEffect(() => {
  console.log("Component Loaded");

  const today = new Date().toDateString();
  
}, []);
const handleCheckIn = async () => {
  try {
    const member = JSON.parse(
      localStorage.getItem("member")
    );

    const response = await API.post(
      "/attendance/checkin/",
      {
        user_id: member.user_id,
      }
    );

    setInTime(new Date().toLocaleTimeString());

  } catch (error) {
    console.log(error);
  }
  setInTime(new Date().toLocaleTimeString());

localStorage.setItem(
  "attendanceDate",
  new Date().toDateString()
);
};

  const handleCheckOut = async () => {
  try {
    const member = JSON.parse(
      localStorage.getItem("member")
    );

    const response = await API.post(
      "/attendance/checkout/",
      {
        user_id: member.user_id,
      }
    );

    setOutTime(new Date().toLocaleTimeString());

  } catch (error) {
    console.log(error.response?.data);
  }
};

useEffect(() => {
  getTodayAttendance();
  fetchActivity();
}, []);
const getTodayAttendance = async () => {
  try {
    const member = JSON.parse(localStorage.getItem("member"));

    const response = await API.get(`/attendance/${member.user_id}/`);

    const todayDate = new Date().toISOString().split("T")[0];

    const todayAttendance = response.data.find(
      (item) => item.date === todayDate
    );

    if (todayAttendance) {
      setInTime(todayAttendance.check_in?.split(".")[0] || "");
      setOutTime(todayAttendance.check_out?.split(".")[0] || "");
    } else {
      setInTime("");
      setOutTime("");
      setShowAttendance(true);
    }

  } catch (error) {
    console.log(error);
  }
};

const fetchActivity = async () => {
  try {
    const response = await API.get("/activity/view/");
   setWorkouts(response.data);
   console.log(response.data);

  } catch (error) {
    console.log(error);
    
  }
 
};

const todayWorkouts = workouts.filter(
  (item) => item.day === day
);
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
              <>
              <p className="success">
                Attendance Completed ✅</p>
                </>
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
    <h2>Today's Fitness Mission: {todayWorkouts.length > 0
    ? todayWorkouts[0].workout_day
    : "Rest Day"}</h2>

    <div className="exercise-grid">
      {todayWorkouts.length > 0 ? (todayWorkouts.map((exercise, index) => (
        <div key={index} className="exercise-card">
          <img
            src={exercise.image}
             />

          <h3>{exercise.exercise_name}</h3>
          <p>{exercise.description}</p>
          <p>{exercise.sets}</p>
        </div>
      ))) : (
      <h3>Rest Day 🧘</h3>
    )}
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