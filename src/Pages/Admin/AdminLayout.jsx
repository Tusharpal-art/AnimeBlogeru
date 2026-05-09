import { Outlet } from "react-router-dom";
import Sidebar from "../../Components/SideBar";
import Navbar from "../../Components/Navbar";
 

function AdminLayout() {
  return (
    <div className="admin-layout">
      <Sidebar />

      <div className="main-content">
        <Navbar />
        <div className="outlet-wrapper">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
