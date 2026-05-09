import PostCard from "./PostCard";
import { useGetRecentPostsQuery } from "../services/apiSlice"; //

export default function RecentPost() {
  const { data, isLoading, isError, error } = useGetRecentPostsQuery({pageSize: 30 ,
    type:1

  });

  // 1. Loading State
  if (isLoading) {
    return <div className="status-msg">Loading posts...</div>;
  }

  // 2. Error State
  if (isError) {
    return (
      <div className="error-container">
        <p>Gomen! {error?.data?.message || "Failed to fetch posts"}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  // 3. Extracting the actual array from the nested response
  // Based on your Swagger: data is the root, data.data is the array
  const posts = data?.data?.records || [];

  return (
    <div className="Recentpost">
      <h2 style={{textAlign:"center", marginTop:'1rem'}}>Recent Posts</h2>
      <div className="postList">
        {posts.length > 0 ? (
          posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        ) : (
          <p>No recent posts available.</p>
        )}
      </div>
    </div>
  );
}