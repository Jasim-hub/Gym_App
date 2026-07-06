import React from "react";
import { useState, useEffect, useRef } from "react";
import './home.css';
import logo from './assets/logo.jpeg'
import API from "./api";



function Activity() {
const [selectedDay, setSelectedDay] = useState("");
const [AddActivity, setAddActivity] = useState(false);
const [members, setMembers]=useState([]);
const [workoutDays, setWorkoutDays]=useState([]);
const [allowActivity, setAllowActivity] = useState(false);
const [memberName, setMemberName] = useState("");
const [showAlert, setShowAlert] = useState(false);
const [alertMessage, setAlertMessage] = useState("");
const [formActivity, setFormActivity] =
useState({
  member_day: "",
  workout_day: "",
  member_id: "",
    });
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
 fetchMembers(); 
 fetchActivityDay();

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

    
    setAlertMessage("Activity Added Successfully");
setShowAlert(true);

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
      
      setAlertMessage("This exercise already exists for the selected day.");
setShowAlert(true);
    }
  }
};
 

  const fetchMembers = async () => {
    try {
      const response = await API.get("/members/");
      setMembers(response.data);
    } catch (error) {
      console.log(error);
    }
  };


const handleassign = async () => {
  const data = new FormData();

  Object.keys(formActivity).forEach((key) => {
    data.append(key, formActivity[key]);
  });

  try {
    const response = await API.post("/assign-workout/", data);

    
    setAlertMessage("Workout assigned successfully ✅");
setShowAlert(true);

    setFormActivity({member_day: "",
  workout_day: "",
  member_id: "",  
      });

    if (fileRef.current) {
      fileRef.current.value = "";
    }

    fetchActivity(); 
    setAllowActivity(false);

  } catch (error) {
      console.log(error.response?.data || error);
      setAlertMessage(error.response?.data?.error || "Failed to assign workout");
setShowAlert(true);
      
    
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

    
    setAlertMessage("Activity Deleted Successfully");
setShowAlert(true);
  } catch (error) {
    console.error(error);
    setAlertMessage("Failed to Delete Activity");
setShowAlert(true);
  }
};

const filteredActivities = activity.filter(
  (item) => item.workout_day === selectedDay
);

const fetchActivityDay = async () => {
  try {
    const response = await API.get(`/member-workout/`);
   setWorkoutDays(response.data);
   console.log(response.data);

  } catch (error) {
    console.log(error);
    
  }
 
};


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
      <option value="">Select Wrokout Day</option>
        <option value="Leg Day">Leg Day</option>
        <option value="Back Day">Back Day</option>
        <option value="Chest Day">Chest Day</option>
        <option value="Shoulder Day">Shoulder Day</option>
        <option value="Arm Day">Arm Day</option>
        <option value="Cardio & Core">Cardio & Core</option>
      </select>
                </ul>
                <div className="popup-buttons">
                <button onClick={() => setAddActivity(true)}>Add Activity</button>
                
                </div>
              </nav>
              {role !== "Admin" && (
 <>
 <table className="assign-table">
    <thead>
      <tr>
        <th>ID</th>
        <th>NAME</th>
        <th>MONDAY</th>
        <th>TUESDAY</th>
        <th>WEDNESDAY</th>
        <th>THURSDAY</th>
        <th>FRIDAY</th>
        <th>SATURDAY</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      {workoutDays.map((work)=>(
        <tr key={work.user_id}>
          <td>{work.user_id}</td>
          <td>{work.name}</td>
          <td>{work.Monday || "-"}</td>
          <td>{work.Tuesday || "-"}</td>
          <td>{work.Wednesday || "-"}</td>
          <td>{work.Thursday || "-"}</td>
          <td>{work.Friday || "-"}</td>
          <td>{work.Saturday || "-"}</td>
          <td><button className="save-btn" onClick={() => {setAllowActivity(true);
            setFormActivity({
        ...formActivity,
        member_id: work.user_id,
      });
      setMemberName(work.name)
          }}
            >Assign Activity</button></td>
          </tr>
      ))}
    </tbody>
</table>
   </>      )} 
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

{allowActivity && (
  <div className="popup-overlay">
    <div className="popup-card">

      <h2>Allow Activity for {memberName}</h2>
      
<select className="gender-select" name="member_day" value={formActivity.member_day}
        onChange={(e) =>
          setFormActivity({ ...formActivity, member_day: e.target.value })
        }>
      <option value="">Select member</option>
          <option value="Monday">Monday</option>
          <option value="Tuesday">Tuesday</option>
          <option value="Wednesday">Wednesday</option>
          <option value="Thursday">Thursday</option>
          <option value="Friday">Friday</option>
          <option value="Saturday">Saturday</option>
      </select>
      
      <select className="gender-select" name="workout_day" value={formActivity.workout_day}
        onChange={(e) =>
          setFormActivity({ ...formActivity, workout_day: e.target.value })
        }>
        <option value="">Select Wrokout Day</option>
        <option value="Leg Day">Leg Day</option>
        <option value="Back Day">Back Day</option>
        <option value="Chest Day">Chest Day</option>
        <option value="Shoulder Day">Shoulder Day</option>
        <option value="Arm Day">Arm Day</option>
        <option value="Cardio & Core">Cardio & Core</option>
      </select>
  
          <div className="popup-buttons">
        <button className="save-btn" onClick={handleassign}>
          Assign Workout
        </button>

        <button
          className="save-btn"
          onClick={() => setAllowActivity(false)}
        >
          Close
        </button>
      </div>

    </div>
  </div>
)}
{showAlert && (
  <div className="alert-overlay">
    <div className="alert-card">
      <h3>Notification</h3>

      <p>{alertMessage}</p>

      <button
        onClick={() => setShowAlert(false)}
      >
        OK
      </button>
    </div>
  </div>
)}

      </>
    )

}
export default Activity;