import './admin.css';
import logo from './assets/logo.jpeg';
import { useState } from 'react';


function FeeSummary() {
    const [search, setSearch] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    
  
    const FeeData = [
  {
    id:"P001",
    Name: "Jasim",
    Amount: "2600",
    Plan: "Basic",
    StartDate: "10-02-2024",
    EndDate: "10-02-2024",
    Remaining: "20",
    Method: "Gpay",
    Status: "Pay",
    
  },
  {
    id:"P002",
    Name: "Sujith",
    Amount: "2600",
    Plan: "Premium",
    StartDate: "10-02-2024",
    EndDate: "10-02-2024",
    Remaining: "20",
    Method: "Gpay",
    Status: "Pay",
    },
  {
    id:"P003",
    Name: "Roshin",
    Amount: "2600",
    Plan: "Elite",
    StartDate: "10-02-2024",
    EndDate: "10-02-2024",
    Remaining: "20",
    Method: "Gpay",
    Status: "pending",
    },
];

const filteredMembers = FeeData.filter((member) =>
  member.Name.toLowerCase().includes(search.toLowerCase()) 
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
              <div className="feedashboard-grid">

        <div className="dashboard-card">
          <h3>Total Members</h3>
          <h2>150</h2>
        </div>

        
        <div className="dashboard-card">
          <h3>Due Payments</h3>
          <h2>10</h2>
          <p>pending</p>
        </div>

        <div className="dashboard-card">
          <h3>Total Collected</h3>
          <h2>18,00,000</h2>
        </div>
</div>
        <section className="attendance-history">
  <h2>Fee History</h2>
  <div className="search-bar">
<input
      type="text"
      placeholder="🔍 Search members by name..."
      value={search}
  onChange={(e) => setSearch(e.target.value)}
    />
    <button onClick={() => setShowPopup(true)}>RECORD PAYMENT</button></div>
  <table>
    <thead>
      <tr>
        <th>Payment ID</th>
        <th>Name</th>
        <th>Amount</th>
        <th>plan</th>
        <th>Start Date</th>
        <th>End Date</th>
        <th>Remaining days</th>
        <th>Method</th>
        <th>Status</th>
      </tr>
    </thead>

    <tbody>
      {filteredMembers.map((member) => (
        <tr key={member.id}>
          <td>{member.id}</td>
          <td>{member.Name}</td>
          <td>{member.Amount}</td>
          <td><span className={
  member.Plan === "Basic"
    ? "basic"
    : member.Plan === "Premium"
    ? "premium"
    : "elite"
}>
            {member.Plan}</span></td>
          <td>{member.StartDate}</td>
          <td>{member.EndDate}</td>
          <td>{member.Remaining} Days</td>
          <td>{member.Method}</td>
          <td><span
    className={`status ${
      member.Status === "Pay"
        ? "activation"
        : "pending"
    }`}
  >
    {member.Status}
  </span></td>
            </tr>
      ))}
    </tbody>
  </table>
</section>
        {showPopup && (
  <div className="popup-overlay">
    <div className="popup-card">

      <h2>RECORD PAYMENT</h2>

      <select className="gender-select">
      <option value="">Select Member</option>
      {FeeData.map((member) => (
    <option key={member.id} value={member.Name}>
      {member.Name}
    </option>
  ))}
      </select>
      <select className="gender-select">
        <option value="">Select plan</option>
        <option value="Basic">Basic plan</option>
        <option value="Premium">Premium plan</option>
        <option value="Elite">Elite Plan</option>
      </select>
 <input type="date"/>
          <select className="gender-select">
        <option value="">Select Method</option>
        <option value="Cash">Cash</option>
        <option value="Gpay">Gpay</option>
        <option value="Netbanking">Netbanking</option>
      </select>
     
          <div className="popup-buttons">
        <button className="save-btn">
          Save Payment
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

      </>


    )
}
export default FeeSummary;