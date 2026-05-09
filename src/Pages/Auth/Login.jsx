import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { SetUsers } from "../../services/authSlice";
import { useLoginUserMutation } from "../../services/apiSlice"; 
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [value, setValue] = useState({ email: "", password: "" });

  // RTK Query Mutation Hook
  const [loginUser, { isLoading, error }] = useLoginUserMutation();
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setValue({ ...value, [e.target.name]: e.target.value });
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await loginUser(value).unwrap();

    // Ensure res.user exists before stringifying
    if (res.user) {
      localStorage.setItem("user", JSON.stringify(res.user));
    }
    if (res.token) {
      localStorage.setItem("token", res.token);
    }

    // Dispatch the actual object structure your reducer expects
    dispatch(SetUsers({ data: res }));
    navigate("/");
  } catch (err) {
    console.error("Login failed", err);
  }
};

  return (
    <div className="LoginCon">
      <div className="LoginPage">
        <div className="img-section">
          <img
            className="loginImg"
            src="/src/assets/Images/ChatGPT Image Nov 23, 2025, 06_09_30 PM.png"
            alt="Login visual"
          />
        </div>
        <form onSubmit={handleSubmit} className="loginInput">
          <h2 style={{ color: "red" }}>Log In</h2>
          {/* Error message dikhane ke liye */}
          {error && (
            <p style={{ color: "yellow" }}>
              {error.data?.message || "Invalid Credentials"}
            </p>
          )}

          <input
            onChange={handleChange}
            value={value.email}
            type="email"
            placeholder="Email"
            name="email"
            required
          />
       <div style={{ position: "relative", width: "100%", marginBottom: "15px" }}>
  <input
    onChange={handleChange}
    value={value.password}
    type={showPassword ? "text" : "password"}
    placeholder="Password"
    name="password"
    required
    style={{
      width: "100%",
      padding: "12px 45px 12px 12px",
      marginLeft:"41px", // Extra padding on the right for the icon
      backgroundColor: "#1e1e1e",     // Your dark background
      border: "1px solid #333",       // Your border
      borderRadius: "8px",
      color: "white",
      outline: "none",
      boxSizing: "border-box"         // Ensures padding doesn't break width
    }}
  />
  
  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    style={{
      position: "absolute",
      right: "12px",                  // Align to the right edge
      top: "50%",                     // Center vertically
      transform: "translateY(-50%)",  // Perfect vertical alignment
      background: "transparent",
      border: "none",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      color: "#888",                  // Icon color
      padding: "0"
    }}
  >
    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
  </button>
</div>
          <button type="submit" className="login" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>

          <Link
            to={"/register"}
            style={{ display: "block", color: "red", marginTop: "10px" }}
          >
            Create new account
          </Link>
        </form>
      </div>
    </div>
  );
}
