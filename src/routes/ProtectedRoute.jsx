import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, token } = useSelector((state) => state.auth);
  const location = useLocation();

  // 1. If there is no token, they aren't logged in at all
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. If allowedRoles is defined, check the user's role
  if (allowedRoles) {
    // console.log("User Role:", user?.role); // Debugging: check what is actually here
    const hasRole = allowedRoles.includes(user?.role);
    
    if (!hasRole) {
      // Logged in but not an Admin? Send them to home
      return <Navigate to="/" replace />;
    }
  }

  // 3. If they passed all checks, show the child routes
  return <Outlet />;
};

export default ProtectedRoute;