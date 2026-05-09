import { useParams, useNavigate } from "react-router-dom";
import { FaThumbsUp, FaThumbsDown, FaEdit, FaTrash, FaPen } from "react-icons/fa";
import { 
    useGetSinglePostQuery, 
    useCreateCommentMutation, 
    useGetAllCommentsQuery,
    useLikeDislikePostMutation,
    useUpdatePostMutation,
    useDeletePostMutation
} from "../../services/apiSlice";
import { useState } from "react";
import CommentItem from "../../Components/CommentItem";
import { useSelector } from "react-redux";

function Post() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [commentText, setCommentText] = useState(""); 
    const { user } = useSelector((state) => state.auth);
    console.log("user",user)
    const userAvatar = user?.profilePicture || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
    
    // API Hooks
    const { data, isLoading: isBlogLoading, isError } = useGetSinglePostQuery(id);
    const [createComment, { isLoading: isPosting }] = useCreateCommentMutation();
    const [likeDislikePost] = useLikeDislikePostMutation();
    const [updatePost] = useUpdatePostMutation();           
    const [deletePost] = useDeletePostMutation();
    const { data: commentsResponse, isLoading: isCommentsLoading } = useGetAllCommentsQuery({ 
        blogId: id, 
        pageSize: 20,
        isAscending: false, 
    });

    const [isEditingBlog, setIsEditingBlog] = useState(false);
    const [editBlogTitle, setEditBlogTitle] = useState("");
    const [editBlogDesc, setEditBlogDesc] = useState("");

    // Data Extraction
    const postData = data?.data?.data || data?.data || {};
    const commentsArray = commentsResponse?.data?.records || [];

    const buildTree = (flatComments) => {
    const map = {};
    const tree = [];
    flatComments.forEach(c => map[c.id] = { ...c, replies: [] });
    flatComments.forEach(c => {
      if (c.parentCommentId && map[c.parentCommentId]) {
        map[c.parentCommentId].replies.push(map[c.id]);
      } else {
        tree.push(map[c.id]);
      }
 
    });
    return tree;
  };

  // --- USE IT HERE ---
  const commentTree = buildTree(commentsArray);
  
      console.log("tree",commentTree)

    // --- IMAGE LOGIC INTEGRATION --
    
 
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://192.168.31.161:5023";
  const FALLBACK_IMG = "https://placehold.co/600x400/000000/ff0000?text=Burogu+Blog";

  // 2. Logic to handle the path
  let path = postData.blogImgagePath || "";

  // Remove leading slashes if any, to avoid //
  if (path.startsWith('/')) path = path.substring(1);

  // 3. Construct URL: 
  // If the path already has 'images/', don't add 'Images/' again.
  // Use lowercase 'images' to match your error log output.
  const imageSrc = (path === "string" || path === "stridfadfang" || !path) 
    ? FALLBACK_IMG 
    : `${BASE_URL}/${path}`;
     

    const handleCommentSubmit = async () => {
        if (!commentText.trim()) return;
        const payload = {
            commentContent: commentText,
            commentLiskes: 0,
            commentDislikes: 0,
            blogId: id,
            parentCommentId: null
        };
        try {
            await createComment(payload).unwrap();
            setCommentText(""); 
        } catch (err) {
            console.error("Submission failed:", err);
        }
    };

    const handlePostReaction = async (type) => {
        try {
            // Type 1 for Like, Type 2 for Dislike (Assuming based on provided URL ?BlogId=...&Type=1)
             console.log("blog id",id,type);
            await likeDislikePost({ blogId: id, type }).unwrap();
            console.log("blog id",id);
        } catch (err) {
            console.error("Failed to react to post:", err);
        }
    };

    const startEditing = () => {
        setEditBlogTitle(postData.blogTitle || "");
        setEditBlogDesc(postData.blogDescription || "");
        setIsEditingBlog(true);
    };

    const handleUpdateBlog = async () => {
        try {
            const formData = new FormData();
            formData.append("Id", id);
            formData.append("BlogTitle", editBlogTitle);
            formData.append("BlogDescription", editBlogDesc);
            formData.append("BlogAuthor", postData.blogAuthor || "Admin");
            
            // If we have an image update mechanism later, we'd append it here.
            // For now, we append an empty string as per the cURL example to satisfy the backend
            formData.append("Image", "");

            await updatePost(formData).unwrap();
            setIsEditingBlog(false);
        } catch (err) {
            console.error("Failed to update post:", err);
        }
    };

    const handleDeleteBlog = async () => {
        if (window.confirm("Are you sure you want to delete this blog post?")) {
            try {
                await deletePost(id).unwrap();
                navigate("/"); // Redirect to home on delete
            } catch (err) {
                console.error("Failed to delete post:", err);
            }
        }
    };

    if (isBlogLoading) return <div className="status-msg">Loading post...</div>;
    if (isError) return <div className="status-msg">Post not found.</div>;

    return (
        <div className="post-page"> 
          <header className="blog-hero">
                {/* The Main Background Image */}
                <div 
                    className="hero-image-layer" 
                    style={{ backgroundImage: `url(${imageSrc})` }} 
                />
                
                {/* Dark Gradient Overlay for Text Readability */}
                <div className="hero-overlay-dark" />

                <div className="hero-content-inner">
                    <span className="hero-timestamp">15 minutes ago</span>
                    
                    {isEditingBlog ? (
                        <input 
                            className="hero-main-title comment-input-box" 
                            style={{fontSize: '2rem', width: '100%', marginBottom: '10px'}}
                            value={editBlogTitle} 
                            onChange={e => setEditBlogTitle(e.target.value)} 
                        />
                    ) : (
                        <div>
                        <h1 className="hero-main-title">{postData.blogTitle}</h1>
                         <p className="article-author-line">𓂃🖊 By {postData.blogAuthor || "Admin"}</p>
                     </div>
                    )}
                    
                   <div className="hero-button-row">
    {isEditingBlog ? (
        <>
            <button className="read-more-btn" onClick={handleUpdateBlog}>Save Changes</button>
            <button className="read-more-btn" onClick={() => setIsEditingBlog(false)} style={{background: 'gray'}}>Cancel</button>
        </>
    ) : (
        <>
          { (postData.blogAuthor===user.name) && <button className="like-dislike-btn" onClick={() => startEditing()}>
                <FaEdit /> Edit
            </button>}
           { (postData.blogAuthor===user.name) && <button className="like-dislike-btn" onClick={handleDeleteBlog}>
                <FaTrash /> Delete
            </button>}
            
            {/* Thumbs Up Button */}
            <button className="like-dislike-btn" onClick={() => handlePostReaction(0)}>
                <FaThumbsUp /> <span>{postData.blogLiskes || 0}</span>
            </button>

            {/* Thumbs Down Button */}
            <button className="like-dislike-btn" onClick={() => handlePostReaction(1)}>
                <FaThumbsDown /> <span>{postData.blogDislikes || 0}</span>
            </button>
        </>
    )}
</div>
                </div>
            </header>
<article className="post-article-container">
    <div className="article-text-content">
        {isEditingBlog ? (
            <textarea 
                className="comment-input-box" 
                style={{width: '100%', minHeight: '300px', padding: '20px'}}
                value={editBlogDesc} 
                onChange={e => setEditBlogDesc(e.target.value)} 
            />
        ) : (
            <div style={{ whiteSpace: 'pre-wrap' }}>
                {postData.blogDescription}
            </div>
        )}
    </div>
</article>
  <hr style={{color:"red"}}/>
            {/* Comment Section remains below */}
        <div className="commentbox">
                <h2>Leave a Comment</h2>
                
                <div className="input-group">
                    {/* Logged in User Avatar */}
                    <img src={`${BASE_URL}${userAvatar}`} alt="user" className="user-comment-avatar" />
                    
                    <input 
                        type="text" 
                        placeholder={isPosting ? "Posting..." : "Join the discussion..."}
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        disabled={isPosting}
                    />
                    
                    <button 
                        className="loginBtn" 
                        onClick={handleCommentSubmit}
                        disabled={isPosting || !commentText.trim()}
                    >
                        {isPosting ? "..." : "POST"}
                    </button>
                </div>

               <hr style={{color:"red"}}/>

                <div className="comment-section">
                    <h2>Comments ({commentsArray.length})</h2>
                    {isCommentsLoading ? (
                        <p style={{color: '#666'}}>Loading comments...</p>
                    ) : (
                        <div className="comments-list">
                            {commentTree.map((comment) => (
                               <CommentItem key={comment.id} comment={comment} blogId={id} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Post;