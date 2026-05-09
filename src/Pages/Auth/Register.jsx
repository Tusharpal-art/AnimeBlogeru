import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterUserMutation } from "../../services/apiSlice";

function Register() {
  const [value, setValues] = useState({ 
    name: "",  // Keep these names consistent
    email: "", 
    password: "", 
    confirmPassword: "", 
    phoneNumber: "" 
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();
  const [registerUser, { isLoading, error }] = useRegisterUserMutation();

  const handleChange = (e) => {
    setValues({ ...value, [e.target.name]: e.target.value });
  };

  // Add this for the image input
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    // 1. Fixed: Use value.name (matches state)
    formData.append("Name", value.name); 
    formData.append("Email", value.email);
    formData.append("Password", value.password);
    formData.append("ConfirmPassword", value.confirmPassword);
    
    // 2. Fixed: Remove spaces from phone number to pass "10 Digit" validation
    formData.append("PhoneNumber", value.phoneNumber.replace(/\s/g, ''));

    // 3. Fixed: ProfileImage must be a File or Blob
    if (selectedFile) {
      formData.append("ProfileImage", selectedFile);
    } else {
      // If the API requires it, you MUST provide a file. 
      // If you want a default, you'd usually handle that on the backend.
      // For now, we'll append an empty string, but check if your API allows this.
      formData.append("ProfileImage", ""); 
    }

    try {
      await registerUser(formData).unwrap();
      alert("Registration Successful!");
      navigate("/login");
    } catch (err) {
      console.error("Register Error:", err);
    }
  };

  return (
    <div className="LoginCon">
      <div className="LoginPage">
        {/* ... img section ... */}
        <form onSubmit={handleSubmit} className="loginInput">
          <h2 style={{ color: "red" }}>Sign Up</h2>

          {/* Validation Error Display */}
          {error?.data?.errors && (
            <div style={{ color: "yellow", fontSize: "11px", marginBottom: "10px" }}>
              {Object.entries(error.data.errors).map(([key, errs]) => (
                <p key={key}>{errs[0]}</p>
              ))}
            </div>
          )}

          <input name="name" type="text" placeholder="Name" onChange={handleChange} required />
          <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
          <input name="phoneNumber" type="tel" placeholder="Phone Number (10 digits)" onChange={handleChange} required />
          <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
          <input name="confirmPassword" type="password" placeholder="Confirm Password" onChange={handleChange} required />
          
          {/* IMPORTANT: Added File Input */}
          <label style={{color: 'red', fontSize: '12px'}}>Profile Image:</label>
          <input type="file" accept="image/*" onChange={handleFileChange} required />

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