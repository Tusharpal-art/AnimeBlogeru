import { Outlet } from "react-router-dom";
import Sidebar from "../../Components/SideBar";
import Navbar from "../../Components/Navbar";

function UserLayout() {
  return (
    <div>
      <Navbar />
      <div className="proDiv">
        <Outlet />
      </div>
    </div>
  );
}
export default UserLayout;
