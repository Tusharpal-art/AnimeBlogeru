import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, token } = useSelector((state) => state.auth);

  // 1. Check if logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2. Check Role (if allowedRoles is provided)
  // Assuming your user object has a 'role' property (e.g., user.role === "Admin")
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />; // Redirect non-admins to Home
  }

  return <Outlet />;
};

export default ProtectedRoute;