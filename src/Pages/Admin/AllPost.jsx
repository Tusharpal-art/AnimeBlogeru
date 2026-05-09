import { useNavigate } from "react-router-dom";
import { useGetRecentPostsQuery } from "../../services/apiSlice"; //

function AllPost() {
  const navigate = useNavigate();
  
  // Fetching data from the backend
  const { data, isLoading, isError } = useGetRecentPostsQuery();

  const handleClick = (id) => {
    navigate(`/post/${id}`); // Dynamic navigation based on post ID
  };

  if (isLoading) return <div className="loading">Loading posts...</div>;
  if (isError) return <div className="error">Error loading posts. Please check your connection.</div>;
  const BASE_URL = import.meta.env.REACT_APP_API_BASE_URL || "http://192.168.31.161:5023";
  const allowedExtensions = ['.png', '.jpg', '.jpeg'];
  // Accessing the array from the "data" property of your backend response
  const posts = data?.data?.records || [];
  //console.log(posts)

  return (
    <div className="allpost">
      {posts.map((post) => (
        //console.log("path for check",post.blogImgagePath),
        <div className="postCard" key={post.id}>
          {/* Using blogImgagePath from your API response */}
          <img 
            src={ allowedExtensions.some(ext => post.blogImgagePath?.toLowerCase().endsWith(ext)) ? `${BASE_URL}${post.blogImgagePath}` : "https://i.pinimg.com/736x/29/fb/f8/29fbf8f7ee3f0054ed645b71230603fc.jpg" } 
            alt={post.blogTitle} 
          />
          
          {/* Using blogTitle from your API response */}
          <h3>{post.blogTitle}</h3>
          
          <button onClick={() => handleClick(post.id)}>
            Read More
          </button>
        </div>
      ))}

      {posts.length === 0 && <p>No posts found.</p>}
    </div>
  );
}

export default AllPost;