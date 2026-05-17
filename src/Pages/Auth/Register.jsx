import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterUserMutation } from "../../services/apiSlice";
import { Eye ,EyeOff } from "lucide-react";

function Register() {
  const [value, setValues] = useState({ 
    name: "",  // Keep these names consistent
    email: "", 
    password: "", 
    confirmPassword: "", 
    phoneNumber: "" 
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);
  const [frontendError, setFrontendError] = useState("");
  const navigate = useNavigate();
  const [registerUser, { isLoading, error }] = useRegisterUserMutation();

  const handleChange = (e) => {
    setValues({ ...value, [e.target.name]: e.target.value });
  };

  // Add this for the image input
 const handleFileChange = (e) => {
  const file = e.target.files[0];
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

  if (file) {
    // Check if the file type is in our allowed list
    if (!allowedTypes.includes(file.type)) {
      setFrontendError("Only .jpg, .jpeg, and .png files are allowed!");
      e.target.value = ""; // Clear the input
      setSelectedFile(null);
      return;
    }

    // Optional: Check file size (e.g., max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setFrontendError("File is too large! Max size is 2MB.");
      e.target.value = "";
      setSelectedFile(null);
      return;
    }

    // If valid
    setFrontendError(""); 
    setSelectedFile(file);
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (value.password !== value.confirmPassword) {
      setFrontendError("Passwords do not match!");
      return;
    }
    if (value.phoneNumber.length < 10) {
      setFrontendError("Phone number must be at least 10 digits");
      return;
    }

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


  const inputContainerStyle = {
    position: "relative",
     width:"300px",
    marginBottom: "15px"
  };

  // Reusable style for the eye button
  const eyeButtonStyle = {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    color: "#888",
    display: "flex",
    alignItems: "center",
    padding: "0"
  };

  return (
    <div className="LoginCon">
      <div className="LoginPage">
        {/* ... img section ... */}
        <form onSubmit={handleSubmit} className="loginInput">
          <h2 style={{ color: "red" }}>Sign Up</h2>

          {/* Validation Error Display */}
        {frontendError && (
            <p style={{ color: "red", fontSize: "12px", textAlign: 'center' }}>{frontendError}</p>
          )}

          {error?.data?.errors && (
            <div style={{ border: '1px solid yellow', padding: '8px', borderRadius: '5px', marginBottom: '10px' }}>
              {Object.entries(error.data.errors).map(([key, errs]) => (
                <p key={key} style={{ color: "yellow", fontSize: "11px", margin: '2px 0' }}>{errs[0]}</p>
              ))}
            </div>
          )}

          <input name="name" type="text" placeholder="Name" onChange={handleChange} required />
          <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
          <input name="phoneNumber" type="tel" placeholder="Phone Number (10 digits)" onChange={handleChange} required />
          <div style={inputContainerStyle}>
            <input 
              name="password" 
              type={showPassword ? "text" : "password"} 
              placeholder="Password" 
              onChange={handleChange} 
              required 
              style={{ width: "100%", boxSizing: "border-box" }}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} style={eyeButtonStyle}>
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* --- CONFIRM PASSWORD FIELD --- */}
          <div style={inputContainerStyle}>
            <input 
              name="confirmPassword" 
              type={showConfirmPassword ? "text" : "password"} 
              placeholder="Confirm Password" 
              onChange={handleChange} 
              required 
              style={{ width: "100%", boxSizing: "border-box" }}
            />
            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={eyeButtonStyle}>
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          
          {/* IMPORTANT: Added File Input */}
         <div style={{ textAlign: 'left', marginTop: '10px' }}>
  <label style={{ color: 'red', fontSize: '12px', display: 'block', marginBottom: '5px' }}>
    Profile Image (.jpg, .jpeg, .png):
  </label>
  
  <input 
    type="file" 
    // This limits what the user sees in the folder picker
    accept=".jpg,.jpeg,.png" 
    onChange={handleFileChange} 
    required 
    style={{ color: 'white', fontSize: '12px' }} 
  />
</div>

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