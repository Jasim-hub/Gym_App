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



function Activity() {
const [selectedDay, setSelectedDay] = useState("");
const [AddActivity, setAddActivity] = useState(false);
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

    return (<>
<nav className="navbar">
                <div className="logo-section">
                <img src={logo}/>
                <h2>Admin</h2>
                </div>
                
                <ul>
                  <li><a href="/admin">Dashboard</a></li>
          <li><a href="/attendencesummary">Attendance</a></li>
          <li><a href="/Activity">Activity</a></li>
          <li><a href="/feessummary">Fee</a></li>
          <select value={selectedDay} className="gender-select"
  onChange={(e) => setSelectedDay(e.target.value)}>
      <option value="">Select a Day</option>
          <option value="Monday">Monday</option>
          <option value="Tuesday">Tuesday</option>
          <option value="Wednesday">Wednesday</option>
          <option value="Thursday">Thursday</option>
          <option value="Friday">Friday</option>
          <option value="Saturday">Saturday</option>
      </select>
                </ul>
                <button onClick={() => setAddActivity(true)}>Add Activity</button>
                
              </nav>
 
          <section className="workout-section">
            
    {selectedDay ? (

    <div className="exercise-grid">
      {workouts[selectedDay].exercises.map((activity, index) => (
        <div key={index} className="exercise-card">
          <img
            src={activity.image}
             />

          <h3>{activity.name}</h3>
          <p>{activity.text}</p>
          <p>{activity.sets}</p>
        </div>
      ))}
    </div>
    ) : (
  <div className="activity-card">
    <h2>Please Select a Day</h2>
    <p>Choose a workout day to view activities.</p>
  </div>
)}
  </section>
  {AddActivity && (
  <div className="popup-overlay">
    <div className="popup-card">

      <h2>Add Activity</h2>

      <select className="gender-select">
      <option value="">Select Day</option>
          <option value="monday">Monday</option>
          <option value="Tuesday">Tuesday</option>
          <option value="Wednesday">Wednesday</option>
          <option value="Thursday">Thursday</option>
          <option value="Friday">Friday</option>
          <option value="Saturday">Saturday</option>
      </select>
      <select className="gender-select">
        <option value="">Select Wrokout Day</option>
        <option value="Leg Day">Leg Day</option>
        <option value="Back Day">Back Day</option>
        <option value="Chest Day">Chest Day</option>
        <option value="Shoulder Day">Shoulder Day</option>
        <option value="Arm Day">Arm Day</option>
        <option value="Cardio & Core">Cardio & Core</option>
      </select>
 <input type="text" placeholder="Workout Activities"/>
 <input type="text" placeholder="Workout Set"/>
 <textarea placeholder="Leave us a message..."></textarea>
 <div className="profile-upload">
      <label>Referral Images</label>
      <input type="file" accept="image/*" />
    </div>

               
          <div className="popup-buttons">
        <button className="save-btn">
          Add Activity
        </button>

        <button
          className="save-btn"
          onClick={() => setAddActivity(false)}
        >
          Close
        </button>
      </div>

    </div>
  </div>
)}

      </>
    )

}
export default Activity;