import './admin.css';
import logo from './assets/logo.jpeg';
import { useState, useEffect} from 'react';
import API from './api';

function FeeSummary() {
    const [search, setSearch] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [feeData, setFeeData] = useState([]);
    const [alertMessage, setAlertMessage] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [paymentData, setPaymentData] = useState({
  user_id: "",
  name: "",
  plan: "",
  payment_date: "",
  payment_mode: "",
 

});
const getValidity = (plan) => {
  if (plan === "Basic") return 1;
  if (plan === "Premium") return 6;
  if (plan === "Elite") return 12;
  return 0;
};

const getAmount = (plan) => {
  if (plan === "Basic") return 1300;
  if (plan === "Premium") return 4500;
  if (plan === "Elite") return 7500;
  return 0;
};

  
      useEffect(() => {
  fetchMembership();
}, []);
  const fetchMembership = async () => {
  try {
    const memberRes = await API.get("/members/");
    const reportRes = await API.get(`/membership/view/`);

    const mergedData = memberRes.data.map((member) => {

  const report = reportRes.data.find(
    (r) => r.member_name === member.name
  );

  return {
    ...member,
        plan: report?.plan || "No Plan",
        amount: report?.amount || 0,
        payment_mode: report?.payment_mode || "-",
        payment_date: report?.payment_date || "-",
        expiry_date: report?.expiry_date || "-",
        remaining_days: report?.remaining_days ?? "-",
        status: report?.status || "Inactive",
        payment_id:report?.payment_id || "-"
    

  };
});

    setFeeData(mergedData);

  } catch (error) {
    console.log(error);
  }
};
const savePayment = async () => {
  try {
    await API.post("/payment/save/", { ...paymentData,
      amount: getAmount(paymentData.plan),
      validity: getValidity(paymentData.plan),});

    alert("Payment Recorded Successfully ✅");

    setShowPopup(false);

    fetchMembership();
  } catch (error) {
    console.log(error);
      setAlertMessage(`You already have an active plan. You can renew only before 5 days of expiry.`);
setShowAlert(true);
  }
};
const handleUserIdChange = (e) => {
  const selectedUserId = e.target.value;

  const selectedMember = feeData.find(
    (member) => member.user_id === selectedUserId
  );

  setPaymentData({
    ...paymentData,
    user_id: selectedUserId,
    name: selectedMember ? selectedMember.name : "",
  });
};

  const total_collected = feeData.reduce(
  (total, item) => total + Number(item.amount),
  0
);
const duePayments = feeData.filter(
  (item) =>
    item.status === "Inactive" ||
    item.status === "Expired" ||
    item.plan === "No Plan"
);
const handleChange = (e) => {
  setPaymentData({
    ...paymentData,
    [e.target.name]: e.target.value,
  });
};
console.log(feeData)

const filteredMembers = feeData.filter((member) =>
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
              <div className="feedashboard-grid">

        <div className="dashboard-card">
          <h3>Total Members</h3>
          <h2>{feeData.length}</h2>
        </div>

        
        <div className="dashboard-card">
          <h3>Due Payments</h3>
          <h2>{duePayments.length}</h2>
          <p>pending</p>
        </div>

        <div className="dashboard-card">
          <h3>Total Collected</h3>
          <h2>{total_collected}</h2>
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
          <td>{member.payment_id}</td>
          <td>{member.name}</td>
          <td>{member.amount}</td>
          <td><span className={
  member.plan === "Basic"
    ? "basic"
    : member.plan === "Premium"
    ? "premium" 
    : member.plan === "Elite" ? "elite" :""
}>
            {member.plan}</span></td>
          <td>{member.payment_date}</td>
          <td>{member.expiry_date}</td>
          <td>{member.remaining_days} Days</td>
          <td>{member.payment_mode}</td>
          <td><span
    className={`status ${
      member.status === "Paid"
        ? "activation":member.status ==="Inactive"
        ? "inactive" : "pending"
    }`}
  >
    {member.status}
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

      <select
  className="gender-select"
  name="user_id"
  value={paymentData.user_id}
  onChange={handleUserIdChange}
>
  <option value="">Select User ID</option>

  {feeData.map((member) => (
    <option
      key={member.id}
      value={member.user_id}
    >
      {member.user_id}
    </option>
  ))}
</select>
<input
  type="text"
  value={paymentData.name}
  placeholder="Member Name"
  readOnly
/>
      <select
  name="plan"
  value={paymentData.plan}
  onChange={(e) =>
    setPaymentData({
      ...paymentData,
      plan: e.target.value,
    })
  }
>
        <option value="">Select plan</option>
        <option value="Basic">Basic plan</option>
        <option value="Premium">Premium plan</option>
        <option value="Elite">Elite Plan</option>
      </select>
 <input type="date" name="payment_date" value={paymentData.payment_date} onChange={handleChange}/>
          <select className="gender-select" name="payment_mode" value={paymentData.payment_mode} onChange={handleChange}>
        <option value="">Select Method</option>
        <option value="Cash">Cash</option>
        <option value="UPI">Gpay</option>
        <option value="Net_Banking">Netbanking</option>
      </select>
     
          <div className="popup-buttons">
        <button className="save-btn" onClick={savePayment}>
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
 {showAlert && (
  <div className="alert-overlay">
    <div className="alert-card">
      <h3>Notification</h3>
      <img
        src={logo}
        alt="Success"
      />

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
export default FeeSummary;