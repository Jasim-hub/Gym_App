import React from "react";
import './home.css';
import logo from './assets/logo.jpeg'
import basic from './assets/basic.jpeg'
import premium from './assets/premium.jpeg'
import elite from './assets/elite.jpeg'
import { useState, useEffect } from "react";
import Home from "./home";
import { Link, useNavigate } from "react-router-dom";
import API from "./api";
import logo1 from './assets/logo2.jpeg'



function FeeManagement() {
   const [showFee, setShowFee] = useState(false);
   const navigation=useNavigate();
   const [alertMessage, setAlertMessage] = useState("");
   const [showAlert, setShowAlert] = useState(false);
    const member = JSON.parse(
  localStorage.getItem("member")
);
const [membership, setMembership] = useState({});

  const handleRenw = () =>{
    navigation ("/fee")
  };

  useEffect(() => {
  fetchMembership();
}, []);
  const fetchMembership = async () => {
  try {
    const response = await API.get(
      `/membership/${member.user_id}/`
    );

    setMembership(response.data);

  } catch (error) {
    console.log(error);
  }
};


const handlePayment = async (planName, amount, validity,) => {
  try {
    const membershipRes = await API.get(`/membership/${member.user_id}/`);
    const current = membershipRes.data;
    console.log(membershipRes)

    if (
      current.status === "Paid" &&
      Number(current.remaining_days) > 5
    ) {
      setAlertMessage(
        `You already have an active ${current.plan} plan. You can renew only when 5 or fewer days are remaining.`
      );
      setShowAlert(true);
      return;
    }
    else{
    const orderRes = await API.post("/payment/create-order/", {
      amount: amount,
    });

    const options = {
      key: orderRes.data.key,
      amount: orderRes.data.amount,
      currency: "INR",
      order_id: orderRes.data.order_id,
      name: "Infinity Wellness Hub",
      description: `${planName} Membership`,

      prefill: {
        name: member.name,
        email: member.email,
        contact: member.phone,
      },

      handler: async function (response) {
        await API.post("/payment/save/", {
          user_id: member.user_id,
          plan: planName,
          amount: amount,
          validity: validity,
          payment_mode: response.payment_mode,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
        });

        setAlertMessage(`${planName} Activated Successfully ✅`);
        setShowAlert(true);
        fetchMembership();
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  }
  } catch (error) {
    setAlertMessage(error.response?.data?.error || "Payment failed");
    setShowAlert(true);
    console.log(error.response?.data || error);
  }
  
};  return (
    <div>
<nav className="navbar">
        <div className="logo-section">
        <img src={member.profile_image} alt='profile'/>
        <h2>{member.name}</h2>
        </div>
        <ul>
          <li><a href="/home">Home</a></li>
          <li><a href="/attendence">Attendance</a></li>
          <li><a href="/fee">Fees</a></li>
          <li><a href="/home#contact">Contact</a></li>
        </ul>
         <button onClick={() => setShowFee(true)}>
  My Membership
</button>
        </nav>
        {showFee && (
  <div className="membership-overlay">
    <div className="membership-card">

       <h2>My Membership</h2>

      <h3>{membership.plan} Plan</h3>

      <p>Status: {membership.status}</p>
      <p>Start Date: {membership.start_date}</p>
      <p>Expiry Date: {membership.expiry_date}</p>
      <p>Remaining Days: {membership.remaining_days}</p>
          {membership.can_renew && (
      <button className="renew-btn" onClick={() => {
    setShowFee(false);

    setTimeout(() => {
      const feesSection = document.getElementById("fees");

      if (feesSection) {
        feesSection.scrollIntoView({
          behavior: "smooth",
        });
      }
    }, 100);
  }}>
        Renew Plan
      </button>)}
      <button
        className="renew-btn"
        onClick={() => setShowFee(false)}
      >
       Close
      </button>
    </div>
  </div>
)}
{membership?.status === "Inactive" && (
  <p className="warning">
    <i class="fa-solid fa-triangle-exclamation"></i> Your membership has expired. Please renew your plan to access gym features.
  </p>
)}

{!membership && (
  <p className="warning">
    No active membership found. Please choose a plan to continue.
  </p>
)}
<h2 className="second">Choose Your Fitness Journey</h2>

        <section className="fees-mang" id="fees">
                <div className="fee-card">
                   <img src={basic}/> 
                    <div className="fee-cardtext">
                  <h2>Basic Plan</h2>
                  <h3>Starting from ₹1300</h3>
                  <ul>
                    <li>1 Month Plan</li>
                    <li>✔ Gym Access</li>
                    <li>✔ Locker Facility</li>
                    <li>✔ Free Paraking Access</li>
                    <li>✔ Cardio Access</li>
                  </ul>
                  </div>
                  <button onClick={() => handlePayment("Basic", 1300, 1)}>GET STARTED</button>
                </div>
                <div className="fee-card">
                   <img src={premium}/> 
                    <div className="fee-cardtext">
                  <h2>Premium Plan</h2>
                  <h3>Starting from ₹4500</h3>
                  <ul>
                    <li>6 Month Plan</li>
                    <li>Everything in Basic Plan</li>
                    <li>✔ Personal Trainer Support</li>
                    <li>✔ Locker Facility</li>
                    <li>✔ Diet Plan</li>
                    <li>✔ Monthly Fitness Assessment</li>
                    <li>✔ Yoga Classes</li>
                  </ul>
                  </div>
                  <button onClick={() => handlePayment("Premium", 4500, 6, )}>GET STARTED</button>
                </div>
                <div className="fee-card">
                   <img src={elite}/> 
                    <div className="fee-cardtext">
                  <h2>Elite Plan</h2>
                  <h3>Starting from ₹7500</h3>
                  <ul>
                    <li>1 Year Plan</li>
                    <li>Everything in Premium Plan</li>
                    <li>✔ Customized Workout Plan</li>
                    <li>✔ Customized Diet Plan</li>
                    <li>✔ Unlimited Yoga Sessions</li>
                    <li>✔ Priority Trainer Support</li>
                    <li>✔ Body Composition Analysis</li>
                    <li>✔ Premium Member Benefits</li>
                  </ul>
                  
                  </div>
                  <button onClick={() => handlePayment("Elite", 7500, 12)}>GET STARTED</button>
                </div>
                </section>
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

<footer className="footer">
  <div className="footer-container">

    <div className="footer-box">
      <h3>Infinity Wellness Hub</h3>
      <p>Transform your body and mind with expert training and modern fitness programs.</p>
      <div className="footer-logo">
      <i className="fa-brands fa-whatsapp"></i>
      <i className="fa-brands fa-instagram"></i>
      <i className="fa-brands fa-youtube"></i>
      <i className="fa-brands fa-facebook"></i>
      </div>
    </div>

    <div className="footer-box">
      <h3>Quick Links</h3>
      <ul>
        <li><a href="#home">Home</a></li>
        <li><a href="#">Classes</a></li>
        <li><a href="#">Trainers</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </div>

    <div className="footer-box">
      <h3>Contact</h3>
      <p>📍 Trivandrum, Kerala</p>
      <p>📞 +91 9876543210</p>
      <p>✉ InfinityWellnessHub@gym.com</p>
    </div>

  </div>

  <div className="footer-bottom">
    <p>© 2026 Infinity Wellness Hub. All Rights Reserved.</p>
  </div>
</footer>
               
    
</div>
  )
}

export default FeeManagement;