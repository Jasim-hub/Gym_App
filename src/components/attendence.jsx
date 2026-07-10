import React from "react";
import { useState, useEffect } from "react";
import './home.css';
import API from "./api";
import Footer from "./footer";

function AttendenceManagement() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAttendance, setShowAttendance] = useState(false);
 const [workouts, setWorkouts] = useState([]);
 const [workoutDay, setWorkoutDay] = useState("");
  const [inTime, setInTime] = useState("");
  const [outTime, setOutTime] = useState("");
  const [totalHours, setTotalHours] = useState("");
  const [attendanceReport, setAttendanceReport] = useState([]);
const [totalCheckins, setTotalCheckins] = useState(0);
const [avgAttendance, setAvgAttendance] = useState(0);
const [weeklyData, setWeeklyData] = useState([]);
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

const today = new Date();

const currentMonth = today.toLocaleString("default", {
  month: "long",
});

const currentYear = today.getFullYear();

const currentDate = today.getDate();

const firstDay = new Date(
  currentYear,
  today.getMonth(),
  1
).getDay();

const totalDays = new Date(
  currentYear,
  today.getMonth() + 1,
  0
).getDate();

const weekDays = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
];


useEffect(() => {
  getTodayAttendance();
  fetchActivity();
  fetchAttendanceReport();
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
      setTotalHours(
  todayAttendance.total_hours
    ? todayAttendance.total_hours.split(":").slice(0, 2).join(":")
    : "00:00"
);
    } else {
      setInTime("");
      setOutTime("");
      setShowAttendance(true);
    }

  } catch (error) {
    console.log(error);
  }
};
const fetchAttendanceReport = async () => {
  try {
    const member = JSON.parse(localStorage.getItem("member"));

    const response = await API.get(`/attendance/${member.user_id}/`);

    const currentMonthData = response.data.filter((item) => {
      const itemDate = new Date(item.date);

      return (
        itemDate.getMonth() === today.getMonth() &&
        itemDate.getFullYear() === today.getFullYear()
      );
    });

    setAttendanceReport(currentMonthData);

    const presentDays = currentMonthData.filter(
      (item) => item.status === "Present"
    ).length;

    setTotalCheckins(presentDays);

    setAvgAttendance(
      currentMonthData.length > 0
        ? ((presentDays / currentDate) * 100).toFixed(1)
        : 0
    );

    const weeks = [0, 0, 0, 0, 0];

    currentMonthData.forEach((item) => {
      const d = new Date(item.date).getDate();

      if (item.status === "Present") {
        if (d <= 7) weeks[0]++;
        else if (d <= 14) weeks[1]++;
        else if (d <= 21) weeks[2]++;
        else if (d <= 28) weeks[3]++;
        else weeks[4]++;
      }
    });

    setWeeklyData([
      { label: "W1", value: weeks[0] },
      { label: "W2", value: weeks[1] },
      { label: "W3", value: weeks[2] },
      { label: "W4", value: weeks[3] },
      { label: "W5", value: weeks[4] },
    ]);
    
  } catch (error) {
    console.log(error);
  }
};

const fetchActivity = async () => {
  try {
    const response = await API.get(`/member-workout/${member.user_id}/`);
   setWorkouts(response.data.activities);
   setWorkoutDay(response.data.workout_day);
   console.log(response.data);

  } catch (error) {
    console.log(error);
    
  }
 
};

const todayWorkouts = workoutDay
    return (<>
<nav className="navbar">
        <div className="logo-section">
        <img src={member.profile_image} alt='profile'/>
        <h2>{member.name}</h2>
        </div>
        <a
    className="menu-toggle"
    onClick={() => setMenuOpen((current) => !current)}
    
  >
    {menuOpen ? <i className="fa-solid fa-xmark"></i>
 : <i className="fa-solid fa-bars"></i>}
  </a>
        <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
          <li><a href="/home" onClick={() => setMenuOpen(false)}>Home</a></li>
          <li><a href="/attendence" onClick={() => setMenuOpen(false)}>Attendance</a></li>
          <li><a href="/fee" onClick={() => setMenuOpen(false)}>Fees</a></li>
          <li><a href="/home#contact" onClick={() => setMenuOpen(false)}>Contact</a></li>
          <li className="mobile-logout">
        <button onClick={() => setShowAttendance(true)}>Attendance Marking</button>
    </li>
        </ul>
        <button className="navlogout-btn"
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
              <button className="check" onClick={handleCheckIn}>
                Check In
              </button>
            ) : !outTime ? (
              <button className="check" onClick={handleCheckOut}>
                Check Out
              </button>
              
            ) : (
              <>
              <p className="success">
                Attendance Completed ✅.
                </p>
              <p className="success">
                Total Hours: {totalHours}
                </p>
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
      <section className="attendance-report">
      <div className="attendance-header">
        <h2>ATTENDANCE REPORT</h2>

        
      </div>

      <div className="report-grid">
        <div className="metrics-section">
          <div className="metric-box">
            <h4>KEY METRICS</h4>
            <p>Total Check-ins</p>
            <h2>{totalCheckins}</h2>
            </div>

          <div className="metric-box">
            <p>Avg. Daily Attendance</p>
            <h2>{avgAttendance}%</h2>
          </div>
          <div className="metric-box">
            <p>Today Workout Hour</p>
            <h2>{totalHours || "-"}</h2>
          </div>

                  </div>

        <div className="calendar-card">

  <div className="calendar-top">
    <h3>MONTHLY ATTENDANCE OVERVIEW</h3>
  </div>

  <h4>
    {currentMonth} {currentYear}
  </h4>

  <div className="calendar-grid">

    {weekDays.map((day) => (
      <div key={day} className="day-name">
        {day}
      </div>
    ))}

    {Array.from({ length: firstDay }).map((_, i) => (
      <div key={`empty-${i}`}></div>
    ))}

    {Array.from({ length: totalDays }).map((_, i) => (
      <div
        key={i}
        className={
  currentDate === i + 1
    ? "today"
    : attendanceReport.some(
        (item) =>
          new Date(item.date).getDate() === i + 1 &&
          item.status === "Present"
      )
    ? "present-day"
    : "day"
}
      >
        {i + 1}

        
      </div>
    ))}

  </div>

</div>

        <div className="chart-card">
          <div className="calendar-top">
            <h3>WEEKLY ATTENDANCE TRENDS</h3>
            </div>

          <h4>
    {currentMonth} {currentYear}
  </h4>

          <div className="bar-chart">
            {weeklyData.map((bar) => (
  <div className="bar-wrap" key={bar.label}>
    <div
      className="bar"
      style={{
        height: `${bar.value * 35 + 20}px`,
      }}
    >
      <span>{bar.value}</span>
    </div>
    <p>{bar.label}</p>
  </div>
))}
          </div>

          <p className="legend">🟧 Member Check-ins</p>
        </div>
      </div>
    </section>
      <section className="workout-section">
    <h2>Today's Fitness Mission:  {workoutDay || "Rest Day"}</h2>

    <div className="exercise-grid">
      {workouts.length > 0 ? (workouts.map((exercise, index) => (
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

<Footer />
      </>
    )

}
export default AttendenceManagement;