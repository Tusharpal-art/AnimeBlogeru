import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDeletePostMutation } from "../services/apiSlice";
import { ThumbsDownIcon, ThumbsUp } from "lucide-react";

function PostCard({ post }) {
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://192.168.31.161:5023";
  const FALLBACK_IMG = "https://placehold.co/600x400/000000/ff0000?text=Burogu+Blog";
  let path = post.blogImgagePath || "";
 
  if (path.startsWith('/')) path = path.substring(1);
  const imageSrc = (path === "string" || path === "stridfadfang" || !path) 
    ? FALLBACK_IMG 
    : `${BASE_URL}/${path}`;

     const { user } = useSelector((state) => state.auth);  
  const [deletePost] = useDeletePostMutation();

  // Logic: Can delete if they are the Author OR the Admin
  const canDelete = (post.blogAuthor===user.name)   /*user?.username === post.blogAuthor || user?.role === "Admin";*/

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (window.confirm("Delete this post?")) {
      await deletePost(post.id);
    }
  };
  return (
    <div  className="postCard" onClick={() => navigate(`/post/${post.id}`)}>
      <div style={{borderBottom:"1px solid red"}} className="postCard-img-wrapper">
        <img 
          src={imageSrc} 
          alt={post.blogTitle} 
          // Handles the 404 error if the file is missing on the server
          onError={(e) => { e.target.src = FALLBACK_IMG; }}
        />
        <span className="category-tag">{"Anime"}</span>
        
      </div>
      
      <div className="postCard-content">
         <h3 style={{ color: "red", margin: "10px 0 5px 0", fontSize: "1.2rem" }}>
      {post.blogTitle}
    </h3>
        
        <p>
          {post?.blogDescription?.substring(0, 20)}... 
          
        </p>
        
        <div className="postCard-footer">
          <div className="stats">
            {/* Using the exact keys from your backend data */}
            <span style={{color:"red" ,marginRight:"5px"}}><ThumbsUp style={{color:"red"}}/> {post?.blogLiskes || 0}</span>
            <span  style={{color:"red" ,marginRight:"5px"}}><ThumbsDownIcon style={{color:"red"}}/> {post?.blogDislikes || 0}</span>
          </div>
          <button className="view-btn">View Post</button>
          { canDelete && (
          <button className="delete-btn" onClick={handleDelete}>
            Delete
          </button>
        )}

        </div>
        
      </div>
    </div>
  );
}

export default PostCard;