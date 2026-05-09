import React, { useState } from 'react';
import { FaThumbsUp, FaThumbsDown, FaReply, FaEdit, FaTrash } from "react-icons/fa";
import { 
  useCreateCommentMutation, 
  useDeleteCommentMutation, 
  useUpdateCommentMutation, 
  useReactToCommentMutation 
} from '../services/apiSlice';
import { useSelector } from 'react-redux';

const CommentItem = ({ comment, blogId }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [editText, setEditText] = useState(comment.commentContent);
   const { user } = useSelector((state) => state.auth);

  const [createComment, { isLoading: isPostingReply }] = useCreateCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();
  const [updateComment] = useUpdateCommentMutation();
  const [reactToComment] = useReactToCommentMutation();

  // Handle Image Path
  const BASE_URL = "http://192.168.31.161:5023";
  const userImg = comment.createdBy?.profileImagePath 
    ? `${BASE_URL}${comment.createdBy.profileImagePath}` 
    : "https://placehold.co/40x40/000000/ff0000?text=U";

    console.log("like",reactToComment)

  const handleReplySubmit = async () => {
    if (!replyText.trim()) return;
    try {
      await createComment({
        commentContent: replyText,
        commentLiskes: 0,
        commentDislikes: 0,
        blogId: blogId || comment.blogId,
        parentCommentId: comment.id
      }).unwrap();
      setIsReplying(false);
      setReplyText("");
    } catch (err) { console.error("Reply failed:", err); }
  };

  const handleEditSubmit = async () => {
    if (!editText.trim()) return;
    try {
      await updateComment({ ...comment, commentContent: editText }).unwrap();
      setIsEditing(false);
    } catch (err) { console.error("Edit failed:", err); }
  };
function timeAgo(date) {
 
  const now = new Date();
  const seconds = Math.floor((now - new Date(date)) / 1000);

  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) {
    return interval + " year" + (interval > 1 ? "s" : "") + " ago";
  }

  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) {
    return interval + " month" + (interval > 1 ? "s" : "") + " ago";
  }

  interval = Math.floor(seconds / 86400);
  if (interval >= 1) {
    return interval + " day" + (interval > 1 ? "s" : "") + " ago";
  }

  interval = Math.floor(seconds / 3600);
  if (interval >= 1) {
    return interval + " hour" + (interval > 1 ? "s" : "") + " ago";
  }

  interval = Math.floor(seconds / 60);
  if (interval >= 1) {
    return interval + " minute" + (interval > 1 ? "s" : "") + " ago";
  }

  return "just now";
}
  return (
    <div className={`yt-comment-container ${comment.parentCommentId ? 'is-reply' : ''}`}>
      {/* LEFT COLUMN: AVATAR */}
      <div className="yt-avatar-col">
        <img src={userImg} alt="avatar" className="yt-comment-avatar" />
      </div>

      {/* RIGHT COLUMN: CONTENT */}
      <div className="yt-content-col">
        <div className="yt-comment-header">
          <span className="yt-author-name">{comment.createdBy?.name || "User"}</span>
          <span className="yt-timestamp">{timeAgo(comment?.createdDate)}</span>
        </div>

        {isEditing ? (
          <div className="edit-mode-container">
            <input 
              type="text" 
              className="yt-comment-input" 
              value={editText} 
              onChange={(e) => setEditText(e.target.value)} 
              autoFocus
            />
            <div className="yt-button-row">
              <button className="yt-text-btn red" onClick={handleEditSubmit}>Save</button>
              <button className="yt-text-btn" onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
          </div>
        ) : (
          <p className="yt-comment-text">{comment.commentContent}</p>
        )}

        <div className="yt-action-bar">
          <button className="yt-icon-btn" onClick={() => reactToComment({id: comment.id, type: 0})}>
            <FaThumbsUp /> <span>{comment.commentLiskes || 0}</span>
          </button>
          <button className="yt-icon-btn" onClick={() => reactToComment({id: comment.id, type: 1})}>
            <FaThumbsDown /> <span>{comment.commentDislikes || 0}</span>
          </button>
          <button className="yt-reply-trigger" onClick={() => setIsReplying(!isReplying)}>Reply</button>
          
          <div className="yt-owner-actions">
          { (comment.blogAuthor===user.name) &&  <button className="yt-small-btn" onClick={() => setIsEditing(true)}><FaEdit /></button>}
           {  (comment.blogAuthor===user.name) && <button className="yt-small-btn" onClick={() => deleteComment(comment.id)}><FaTrash /></button>}
          </div>
        </div>

        {/* REPLY INPUT */}
        {isReplying && (
          <div className="yt-reply-input-box">
             <input 
                placeholder="Add a reply..." 
                className="yt-comment-input"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
             />
             <div className="yt-button-row">
                <button className="yt-text-btn red" onClick={handleReplySubmit}>Reply</button>
                <button className="yt-text-btn" onClick={() => setIsReplying(false)}>Cancel</button>
             </div>
          </div>
        )}

        {/* RECURSIVE REPLIES */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="yt-replies-list">
            {comment.replies.map((reply) => (
              <CommentItem key={reply.id} comment={reply} blogId={blogId} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentItem;