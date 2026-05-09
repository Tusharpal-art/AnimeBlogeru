import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const { user ,token} = useSelector((state) => state.auth);
 // console.log("protected route", user)

  // If there is no user/token in Redux, redirect to login
  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  // If logged in, render the child routes (Outlet)
  return <Outlet />;
};

export default ProtectedRoute;