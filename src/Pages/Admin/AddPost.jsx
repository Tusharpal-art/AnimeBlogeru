import { useState, useRef } from "react";
import { useCreatePostMutation } from "../../services/apiSlice";
import { useNavigate } from "react-router-dom";

  function AddPost() {
  const [blogTitle, setBlogTitle] = useState("");
  const [blogDescription, setBlogDescription] = useState("");
  const [blogAuthor, setBlogAuthor] = useState("Admin");
  const [selectedFile, setSelectedFile] = useState(null);
  
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
    }
  };

  return (
    <div className="addPostCon">
      <form className="postDoc" onSubmit={handleSubmit}>
        <h2 style={{ color: "red" }}>Create New Blog</h2>
        
        <input type="text" placeholder="Title" required onChange={(e) => setBlogTitle(e.target.value)} />
        <input type="text" placeholder="Author" value={blogAuthor} onChange={(e) => setBlogAuthor(e.target.value)} />
        <textarea placeholder="Description" rows="4" required onChange={(e) => setBlogDescription(e.target.value)}></textarea>

        {/* Drag and Drop Zone */}
        <div 
          className="drop-zone"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
          onClick={() => fileInputRef.current.click()}
        >
          {selectedFile ? selectedFile.name : "Drag & Drop Image or Click to Browse"}
        </div>
        
        <input type="file" hidden ref={fileInputRef} onChange={(e) => handleFile(e.target.files[0])} />

        <button type="submit" className="loginBtn" disabled={isLoading}>
          {isLoading ? "Publishing..." : "Publish Post"}
        </button>
      </form>
    </div>
  );
}
export default AddPost;