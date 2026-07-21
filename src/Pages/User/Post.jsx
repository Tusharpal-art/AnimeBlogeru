import { useParams, useNavigate } from "react-router-dom";
import { FaThumbsUp, FaThumbsDown, FaEdit, FaTrash, FaPen, FaCamera } from "react-icons/fa";
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
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

function Post() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [commentText, setCommentText] = useState(""); 
    const { user } = useSelector((state) => state.auth);
    const [replyError, setReplyError] = useState("");
    
    // 1. Safe guard user avatar for guests
    const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
    const userAvatar = user?.profilePicture ? user.profilePicture : DEFAULT_AVATAR;
    
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

    const [selectedImageFile, setSelectedImageFile] = useState(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
    const [errors, setErrors] = useState({});

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

    const quillModules = {
        toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ align: [] }],
            ["link", "clean"],
        ],
    };

    const commentTree = buildTree(commentsArray);
  
    const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://192.168.31.161:5023";
    const FALLBACK_IMG = "https://placehold.co/600x400/000000/ff0000?text=Burogu+Blog";

    let path = postData.blogImgagePath || "";
    if (path.startsWith('/')) path = path.substring(1);

    const imageSrc = imagePreviewUrl 
        ? imagePreviewUrl
        : ((path === "string" || path === "stridfadfang" || !path) ? FALLBACK_IMG : `${BASE_URL}/${path}`);

    const handleCommentSubmit = async () => {
        if (!user) return; // Prevent guests from firing actions
        if (!commentText.trim()) return;
        if (commentText.length > 500) {
            setReplyError("Comment cannot exceed 500 characters");
            return;
        } 
        
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
        if (!user) {
         navigate("/login")
            return;
        }
        try {
            await likeDislikePost({ blogId: id, type }).unwrap();
        } catch (err) {
            console.error("Failed to react to post:", err);
        }
    };

    const startEditing = () => {
        setEditBlogTitle(postData.blogTitle || "");
        setEditBlogDesc(postData.blogDescription || "");
        setIsEditingBlog(true);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
        const maxSize = 2 * 1024 * 1024; // 2MB

        let errorMsg = "";

        if (!allowedTypes.includes(file.type)) {
            errorMsg = "Only JPG, JPEG, and PNG formats are allowed.";
        } else if (file.size > maxSize) {
            errorMsg = "Image size must be less than 2MB.";
        }

        if (errorMsg) {
            setErrors((prev) => ({ ...prev, selectedImageFile: errorMsg }));
            setSelectedImageFile(null);
            setImagePreviewUrl(null);
            return;
        }

        setSelectedImageFile(file);
        setImagePreviewUrl(URL.createObjectURL(file));
        setErrors((prev) => ({ ...prev, selectedImageFile: null }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!editBlogTitle.trim()) {
            newErrors.editBlogTitle = "Title is required";
        } else if (editBlogTitle.trim().length < 10) {
            newErrors.editBlogTitle = "Title must be at least 10 characters long";
        }

        if (!editBlogDesc.trim()) {
            newErrors.editBlogDesc = "Description is required";
        } else if (editBlogDesc.trim().length < 10) {
            newErrors.editBlogDesc = "Description must be at least 10 characters long";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleUpdateBlog = async () => {
        if (!validateForm()) return;
        if (errors.selectedImageFile) return;

        try {
            const formData = new FormData();
            formData.append("Id", id);
            formData.append("BlogTitle", editBlogTitle);
            formData.append("BlogDescription", editBlogDesc);
            formData.append("BlogAuthor", postData.blogAuthor || "Admin");
            
            if (selectedImageFile) {
                formData.append("Image", selectedImageFile);
            } else {
                formData.append("Image", "");
            }

            await updatePost(formData).unwrap();
            setIsEditingBlog(false);
            setSelectedImageFile(null);
            setImagePreviewUrl(null);
        } catch (err) {
            console.error("Failed to update post:", err);
        }
    };

    const handleDeleteBlog = async () => {
        if (window.confirm("Are you sure you want to delete this blog post?")) {
            try {
                await deletePost(id).unwrap();
                navigate("/"); 
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
                <div 
                    className="hero-image-layer" 
                    style={{ backgroundImage: `url(${imageSrc})` }} 
                />
                
                <div className="hero-overlay-dark" />
                {isEditingBlog && (
                    <>
                        <label className="change-photo-overlay" style={{
                            position: "absolute",
                            top: "20px",
                            right: "20px",
                            background: "rgba(0,0,0,0.7)",
                            color: "#fff",
                            padding: "10px 15px",
                            borderRadius: "4px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            zIndex: 10,
                            border: "1px dashed #ff0000"
                        }}>
                          
                            <FaCamera /> Change Banner Image
                            
                            <input 
                                type="file" 
                                accept=".jpg,.jpeg,.png"
                                onChange={handleFileChange} 
                                style={{ display: "none" }} 
                            />
                            
                            {errors.selectedImageFile && (
                                <p style={{
                                    position: "absolute",
                                    top: "65px",
                                    right: "20px",
                                    color: "red",
                                    fontSize: "12px",
                                    background: "rgba(0,0,0,0.6)",
                                    padding: "4px 8px",
                                    borderRadius: "4px"
                                }}>
                                    {errors.selectedImageFile}
                                </p>
                            )}
                        </label>
                    </>
                )}

                <div className="hero-content-inner">
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
                                {/* 2. Use optional chaining user?.id so it doesn't crash for guests */}
                                { (user && postData.createdById === user.id) && (
                                    <button className="like-dislike-btn" onClick={() => startEditing()}>
                                        <FaEdit /> Edit
                                    </button>
                                )}
                                { (user && postData.createdById === user.id) && (
                                    <button className="like-dislike-btn" onClick={handleDeleteBlog}>
                                        <FaTrash /> Delete
                                    </button>
                                )}
                                
                                <button className="like-dislike-btn" onClick={() => handlePostReaction(0)}>
                                    <FaThumbsUp /> <span>{postData.blogLiskes || 0}</span>
                                </button>

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
                      <div style={{ backgroundColor: "#fff", color: "#333", borderRadius: "4px" }}>
                            <ReactQuill
                                theme="snow"
                                value={editBlogDesc}
                                onChange={setEditBlogDesc}
                                modules={quillModules}
                            />
                        </div>
                    ) : (
                       <div 
                            className="rendered-blog-body"
                            dangerouslySetInnerHTML={{ __html: postData.blogDescription }} 
                        />
                    )}
                </div>
            </article>

            <hr style={{color:"red"}}/>
            
            <div className="commentbox">
                <h2>Leave a Comment</h2>
                <div>
                    {replyError && (
                        <p style={{ color: "red", fontSize: "12px", marginTop: "4px" , paddingLeft:"4rem"}}>
                            {replyError}
                        </p>
                    )}
                </div>

                {/* 3. Conditional structure for comment input zone */}
                {user ? (
                    <div className="input-group">
                        <img 
                            src={user?.profilePicture ? `${BASE_URL}${userAvatar}` : userAvatar} 
                            alt="user" 
                            className="user-comment-avatar" 
                        />
                        <input 
                            type="text" 
                            placeholder={isPosting ? "Posting..." : "Join the discussion..."}
                            value={commentText}
                            onChange={(e) => {
                                const value = e.target.value;
                                setCommentText(value);

                                if (value.length > 500) {
                                    setReplyError("Comment cannot exceed 500 characters");
                                } else {
                                    setReplyError("");
                                }
                            }}
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
                ) : (
                    <div className="input-group" style={{ justifyContent: "center", padding: "15px", background: "#f5f5f5", borderRadius: "4px" }}>
                        <p style={{ margin: 0, color: "#555" }}>
                            <div>
                                  Please <span style={{ color: "red", cursor: "pointer", fontWeight: "bold" , display:"inline" }} onClick={() => navigate("/login")}>Login</span> to join the discussion.
                            </div>
                           
                        </p>
                    </div>
                )}

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