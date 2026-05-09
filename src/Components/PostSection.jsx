import PostCard from "./PostCard";
import { useGetRecentPostsQuery } from "../services/apiSlice";
 

export const PostSection = ({ title, type, limit = 4,IsAscending=false }) => {
  const { data, isLoading, isError } = useGetRecentPostsQuery({
    pageSize: 30, // Fetching enough to have a pool
    BlogType: 1,
    IsAscending:IsAscending,
     // Using the dynamic type from your endpoint
  });

  const posts = data?.data?.records || [];
  // Slice the data to only show a few on the homepage (like the image)
  const displayPosts = posts.slice(0, limit);

  if (isLoading) return <div className="status-msg">Loading {title}...</div>;
  if (isError) return null; // Silently fail or show small error

  return (
   <div className="section-container">
    <div className="section-header">
      <h2 style={{color:"red" , textAlign:"center", marginTop:'1rem'}}>{title}</h2>
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
  );
};