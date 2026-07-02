import './admin.css';
import logo from './assets/logo.jpeg';
import { useState, useEffect } from "react";
import API from "./api";
import { data } from 'react-router-dom';

function TrainerDashboard() {
    const [member, setMember] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
     const [showView, setShowView] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [search, setSearch] = useState("");
const [attendance, setAttendance] = useState([]);


  

useEffect(() => {
  fetchMembers();
  fetchAttendance();
}, []);

const fetchMembers = async () => {
  try {
    const memberRes = await API.get("/members/");
    const reportRes = await API.get("/monthly/");
    const feesRes = await API.get(`/membership/view/`);

    const mergedData = memberRes.data.map(
      (member) => {

        const report = reportRes.data.find(
          (r) => r.user_id === member.user_id
        );
        const fees=feesRes.data.find(
    (r) => r.member_name === member.name
  );

        return {
          ...member,
          status: report?.status || "Inactive",
          plan: fees?.plan || "-",
          feesstatus: fees?.status || "Expired"
        };
      }
    );

    setMember(mergedData);

  } catch (error) {
    console.log(error);
  }
};
console.log(member)

const fetchAttendance = async () => {
  try {
    const response = await API.get(
      "/attendance/"
    );

    setAttendance(response.data);

  } catch (error) {
    console.log(error);
  }
};



const today = new Date()
  .toISOString()
  .split("T")[0];

const presentToday = attendance.filter(
  (item) => item.date === today
).length;

const totalActiveMembers =
  member.filter(
    (member) => member.status === "Active"
  ).length;
  const duePayments = member.filter(
  (item) =>
    item.feesstatus === "Inactive" ||
    item.feesstatus === "Expired" ||
    item.plan === "No Plan"
);
const filteredMembers = member.filter((members) =>
  members.name.toLowerCase().includes(search.toLowerCase()) ||
  members.phone.includes(search)
);

  return (
<>
<nav className="navbar">
        <div className="logo-section">
        <img src={logo}/>
        <h2>Trainer</h2>
        </div>
        <ul>
          <li><a href="/trainer">Dashboard</a></li>
          <li><a href="/attendencesummary">Attendance</a></li>
          <li><a href="/Activity">Activity</a></li>
          </ul>
        
      </nav>

    <section className="admin-dashboard">
 

      <div className="dashboard-grid">

        <div className="dashboard-card">
          <h3>Total Members</h3>
          <h2>{member.length}</h2>
        </div>

        <div className="dashboard-card">
          <h3>Present Today</h3>
          <h2>{presentToday}</h2>
        </div>
        

        <div className="dashboard-card">
          <h3>Active Members</h3>
          <h2>{totalActiveMembers}</h2>
        </div>

        
      </div>
    </section>
    <div className="member-management">
      <h2>Member Details</h2>

  <div className="search-bar">
    <input
      type="text"
      placeholder="🔍 Search members by name, phone..."
      value={search}
  onChange={(e) => setSearch(e.target.value)}
    />
    </div>

  <table className="member-table">
    <thead>
      <tr>
        <th>ID</th>
        <th>NAME</th>
        <th>PHONE</th>
        <th>PLAN</th>
        <th>JOINED</th>
        <th>STATUS</th>
        <th>ACTIONS</th>
      </tr>
    </thead>

    <tbody>
        {filteredMembers.map((members) => ( 
      <tr key={members.user_id}>
        <td>{members.user_id}</td>
        <td>{members.name}</td>
        <td>{members.phone}</td>
        <td>
          <span className={
  members.plan === "Basic"
    ? "basic"
    : members.plan === "Premium"
    ? "premium"
    : "elite"
}>
            {members.plan}
          </span>
        </td>
        <td>{members.joined_date}</td>
        <td>
         <span
    className={`status ${
      members.status === "Active"
        ? "activation"
        : "inactive"
    }`}
  >
    {members.status}
  </span>
        </td>
        <td>
          <button className="view-btn"  onClick={() => {
    setSelectedMember(members);
    setShowView(true);
    console.log(selectedMember);
  }}>
            View
          </button>
        </td>
      </tr>))}
    </tbody>
  </table>

</div>



{showView && selectedMember && (
  <div className="popup-overlay">
    <div className="viewpopup-card">

      <h2>Member Details</h2>

      <img
        src={selectedMember.profile_image}
        alt={selectedMember.name}
        className="member-photo"
      />

      <p><strong>ID:</strong> {selectedMember.user_id}</p>
      <p><strong>Name:</strong> {selectedMember.name}</p>
      <p><strong>Phone:</strong> {selectedMember.phone}</p>
      <p><strong>Email:</strong> {selectedMember.email}</p>
      <p><strong>Date of Brith:</strong> {selectedMember.date_of_birth}</p>
      <p><strong>Gender:</strong> {selectedMember.gender}</p>
      <p><strong>Status:</strong> {selectedMember.status}</p>
      <p><strong>Joined:</strong> {selectedMember.joined_date}</p>

      <button
        className="save-btn"
        onClick={() => setShowView(false)}
      >
        Close
      </button>

    </div>
  </div>
)}
    </>
  );
}

export default TrainerDashboard;