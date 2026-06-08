import { useState, } from "react";
import "./login.css";
import { useNavigate } from "react-router-dom";


function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();

const handleLogin = () => {
  navigate("/home");
};
const handleRegister = () => {
    
    setIsRegister(false);

    
  };

  return (
    <div className="login-container">
      <div className="login-box">

        <h2>{isRegister ? "Member Register" : "Member Login"}</h2>

        {isRegister && (
          <input
            type="text"
            placeholder="Full Name"
          />
        )}

        <input
          type="email"
          placeholder="Email Address"
        />
        {isRegister && (<>
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
      type="number"
      placeholder="Age"
      min="1"
      max="120"
    /><select className="gender-select">
      <option value="">Select Gender</option>
      <option value="male">Male</option>
      <option value="female">Female</option>
      <option value="other">Other</option>
    </select>
    </div></>)}
        <input
          type="password"
          placeholder="Password"
        />

        {isRegister && (
          <input
            type="password"
            placeholder="Confirm Password"
          />
        )}{isRegister && (
        <div className="profile-upload">
      <label>Profile Picture</label>
      <input type="file" accept="image/*" />
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
    </div>
  );
}

export default Login;