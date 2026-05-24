import "./App.css";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/User/Home.jsx";
import Dashboard from "./Pages/Admin/Dashboard.jsx";
import AdminLayout from "./Pages/Admin/AdminLayout.jsx";
import UserLayout from "./Pages/User/UserLayout.jsx";
import Post from "./Pages/User/Post.jsx";
import Profile from "./Pages/User/Profile.jsx";
import AddPost from "./Pages/Admin/AddPost.jsx";
import ViewUser from "./Pages/Admin/ViewUser.jsx";
import AllPost from "./Pages/Admin/AllPost.jsx";
import Login from "./Pages/Auth/Login.jsx";
import Register from "./Pages/Auth/Register.jsx";
import ProtectedRoute from "../src/routes/ProtectedRoute.jsx";
import About from "./Pages/User/About.jsx";
 import Contact from "./Pages/User/Contact.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* --- PUBLIC & USER ROUTES --- */}
        <Route path="/" element={<UserLayout />}>
          <Route index element={<Home />} />
             <Route  path="/contact" element={<Contact/>} />
          
          {/* Regular Protected Routes (Any logged-in user) */}
          <Route element={<ProtectedRoute />}>
            <Route path="post/:id" element={<Post />} />
            <Route path="profile/:id" element={<Profile />} />
            <Route path="addpost" element={<AddPost />} />
             <Route  path="/about" element={<About />} />
           
          </Route>
        </Route>

        {/* --- ADMIN ONLY ROUTES --- */}
        {/* Pass "Admin" as the only allowed role */}
        <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
          <Route path="/dashboard" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="addpost" element={<AddPost />} />
            <Route path="users" element={<ViewUser />} />
            <Route path="allpost" element={<AllPost />} />
          </Route>
        </Route>
        
      </Routes>
    </BrowserRouter>
  );
}
export default App;
