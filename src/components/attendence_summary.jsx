import './admin.css';
import logo from './assets/logo.jpeg';
import { useState, useEffect } from 'react';
import API from "./api";

function AttendenceSummary() {
    const [search, setSearch] = useState("");
    const [showReport, setShowReport] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const [monthReport, setMonthReport] = useState([]);
    const [dayReport, setDayReport] = useState([]);
    const role = localStorage.getItem("role");
    const [month, setMonth] = useState(
    new Date().getMonth() + 1
  );


useEffect(() => {
  fetchAttendance();
}, [month]);

const fetchAttendance = async () => {
  try {
    const response = await API.get(`/monthly/?month=${month}`);
   setMonthReport(response.data);
   console.log(response.data);

  } catch (error) {
    console.log(error);
    
  }
};

const fetchDayAttendance = async (userId) => {
  try {
    const response = await API.get(`/attendance/${userId}/?month=${month}`);
   setDayReport(response.data);
    setShowReport(true);

  } catch (error) {
    console.log(error);
  }
};

const filteredAttendance = monthReport.filter(
  (item) =>
    item.name
      .toLowerCase()
      .includes(search.toLowerCase())
);

    return(
        <>
        <nav className="navbar">
                <div className="logo-section">
                <img src={logo}/>
                <h2>{role}</h2>
                </div>
                <ul>
                <li><a href={role==="Trainer"? "/trainer" : "admin" }>Dashboard</a></li>
          <li><a href="/attendencesummary">Attendance</a></li>
          <li><a href="/Activity">Activity</a></li>
           {role !== "Trainer" && (
          <li><a href="/feessummary">Fee</a></li>
           )}
                </ul>
                
              </nav>
        <section className="attendance-history">
  <h2>Attendance History</h2>
  <div className="search-bar">
<input
      type="text"
      placeholder="🔍 Search members by name, phone..."
      value={search}
  onChange={(e) => setSearch(e.target.value)}
    />
    <select
  value={month}
  onChange={(e) => setMonth(e.target.value)}
>
  <option value="1">January</option>
  <option value="2">February</option>
  <option value="3">March</option>
  <option value="4">April</option>
  <option value="5">May</option>
  <option value="6">June</option>
  <option value="7">July</option>
  <option value="8">August</option>
  <option value="9">September</option>
  <option value="10">October</option>
  <option value="11">November</option>
  <option value="12">December</option>
</select>
    </div>
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Present Days</th>
        <th>Absent Days</th>
        <th>Attendance %</th>
        <th>Current Streak</th>
        <th>STATUS</th>
        <th>Details</th>
      </tr>
    </thead>

    <tbody>
      {filteredAttendance.map((member) => (
        <tr key={member.user_id}>
          <td>{member.name}</td>
    <td>{member.present_days}</td>
    <td>{member.absent_days}</td>
    <td>{member.attendance_percentage}%</td>
    <td>{member.current_streak}</td>
     <td>
         <span
    className={`status ${
      member.status === "Active"
        ? "activation"
        : "inactive"
    }`}
  >
    {member.status}
  </span>
        </td>
          <td><button className="save-btn" onClick={() => {
      setSelectedMember(member);
    fetchDayAttendance(member.user_id);
    }}>Day Waise</button></td>
        </tr>
      ))}
    </tbody>
  </table>
</section>
        {showReport && selectedMember && (
  <div className="popup-overlay">
    <div className="popup-card">

      <h2>{selectedMember?.name}- Weekly Report</h2>

      <table className="report-table">
        <thead>
          <tr>
            <th>Day</th>
            <th>In Time</th>
            <th>Out Time</th>
            <th>Total Hours</th>
          </tr>
        </thead>

        <tbody>
          {dayReport.map((item,index)=>(
            <tr key={index}>
              <td>{item.date}</td>
              <td>{item.check_in?.split(".")[0]}</td>
              <td>{item.check_out?.split(".")[0]}</td>
              <td>{item.total_hours?.split(".")[0]}</td>
            </tr>
          ))}
                 </tbody>
      </table>
          
      <button
        className="save-btn"
        onClick={() => setShowReport(false)}
      >
        Close
      </button>

    </div>
  </div>
)}
        </>


    )
}
export default AttendenceSummary