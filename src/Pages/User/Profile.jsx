import { AiFillPlusCircle } from "react-icons/ai";
import { useSelector, useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { useGetRecentPostsQuery, useUpdateProfileMutation } from "../../services/apiSlice";
import PostCard from "../../Components/PostCard";
import { useState, useEffect } from "react";
import { SetUsers } from "../../services/authSlice";
import { Link } from "react-router-dom";

function Profile() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const decoded = user?.accessToken ? jwtDecode(user.accessToken) : null;
  const userName = decoded?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
  const userEmail = decoded?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"];
  const profileImg = user?.profilePicture || null;
  const BASE_URL = import.meta.env.REACT_APP_API_BASE_URL || "http://192.168.31.161:5023";

  const { data: allPosts, isLoading } = useGetRecentPostsQuery({pageSize: 30});
  const myBlogs = allPosts?.data?.records?.filter((post) => post.blogAuthor === userName) || [];

  const [isEditing, setIsEditing] = useState(false);
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const [formData, setFormData] = useState({
    Name: userName || "",
    Email: userEmail || "",
    PhoneNumber: "",
    ProfileImage: null
  });

console.log("profile",updateProfile)

  const [preview, setPreview] = useState(
    profileImg 
      ? `${BASE_URL}${profileImg}` 
      : `https://ui-avatars.com/api/?name=${userName || "User"}&background=ff0000&color=fff&rounded=true`
  );

  useEffect(() => {
    setFormData((prev) => ({ 
      ...prev, 
      Name: user.name || "", 
      Email: user.email || "" 
    }));
  }, [user.name, user.email]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, ProfileImage: file });
      setPreview(URL.createObjectURL(file));
      setIsEditing(true);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("Name", formData.Name);
    data.append("Email", formData.Email);
    data.append("PhoneNumber", formData.PhoneNumber);
    if (formData.ProfileImage) {
      data.append("ProfileImage", formData.ProfileImage);
    }

    try {
      const res = await updateProfile(data).unwrap();
      if (res.token) localStorage.setItem("token", res.token);
      if (res.user) localStorage.setItem("user", JSON.stringify(res.user));
      
      if (res.token || res.user) {
         dispatch(SetUsers({ data: res }));
      }
      alert("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      console.error("Profile update failed", err);
      alert(err?.data?.message || "Profile update failed");
    }
  };

  if (isLoading) return <div>Loading your blogs...</div>;

  return (
    <div className="profile-page">
      <div className="profile-hero">
        <div className="profile-avatar-container">
          <img className="proImgDiv" src={preview} alt="Profile" />
          <label htmlFor="fileInput" className="plus-label">
            <AiFillPlusCircle className="plus" />
          </label>
          <input id="fileInput" type="file" style={{ display: "none" }} onChange={handleFileChange} />
        </div>
        
        {isEditing ? (
          <form className="edit-profile-form" onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "center", marginTop: "20px" }}>
            <input type="text" name="Name" value={formData.Name} onChange={handleInputChange} placeholder="Name" required style={{ padding: "8px", borderRadius: "5px", width: "250px", border: "1px solid red", backgroundColor: "black", color: "white" }} />
            <input type="email" name="Email" value={formData.Email} onChange={handleInputChange} placeholder="Email" required style={{ padding: "8px", borderRadius: "5px", width: "250px", border: "1px solid red", backgroundColor: "black", color: "white" }} />
            <input type="text" name="PhoneNumber" value={formData.PhoneNumber} onChange={handleInputChange} placeholder="Phone Number" required style={{ padding: "8px", borderRadius: "5px", width: "250px", border: "1px solid red", backgroundColor: "black", color: "white" }} />
            <div style={{ display: "flex", gap: "10px" }}>
              <button type="submit" disabled={isUpdating} style={{ padding: "8px 20px", background: "red", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}>
                {isUpdating ? "Updating..." : "Save Profile"}
              </button>
              <button type="button" onClick={() => {
                setIsEditing(false);
                setPreview(profileImg ? `${BASE_URL}/Images/${profileImg}` : `https://ui-avatars.com/api/?name=${userName || "User"}&background=ff0000&color=fff&rounded=true`);
                setFormData(prev => ({...prev, ProfileImage: null}));
              }} style={{ padding: "8px 20px", background: "#333", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            <h1 className="profile-name">{user.name}</h1>
            <div className="profile-stats">
              <span style={{color:"white"}}>{user.email}</span>
             
              
            </div>
            <button onClick={() => setIsEditing(true)} style={{ marginTop: "15px", padding: "8px 20px", background: "red", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}>
              Edit Profile
            </button>
          </>
        )}
      </div>

      <div className="profile-tabs">
        <h2 className="active-tab">My Blogs</h2>
         <Link to="/addpost" className="link-tab">
            <button className="signInBtn">Add Blog</button>
          </Link>
      </div>

      <div className="my-blogs-grid">
        {myBlogs.length > 0 ? (
          myBlogs.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        ) : (
          <>
          <p>You haven't posted any blogs yet.</p>
          
          </>
        )}
      </div>
    </div>
  );
}
export default Profile;