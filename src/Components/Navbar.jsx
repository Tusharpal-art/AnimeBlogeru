import { Link, useNavigate, useParams } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RemoveUser } from "../services/authSlice";
//import { jwtDecode } from "jwt-decode";

function Navbar({ toggleSidebar }) {
  const [open, setOpen] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dropRef = useRef(null);
  const { userId } = useParams();

  //console.log("userId", userId);
  const BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://192.168.31.161:5023";
  // Decode and find profile image logic
  //const decoded = user?.accessToken ? jwtDecode(user.accessToken) : null;
  const profileImg =
    user?.profile || user?.profilePicture || user?.ProfileImage || null;

  // Fallback if image fails to load
  const handleImgError = (e) => {
    e.target.src = `https://ui-avatars.com/api/?name=${user?.userName || "User"}&background=ff0000&color=fff&rounded=true`;
  };

  useEffect(() => {
    const handleDrop = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleDrop);
    return () => document.removeEventListener("mousedown", handleDrop);
  }, []);

  const handleLogout = () => {
    dispatch(RemoveUser());
    setOpen(false);
    navigate("/login");
  };

  return (
    <nav className="navbar" style={{ position: "sticky" }}>
      <div className="nav-left">
        <div className="menu-icon" onClick={toggleSidebar}>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className="logo-section">
          <Link to="/" className="logo-link">
            <h2>Burogu</h2>
          </Link>
          <span className="jp-text">ブログ</span>
        </div>
      </div>

   <div ref={dropRef} className="nav-right" style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <div
          className="nav-links-left"
          style={{ display: "flex", gap: "20px" }}
        >
          <Link to="/about" className="nav-text-link">
            About
          </Link>
          <Link to="/contact" className="nav-text-link">
            Contact
          </Link>
          <Link to="/privacy" className="nav-text-link">
          Privacy Policy
          </Link>
        </div>
        {user ? (
          <div className="profile-container">
            <div
              className={`avatar-wrapper ${open ? "active" : ""}`}
              onClick={() => setOpen(!open)}
            >
              <img
                className="nav-avatar"
                src={profileImg ? `${BASE_URL}${profileImg}` : ""}
                onError={handleImgError}
                alt="User"
              />
            </div>

            {open && (
              <div className="nav-dropdown">
                <div className="dropdown-header">
                  <p className="user-name">{user.userName || "User"}</p>
                  <div className="red-divider"></div>
                </div>

                {(user.role === "Admin" || user.userRole === "Admin") && (
                  <Link
                    to="/dashboard"
                    onClick={() => setOpen(false)}
                    className="drop-item"
                  >
                    Dashboard
                  </Link>
                )}

                {location.pathname === "/" ? (
                  <Link
                    to={`/profile/${user.id}`}
                    onClick={() => setOpen(false)}
                    className="drop-item"
                  >
                    Profile
                  </Link>
                ) : (
                  <Link to="/" className="drop-item">
                    Home
                  </Link>
                )}
                <button className="logout-btn" onClick={handleLogout}>
                  Sign out
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login">
            <button className="signInBtn">Sign in</button>
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
