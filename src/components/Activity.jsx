import React from "react";
import { useState, useEffect, useRef } from "react";
import './home.css';
import logo from './assets/logo.jpeg'
import API from "./api";



function Activity() {
const [selectedDay, setSelectedDay] = useState("");
const [AddActivity, setAddActivity] = useState(false);
const [activity, setActivity] = useState([]);
const fileRef = useRef(null);
const role = localStorage.getItem("role");
const [formData, setFormData] =
useState({
  day: "",
  workout_day: "",
  exercise_name: "",
  sets: "",
  description: "",
  image: null,
});



useEffect(() => {
  fetchActivity();
  
}, []);

const fetchActivity = async () => {
  try {
    const response = await API.get("/activity/view/");
   setActivity(response.data);
   console.log(response.data);

  } catch (error) {
    console.log(error);
    
  }
 
};
const handleChange = (e) => {
  const { name, value } = e.target;

  setFormData({
    ...formData,
    [name]: value,
  });
};
const handleSave = async () => {
  const data = new FormData();

  Object.keys(formData).forEach((key) => {
    data.append(key, formData[key]);
  });

  try {
    const response = await API.post("/activity/", data);

    alert("Activity Added Successfully");

    setFormData({
      day: "",
      workout_day: "",
      exercise_name: "",
      sets: "",
      description: "",
      image: null,
    });

    if (fileRef.current) {
      fileRef.current.value = "";
    }

    fetchActivity(); 
    setAddActivity(false);

  } catch (error) {
    console.log(error.response?.data);

    if (error.response?.status === 400) {
      alert("This exercise already exists for the selected day.");
    }
  }
};


const deleteActivity = async (id) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this activity?");
  if (!confirmDelete) return;
  try {
    await API.delete(`/activity/${id}/`);

    setActivity(
      activity.filter((item) => item.id !== id)
    );

    alert("Activity Deleted Successfully");
  } catch (error) {
    console.error(error);
    alert("Failed to Delete Activity");
  }
};

const filteredActivities = activity.filter(
  (item) => item.day === selectedDay
);


    return (<>
<nav className="navbar">
                <div className="logo-section">
                <img src={logo}/>
                <h2>{role}</h2>
                </div>
                
                <ul>
                  <li><a href={role==="Trainer" ? "/trainer":"/admin" }>Dashboard</a></li>
          <li><a href="/attendencesummary">Attendance</a></li>
          <li><a href="/Activity">Activity</a></li>
           {role !== "Trainer" && (
          <li><a href="/feessummary">Fee</a></li>
           )}
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
      {filteredActivities.map((activity, index) => (
        <div key={index} className="exercise-card">
        
            <img
        src={activity.image}
        alt={activity.exercise_name}
      />
        

          <h3>{activity.exercise_name}</h3>
          <p>{activity.description}</p>
          <p>{activity.sets}</p>
          <button onClick={() => deleteActivity(activity.id)}>Delete</button>
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

      <select className="gender-select" name="day" value={formData.day}
             onChange={handleChange}>
      <option value="">Select Day</option>
          <option value="Monday">Monday</option>
          <option value="Tuesday">Tuesday</option>
          <option value="Wednesday">Wednesday</option>
          <option value="Thursday">Thursday</option>
          <option value="Friday">Friday</option>
          <option value="Saturday">Saturday</option>
      </select>
      <select className="gender-select" name="workout_day" value={formData.workout_day}
             onChange={handleChange}>
        <option value="">Select Wrokout Day</option>
        <option value="Leg Day">Leg Day</option>
        <option value="Back Day">Back Day</option>
        <option value="Chest Day">Chest Day</option>
        <option value="Shoulder Day">Shoulder Day</option>
        <option value="Arm Day">Arm Day</option>
        <option value="Cardio & Core">Cardio & Core</option>
      </select>
 <input type="text" placeholder="Workout Activities" name="exercise_name" value={formData.exercise_name}
             onChange={handleChange}/>
 <input type="text" placeholder="Workout Set" name="sets" value={formData.sets}
             onChange={handleChange}/>
 <textarea placeholder="Leave us a description..." name="description" value={formData.description}
             onChange={handleChange}></textarea>
 <div className="profile-upload">
      <label>Referral Images</label>
      <input  ref={fileRef} type="file" accept="image/*" onChange={(e) =>
    setFormData({
      ...formData,
      image: e.target.files[0],
    })
  } />
    </div>

               
          <div className="popup-buttons">
        <button className="save-btn" onClick={handleSave}>
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