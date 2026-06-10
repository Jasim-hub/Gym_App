import './admin.css';
import logo from './assets/logo.jpeg';
import { useState } from 'react';

function AttendenceSummary() {
    const [search, setSearch] = useState("");
    const [showReport, setShowReport] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
  
    const attendanceData = [
  {
    name: "Jasim",
    Present: "26",
    Absent: "4",
    Attendance: "88%",
    Current: "10 day",
    report: [
      { day: "Mon", inTime: "06:00 AM", outTime: "08:00 AM", hours: "2h" },
      { day: "Tue", inTime: "06:15 AM", outTime: "08:15 AM", hours: "2h" },
      { day: "Wed", inTime: "06:00 AM", outTime: "07:30 AM", hours: "1h 30m" },]
  },
  {
    name: "Roshin",
    Present: "26",
    Absent: "4",
    Attendance: "88%",
    Current: "10 day",
    report: [
      { day: "Mon", inTime: "06:00 AM", outTime: "08:00 AM", hours: "2h" },
      { day: "Tue", inTime: "06:15 AM", outTime: "08:15 AM", hours: "5h" },
      { day: "Wed", inTime: "06:00 AM", outTime: "07:30 AM", hours: "1h 30m" },]
    },
  {
    name: "Sujith",
    Present: "26",
    Absent: "4",
    Attendance: "88%",
    Current: "10 day",
    report: [
      { day: "Mon", inTime: "06:00 AM", outTime: "08:00 AM", hours: "2h" },
      { day: "Tue", inTime: "06:15 AM", outTime: "08:15 AM", hours: "2h" },
      { day: "Wed", inTime: "06:00 AM", outTime: "07:30 AM", hours: "1h 30m" },]
    },
];

const totalHours = selectedMember
  ? selectedMember.report.reduce(
      (total, item) => total + parseFloat(item.hours),
      0
    )
  : 0;
const filteredMembers = attendanceData.filter((member) =>
  member.name.toLowerCase().includes(search.toLowerCase()) 
  );

    return(
        <>
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
    /></div>
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Present Days</th>
        <th>Absent Days</th>
        <th>Attendance %</th>
        <th>Current Streak</th>
        <th>details</th>
      </tr>
    </thead>

    <tbody>
      {filteredMembers.map((member) => (
        <tr key={member.name}>
          <td>{member.name}</td>
          <td>{member.Present}</td>
          <td>{member.Absent}</td>
          <td>{member.Attendance}</td>
          <td>{member.Current}</td>
          <td><button className="save-btn" onClick={() => {
      setSelectedMember(member);
      setShowReport(true);
    }}>day waise</button></td>
        </tr>
      ))}
    </tbody>
  </table>
</section>
        {showReport && selectedMember && (
  <div className="popup-overlay">
    <div className="popup-card">

      <h2>{selectedMember.name} - Weekly Report</h2>

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
          {selectedMember.report.map((item,index)=>(
            <tr key={index}>
              <td>{item.day}</td>
              <td>{item.inTime}</td>
              <td>{item.outTime}</td>
              <td>{item.hours}</td>
            </tr>
          ))}
                 </tbody>
      </table>
          <p>Weekly Total: {totalHours} Hours</p>
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