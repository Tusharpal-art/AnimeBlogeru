import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterUserMutation } from "../../services/apiSlice";

function Register() {
  // 1. Initialize all required fields
  const [values, setValues] = useState({ 
    name: "", 
    email: "", 
    password: "", 
    confirmPassword: "", 
    phoneNumber: "" 
  });
  
  const navigate = useNavigate();
  const [registerUser, { isLoading, error }] = useRegisterUserMutation();

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await registerUser(values).unwrap();
      if (res.success) {
        alert("Registration Successful! Please Login.");
        navigate("/login");
      }
    } catch (err) {
      console.error("Register Error:", err);
    }
  };

  return (
    <div className="LoginCon">
      <div className="LoginPage">
        <div className="img-section">
          <img
            className="loginImg"
            src="/src/assets/Images/ChatGPT Image Nov 23, 2025, 06_09_30 PM.png"
            alt="Register visual"
          />
        </div>

        <form onSubmit={handleSubmit} className="loginInput">
          <h2 style={{ color: "red" }}>Sign Up</h2>

          {/* Error handling */}
          {error && (
            <p style={{ color: "yellow", fontSize: "12px" }}>
              {error.data?.message || "Registration Failed"}
            </p>
          )}

          <input name="name" type="text" placeholder="Name" onChange={handleChange} required />
          <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
          <input name="phoneNumber" type="tel" placeholder="Phone Number" onChange={handleChange} required />
          <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
          <input name="confirmPassword" type="password" placeholder="Confirm Password" onChange={handleChange} required />

          <button type="submit" className="login" disabled={isLoading}>
            {isLoading ? "Signing up..." : "Register"}
          </button>

          <Link to={"/login"} style={{ color: "red", display: "block", marginTop: "10px" }}>
            Already have account? <strong>Log In</strong>
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Register;