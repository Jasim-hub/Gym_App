import './admin.css';
import logo from './assets/logo.jpeg';
import { useState, useEffect } from "react";
import API from "./api";
import { data } from 'react-router-dom';

function AdminDashboard() {
    const [member, setMember] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
     const [showView, setShowView] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
    const [search, setSearch] = useState("");
  const [showIdPopup, setShowIdPopup] = useState(false);
const [newUserId, setNewUserId] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const [attendance, setAttendance] = useState([]);
const [showEdit, setShowEdit] = useState(false);
const [editData, setEditData] = useState({});
    const [formData, setFormData] = useState({
  name: "",
  email: "",
  countryCode: "",
  phone: "",
  date_of_birth: "",
  gender: "",
  password: "",
  profile_image: null,
});
const formatDate = (date) => {
  if (!date) return "";

  const d = new Date(date);

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  return `${day}-${month}-${year}`;
};
const openEditMember = (member) => {
  setEditData(member);
  setShowEdit(true);
};
const fullPhone =
  formData.countryCode + formData.phone;

console.log(fullPhone);
const handleChange = (e) => {
  const { name, value } = e.target;

  setFormData({
    ...formData,
    [name]: value,
  });
};
const handleEditChange = (e) => {
  setEditData({
    ...editData,
    [e.target.name]: e.target.value,
  });
};

const handleRegister = async () => {
for (const key in formData) {
    if (!formData[key]) {
      alert(`${key.replace("_", " ")} is required`);
      return;
    }
  }

  if (formData.password !== confirmPassword) {
    
    return;
  }
   
  const data = new FormData();

  Object.keys(formData).forEach((key) => {
    if (key !== "countryCode") {
      data.append(key, formData[key]);
    }
  });
  data.set(
    "phone",
    formData.countryCode + formData.phone
  );

  try {
    const response = await API.post("/members/create/", data);
    console.log(response.data);

    setNewUserId(response.data.user_id);
setShowIdPopup(true);
    setShowPopup(false);
  } 
  catch (error) {

  const errors = error.response?.data;

  console.log(errors);

  if (errors?.email) {
    alert("This email is already registered");
  }
  else if (errors?.phone) {
    alert("This phone number is already registered");
  }
  else {
    alert("Registration failed");
  }
}
  
};

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
const updateMember = async () => {
  try {
    await API.patch(`/members/${editData.id}/`, {
      name: editData.name,
      email: editData.email,
      phone: editData.phone,
      gender: editData.gender,
      date_of_birth: editData.date_of_birth,
    });

    alert("Member details updated successfully");
    setShowEdit(false);
    fetchMembers();

  } catch (error) {
    console.log(error.response?.data);
    alert("Failed to update member");
  }
};
const deleteActivity = async (id) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this Member detalis?");
  if (!confirmDelete) return;
  try {
    await API.delete(`/members/${id}/`);

    setMember(
      member.filter((item) => item.id !== id)
    );

    alert("Member detalis Deleted Successfully");
  } catch (error) {
    console.error(error);
    alert("Failed to Delete Member detalis");
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
          <h2>{member.length}</h2>
        </div>

        <div className="dashboard-card">
          <h3>Present Today</h3>
          <h2>{presentToday}</h2>
        </div>
        <div className="dashboard-card">
          <h3>Due Payments</h3>
          <h2>{duePayments.length}</h2>
          <p className="pendingp"><i class="fa-solid fa-triangle-exclamation"></i> pending</p>
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
        <td>{formatDate(members.joined_date)}</td>
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

          <button className="deactivate-btn" onClick={() => openEditMember(members)}>
            Edit
          </button>

          <button className="delete-btn" onClick={() => deleteActivity(members.id)}>
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
        name="name"
            value={formData.name}
             onChange={handleChange}
      />
<input
          type="email"
          placeholder="Email Address"
          name="email"
            value={formData.email}
             onChange={handleChange}
        />
      <div className="phone-group">
  <select name="countryCode"
            value={formData.countryCode}
             onChange={handleChange}>
    <option value=""></option>
    <option value="+91">🇮🇳 +91</option>
    <option value="+1">🇺🇸 +1</option>
    <option value="+44">🇬🇧 +44</option>
    <option value="+971">🇦🇪 +971</option>
    <option value="+966">🇸🇦 +966</option>
  </select>

  <input
    type="tel"
    placeholder="Phone Number"
    name="phone"
            value={formData.phone}
             onChange={handleChange}
  />
</div>
<div className="admin-age-gender-row">
   <input
      type="date"
      name="date_of_birth"
            value={formData.date_of_birth}
             onChange={handleChange}
      /><select className="gender-select" name="gender"
            value={formData.gender}
             onChange={handleChange}>
      <option value="">Select Gender</option>
      <option value="Male">Male</option>
      <option value="Female">Female</option>
      <option value="Other">Other</option>
    </select>
    </div>
    <input
          type="password"
          placeholder="Password"
          name="password"
            value={formData.password}
             onChange={handleChange}
        />
        <input
            type="password"
            placeholder="Confirm Password"
            name="confirmpassword"
            value={confirmPassword}
  onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <div className="profile-upload">
      <input type="file" name="image" accept="image/*" onChange={(e) =>
    setFormData({
      ...formData,
      profile_image: e.target.files[0],
    })
  }/>
    </div>

      

      

      <div className="popup-buttons">
        <button className="save-btn"  onClick={handleRegister}>
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
{showEdit && (
  <div className="popup-overlay">
    <div className="popup-card">
      <h2>Edit Member Details</h2>

      <input
        type="text"
        name="name"
        value={editData.name || ""}
        onChange={handleEditChange}
        placeholder="Name"
      />

      <input
        type="email"
        name="email"
        value={editData.email || ""}
        onChange={handleEditChange}
        placeholder="Email"
      />

      <input
        type="text"
        name="phone"
        value={editData.phone || ""}
        onChange={handleEditChange}
        placeholder="Phone"
      />

      <select
        name="gender"
        value={editData.gender || ""}
        onChange={handleEditChange}
      >
        <option value="">Select Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
      </select>

      <input
        type="date"
        name="date_of_birth"
        value={editData.date_of_birth || ""}
        onChange={handleEditChange}
      />

      <div className="popup-buttons">
        <button onClick={updateMember} className='save-btn'>
          Save Changes
        </button>

        <button onClick={() => setShowEdit(false)} className="save-btn">
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
        src={selectedMember.profile_image}
        alt={selectedMember.name}
        className="member-photo"
      />

      <p><strong>ID:</strong> {selectedMember.user_id}</p>
      <p><strong>Name:</strong> {selectedMember.name}</p>
      <p><strong>Phone:</strong> {selectedMember.phone}</p>
      <p><strong>Email:</strong> {selectedMember.email}</p>
      <p><strong>Date of Brith:</strong> {formatDate(selectedMember.date_of_birth)}</p>
      <p><strong>Gender:</strong> {selectedMember.gender}</p>
      <p><strong>Status:</strong> {selectedMember.status}</p>
      <p><strong>Joined:</strong> {formatDate(selectedMember.joined_date)}</p>

      <button
        className="save-btn"
        onClick={() => setShowView(false)}
      >
        Close
      </button>

    </div>
  </div>
)}
{showIdPopup && (
  <div className="popup-overlay">
    <div className="popup-card">
      <h2>Registration Successful 🎉</h2>

      <p>Your Member ID</p>

      <h1>{newUserId}</h1>

      <button onClick={() => setShowIdPopup(false)}>
        OK
      </button>
    </div>
  </div>
)}
    </>
  );
}

export default AdminDashboard;