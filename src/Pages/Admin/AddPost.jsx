import { useState, useRef } from "react";
import { useCreatePostMutation } from "../../services/apiSlice";
import { useNavigate } from "react-router-dom";

  function AddPost() {
  const [blogTitle, setBlogTitle] = useState("");
  const [blogDescription, setBlogDescription] = useState("");
  const [blogAuthor, setBlogAuthor] = useState("Admin");
  const [selectedFile, setSelectedFile] = useState(null);
  
  // Added state for backend validation errors
  const [backendErrors, setBackendErrors] = useState({});
  
  const fileInputRef = useRef(null);
  const [createPost, { isLoading }] = useCreatePostMutation();
  const navigate = useNavigate();

  const handleFile = (file) => {
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
    } else {
      alert("Please upload a valid image file.");
    }
  };

 const handleSubmit = async (e) => {
    e.preventDefault();
    setBackendErrors({}); // Clear errors on retry

    const formData = new FormData();
    
    // Use the exact keys from your backend/Swagger model
    formData.append("BlogTitle", blogTitle);
    formData.append("BlogDescription", blogDescription);
    formData.append("BlogAuthor", blogAuthor);
    
    // DO NOT send a path string or "${url}/${selectedFile}". 
    // The backend expects the raw file object assigned to the "Image" key.
    if (selectedFile) {
      formData.append("Image", selectedFile); 
      console.dir(selectedFile.name);
    }

    // Debug: See exactly what is being sent in the browser console
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }

    try {
      await createPost(formData).unwrap();
      alert("Post Created Successfully! 🎉");
      navigate("/");
    } catch (err) {
      console.error("Failed to save: ", err);
      
      // Extract backend validation errors (handles both standard object lists and single messages)
      if (err?.data?.errors) {
        setBackendErrors(err.data.errors);
      } else if (err?.data?.message) {
        setBackendErrors({ global: err.data.message });
      } else {
        setBackendErrors({ global: "Something went wrong on the server." });
      }
    }
  };

  return (
    <div className="addPostCon">
      <form className="postDoc" onSubmit={handleSubmit}>
        <h2 style={{ color: "red" }}>Create New Blog</h2>
        
        {/* Global Error Notice */}
        {backendErrors.global && <p style={{ color: "red", margin: "0 0 10px 0" }}>{backendErrors.global}</p>}
        
        <input type="text" placeholder="Title" required onChange={(e) => setBlogTitle(e.target.value)} />
        {/* Title Error Display */}
        {backendErrors.BlogTitle && <p style={{ color: "red", fontSize: "12px", margin: "-5px 0 10px 0" }}>{backendErrors.BlogTitle}</p>}
        
        <input type="text" placeholder="Author" value={blogAuthor} onChange={(e) => setBlogAuthor(e.target.value)} />
        {/* Author Error Display */}
        {backendErrors.BlogAuthor && <p style={{ color: "red", fontSize: "12px", margin: "-5px 0 10px 0" }}>{backendErrors.BlogAuthor}</p>}
        
        <textarea placeholder="Description" rows="4" required onChange={(e) => setBlogDescription(e.target.value)}></textarea>
        {/* Description Error Display */}
        {backendErrors.BlogDescription && <p style={{ color: "red", fontSize: "12px", margin: "-5px 0 10px 0" }}>{backendErrors.BlogDescription}</p>}

        {/* Drag and Drop Zone */}
        <div 
          className="drop-zone"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
          onClick={() => fileInputRef.current.click()}
        >
          {selectedFile ? selectedFile.name : "Drag & Drop Image or Click to Browse"}
        </div>
        {/* Image Error Display */}
        {backendErrors.Image && <p style={{ color: "red", fontSize: "12px", margin: "5px 0 10px 0" }}>{backendErrors.Image}</p>}
        
        <input type="file" hidden ref={fileInputRef} onChange={(e) => handleFile(e.target.files[0])} />

        <button type="submit" className="loginBtn" disabled={isLoading}>
          {isLoading ? "Publishing..." : "Publish Post"}
        </button>
      </form>
    </div>
  );
}
export default AddPost;