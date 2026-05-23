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
  const userName = decoded?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
  const userEmail = decoded?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"];
  const profileImg = user?.profilePicture || null;
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://192.168.31.161:5023";

 const { data, isLoading } = useGetRecentPostsQuery({
    pageSize: 30, // Fetching enough to have a pool
    BlogType: 1
  });

  const posts = data?.data?.records || [];
   

  const [isEditing, setIsEditing] = useState(false);
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const [imageError, setImageError] = useState("");
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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFormData((prev) => ({ 
      ...prev, 
      Name: user.name || "", 
      Email: user.email || "" 
    }));
  }, [user.name, user.email]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
     if (!file) return;

  const maxSize = 2 * 1024 * 1024; // 2MB

  if (file.size > maxSize) {
    setImageError("Image size should not exceed 2 MB");
    e.target.value = null; // reset input
    return; // ❌ stop further execution
  }

  // ✅ clear error if valid
  setImageError("");

    if (file) {
    setFormData((prev) => ({
      ...prev,
      ProfileImage: file,
    }));
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
  data.append("Name", formData.Name || "");
  data.append("Email", formData.Email || "");
  data.append("PhoneNumber", formData.PhoneNumber || "");
  if (formData.ProfileImage instanceof File) {
    data.append("ProfileImagePath", formData.ProfileImage);
  }

  console.log("img",data)

  try {
    const res = await updateProfile(data).unwrap();
    
    // Pass res.data (which contains name and profileImgPath) to the dispatch
    if (res.success) {
      dispatch(SetUsers(res.data)); 
      alert("Profile updated successfully!");
      setIsEditing(false);
    }
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
        {imageError && (
  <p style={{ color: "red", marginTop: "8px", fontSize: "13px" }}>
    {imageError}
  </p>
)}

        {isEditing ? (
          <form className="edit-profile-form" onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "center", marginTop: "20px" }}>
            <input type="text" name="Name" value={formData.Name} onChange={handleInputChange} placeholder="Name" required style={{ padding: "8px", borderRadius: "5px", width: "250px", border: "1px solid red", backgroundColor: "black", color: "white" }} />
            
            
            <div style={{ display: "flex", gap: "10px" }}>
              <button type="submit" disabled={isUpdating} style={{ padding: "8px 20px", background: "red", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}>
                {isUpdating ? "Updating..." : "Save Profile"}
              </button>
              <button type="button" onClick={() => {
                setIsEditing(false);
                setPreview(profileImg ? `${BASE_URL}${profileImg}` : `https://ui-avatars.com/api/?name=${userName || "User"}&background=ff0000&color=fff&rounded=true`);
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
       <div className="section-header">
      <h2 style={{color:"red" , textAlign:"center", marginTop:'1rem'}}>My B</h2>
    </div>

    {/* Added the horizontal-scroll class here */}
    <div className="postList horizontal-scroll">
      {posts.length > 0 ? (
        posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))
      ) : (
        <p>No posts available.</p>
      )}
    </div>
       
      </div>
    </div>
  );
}
export default Profile;