import './admin.css';
import logo from './assets/logo.jpeg';
import { useState } from 'react';
import profileImage from './assets/logo.jpeg'

function AdminDashboard() {
    const [showPopup, setShowPopup] = useState(false);
     const [showView, setShowView] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const [search, setSearch] = useState("");

const members = [
  {
    id: "M001",
    name: "Jasim",
    phone: "9876543210",
    email:"jasim@gmail.com",
    plan: "Premium",
    status: "Active",
    joined: "06-01-2026",
    age:"30",
    image: profileImage,
  },
  {
    id: "M002",
    name: "Roshin",
    phone: "9876543210",
    email:"jasim@gmail.com",
    plan: "Premium",
    status: "Active",
    joined: "06-01-2026",
    age:"30",
    image: profileImage,
  },
  {
    id: "M003",
    name: "Sujith",
    phone: "9876543210",
    email:"jasim@gmail.com",
    plan: "Premium",
    status: "Active",
    joined: "06-01-2026",
    age:"30",
    image: profileImage,
  },
  {
    id: "M004",
    name: "Najin",
    phone: "9876543210",
    email:"jasim@gmail.com",
    plan: "Premium",
    status: "Active",
    joined: "06-01-2026",
    age:"30",
    image: profileImage,
  },
 
 
];


const filteredMembers = members.filter((member) =>
  member.name.toLowerCase().includes(search.toLowerCase()) ||
  member.phone.includes(search)
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
          <h2>150</h2>
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
        {filteredMembers.map((member) => ( 
      <tr key={member.id}>
        <td>{member.id}</td>
        <td>{member.name}</td>
        <td>{member.phone}</td>
        <td>
          <span className={
  member.plan === "Basic"
    ? "basic"
    : member.plan === "Premium"
    ? "premium"
    : "elite"
}>
            {member.plan}
          </span>
        </td>
        <td>{member.joined}</td>
        <td>
         <span
    className={`status ${
      member.status === "Active"
        ? "active"
        : "inactive"
    }`}
  >
    {member.status}
  </span>
        </td>
        <td>
          <button className="view-btn"  onClick={() => {
    setSelectedMember(member);
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
<div className="age-gender-row">
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
        src={selectedMember.image}
        alt={selectedMember.name}
        className="member-photo"
      />

      <p><strong>ID:</strong> {selectedMember.id}</p>
      <p><strong>Name:</strong> {selectedMember.name}</p>
      <p><strong>Phone:</strong> {selectedMember.phone}</p>
      <p><strong>Email:</strong> {selectedMember.email}</p>
      <p><strong>Age:</strong> {selectedMember.age}</p>
      <p><strong>Plan:</strong> {selectedMember.plan}</p>
      <p><strong>Status:</strong> {selectedMember.status}</p>
      <p><strong>Joined:</strong> {selectedMember.joined}</p>

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