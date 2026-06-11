import './admin.css';
import logo from './assets/logo.jpeg';
import { useState, useEffect } from "react";
import profileImage from './assets/logo.jpeg'
import API from "./api";
import { data } from 'react-router-dom';

function AdminDashboard() {
    const [member, setMember] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
     const [showView, setShowView] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
    const [search, setSearch] = useState("");

useEffect(() => {
  fetchMember();
}, []);

const fetchMember = async () => {
  try {
    const response = await API.get(`/members/`);
   setMember(response.data);

  } catch (error) {
    console.log(error);
  }
};
console.log(setMember)
const filteredMembers = member.filter((members) =>
  members.name.toLowerCase().includes(search.toLowerCase()) ||
  members.phone.includes(search)
);

  return (
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

    <section className="admin-dashboard">
 

      <div className="dashboard-grid">

        <div className="dashboard-card">
          <h3>Total Members</h3>
          <h2></h2>
        </div>

        <div className="dashboard-card">
          <h3>Present Today</h3>
          <h2>85</h2>
        </div>
        <div className="dashboard-card">
          <h3>Due Payments</h3>
          <h2>85</h2>
          <p>pending</p>
        </div>

        <div className="dashboard-card">
          <h3>Active Plans</h3>
          <h2>120</h2>
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
    <button onClick={() => setShowPopup(true)}>Add Member</button>
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
          {/* <span className={
  member.plan === "Basic"
    ? "basic"
    : member.plan === "Premium"
    ? "premium"
    : "elite"
}>
            {member.plan}
          </span> */}
        </td>
        <td>{members.joined_date}</td>
        <td>
         {/* <span
    className={`status ${
      member.status === "Active"
        ? "activation"
        : "inactive"
    }`}
  >
    {member.status}
  </span> */}
        </td>
        <td>
          <button className="view-btn"  onClick={() => {
    setSelectedMember(members);
    setShowView(true);
  }}>
            View
          </button>

          <button className="deactivate-btn">
            Deactivate
          </button>

          <button className="delete-btn">
            Delete
          </button>
        </td>
      </tr>))}
    </tbody>
  </table>

</div>

{showPopup && (
  <div className="popup-overlay">
    <div className="popup-card">

      <h2>Add New Member</h2>

      <input
        type="text"
        placeholder="Full Name"
      />
<input
          type="email"
          placeholder="Email Address"
        />
      <div className="phone-group">
  <select>
    <option value="+91">🇮🇳 +91</option>
    <option value="+1">🇺🇸 +1</option>
    <option value="+44">🇬🇧 +44</option>
    <option value="+971">🇦🇪 +971</option>
    <option value="+966">🇸🇦 +966</option>
  </select>

  <input
    type="tel"
    placeholder="Phone Number"
  />
</div>
<div className="admin-age-gender-row">
   <input
      type="date"
      /><select className="gender-select">
      <option value="">Select Gender</option>
      <option value="male">Male</option>
      <option value="female">Female</option>
      <option value="other">Other</option>
    </select>
    </div>
    <input
          type="password"
          placeholder="Password"
        />
        <input
            type="password"
            placeholder="Confirm Password"
          />
          <div className="profile-upload">
      <label>Profile Picture</label>
      <input type="file" accept="image/*" />
    </div>

      

      

      <div className="popup-buttons">
        <button className="save-btn">
          Save Member
        </button>

        <button
          className="save-btn"
          onClick={() => setShowPopup(false)}
        >
          Close
        </button>
      </div>

    </div>
  </div>
)}
{showView && selectedMember && (
  <div className="popup-overlay">
    <div className="viewpopup-card">

      <h2>Member Details</h2>

      <img
        src={`http://127.0.0.1:8000${selectedMember.profile_image}`}
        alt={selectedMember.name}
        className="member-photo"
      />

      <p><strong>ID:</strong> {selectedMember.user_id}</p>
      <p><strong>Name:</strong> {selectedMember.name}</p>
      <p><strong>Phone:</strong> {selectedMember.phone}</p>
      <p><strong>Email:</strong> {selectedMember.email}</p>
      <p><strong>Date of Brith:</strong> {selectedMember.date_of_birth}</p>
      <p><strong>Gender:</strong> {selectedMember.gender}</p>
      {/* <p><strong>Status:</strong> {selectedMember.status}</p> */}
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

export default AdminDashboard;