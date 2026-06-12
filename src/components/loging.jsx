import { useState, } from "react";
import "./login.css";
import { useNavigate } from "react-router-dom";
import API from "./api";
import axios from "axios";


function Login() {
const navigate = useNavigate();
const [isRegister, setIsRegister] = useState(false);
const [confirmPassword, setConfirmPassword] = useState("");
const [showIdPopup, setShowIdPopup] = useState(false);
const [newUserId, setNewUserId] = useState("");
const [showAlert, setShowAlert] = useState(false);
const [alertMessage, setAlertMessage] = useState("");
const [loginData, setLoginData] = useState({
  user_id: "",
  password: "",
});


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
const handleLoginChange = (e) => {
  const { name, value } = e.target;

  setLoginData({
    ...loginData,
    [name]: value,
  });
};


const handleRegister = async () => {
for (const key in formData) {
    if (!formData[key]) {
      setAlertMessage(`${key.replace("_", " ")} is required`);
setShowAlert(true);
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
    setIsRegister(false);
  } 
  catch (error) {

  const errors = error.response?.data;

  console.log(errors);

  if (errors?.email) {
     setAlertMessage("This email is already registered");
setShowAlert(true);
  }
  else if (errors?.phone) {
        setAlertMessage("This phone number is already registered");
setShowAlert(true);
  }
  else {
        setAlertMessage("Registration failed");
setShowAlert(true);
  }
}
  
};

const handleLogin = async () => {

  if (!loginData.user_id || !loginData.password) {
        setAlertMessage("Please enter User ID and Password");
setShowAlert(true);
    return;
  }

  try {

    const response = await API.post(
      "/login/",
      loginData
    );
localStorage.setItem(
  "member",
  JSON.stringify(response.data)
);
   setAlertMessage(`Welcome ${response.data.name}`);
setShowAlert(true);

    navigate("/home");

  } catch (error) {

    
    setAlertMessage(error.response?.data?.message ||
      "Login Failed");
setShowAlert(true);

  }
};

  return (
    <div className="login-container">
      <div className="login-box">

        <h2>{isRegister ? "Member Register" : "Member Login"}</h2>

        {isRegister && (
          <input
            type="text"
            placeholder="Full Name"
            name="name"
            value={formData.name}
             onChange={handleChange}
          />
        )}
{isRegister && (<>
        <input
          type="email"
          placeholder="Email Address"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        
            <div className="phone-group">
  <select name="countryCode" value={formData.countryCode}
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
<div className="age-gender-row">
   <input
      type="date"
      name="date_of_birth"
      value={formData.date_of_birth}
          onChange={handleChange}/>
          <select className="gender-select" name="gender" value={formData.gender}
          onChange={handleChange}>
      <option value="">Select Gender</option>
      <option value="Male">Male</option>
      <option value="Female">Female</option>
      <option value="other">Other</option>
    </select>
    </div>
     <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        /></>)}


{!isRegister && (<>
    <input type="text"
    placeholder="User Id" 
    name="user_id"
    value={loginData.user_id}
  onChange={handleLoginChange}/>



        <input
          type="password"
          name="password"
          placeholder="Password"
          value={loginData.password}
  onChange={handleLoginChange}
        /></>
)}


        {isRegister && (
          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmpassword"
            value={confirmPassword}
  onChange={(e) => setConfirmPassword(e.target.value)}
          />
          
        )}
        {confirmPassword &&
 formData.password !== confirmPassword && (
  <span className="error">
    Passwords do not match
  </span>
)}
        {isRegister && (
        <div className="profile-upload">
      <label>Profile Picture</label>
      <input type="file" name="image" accept="image/*" onChange={(e) =>
    setFormData({
      ...formData,
      profile_image: e.target.files[0],
    })
  }/>
    </div>)}
        <button
      onClick={isRegister ? handleRegister : handleLogin}
    >
          {isRegister ? "Register" : "Login"}
        </button>

        <p>
          {isRegister
            ? "Already have an account?"
            : "Don't have an account?"}

          <span
            className="toggle-link"
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister ? " Login" : " Register"}
          </span>
        </p>

      </div>
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
{showAlert && (
  <div className="alert-overlay">
    <div className="alert-card">
      <h3>Notification</h3>

      <p>{alertMessage}</p>

      <button
        onClick={() => setShowAlert(false)}
      >
        OK
      </button>
    </div>
  </div>
)}
    </div>

  );
}

export default Login;