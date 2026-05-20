import { useState, useRef } from "react";
import { useCreatePostMutation } from "../../services/apiSlice";
import { useNavigate } from "react-router-dom";

function AddPost() {
  const [blogTitle, setBlogTitle] = useState("");
  const [blogDescription, setBlogDescription] = useState("");
  const [blogAuthor, setBlogAuthor] = useState("Admin");
  const [selectedFile, setSelectedFile] = useState(null);

  const [errors, setErrors] = useState({});



  const fileInputRef = useRef(null);
  const [createPost, { isLoading }] = useCreatePostMutation();
  const navigate = useNavigate();

  const handleFile = (file) => {
    if (file && file.type.startsWith("image/")) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        setErrors((prev) => ({ ...prev, selectedFile: "Image size must be less than 2MB" }));
        setSelectedFile(null);
      } else {
        setSelectedFile(file);
        setErrors((prev) => ({ ...prev, selectedFile: null }));
      }
    } else {
      setErrors((prev) => ({ ...prev, selectedFile: "Please upload a valid image file." }));
      setSelectedFile(null);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!blogTitle.trim()) {
      newErrors.blogTitle = "Title is required";
    } else if (blogTitle.trim().length < 10) {
      newErrors.blogTitle = "Title must be at least 10 characters long";
    }

    if (!blogAuthor.trim()) {
      newErrors.blogAuthor = "Author is required";
    } else if (blogAuthor.trim().length < 3) {
      newErrors.blogAuthor = "Author must be at least 3 characters long";
    }

    if (!blogDescription.trim()) {
      newErrors.blogDescription = "Description is required";
    } else if (blogDescription.trim().length < 10) {
      newErrors.blogDescription = "Description must be at least 10 characters long";
    }

    if (!selectedFile) {
      newErrors.selectedFile = "Image is required";
      
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    //setBackendErrors({}); // Clear errors on retry

    if (!validateForm()) return;

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


      alert("Failed to create post. Please try again.");


    }
  };

  return (
    <div className="addPostCon">
      <form className="postDoc" onSubmit={handleSubmit}>
        <h2 style={{ color: "red" }}>Create New Blog</h2>


        
        
        <input
          type="text"
          placeholder="Title"
          value={blogTitle}
          onChange={(e) => { setBlogTitle(e.target.value); setErrors(prev => ({ ...prev, blogTitle: null })) }}
          style={errors.blogTitle ? { borderColor: "red" } : {}}
        />
        {errors.blogTitle && <span style={{ color: "red", fontSize: "14px", alignSelf: "flex-start", marginTop: "-10px", marginBottom: "10px", marginLeft: "5px" }}>{errors.blogTitle}</span>}

        <input
          type="text"
          placeholder="Author"
          value={blogAuthor}
          onChange={(e) => { setBlogAuthor(e.target.value); setErrors(prev => ({ ...prev, blogAuthor: null })) }}
          style={errors.blogAuthor ? { borderColor: "red" } : {}}
        />
        {errors.blogAuthor && <span style={{ color: "red", fontSize: "14px", alignSelf: "flex-start", marginTop: "-10px", marginBottom: "10px", marginLeft: "5px" }}>{errors.blogAuthor}</span>}

        <textarea
          placeholder="Description"
          rows="4"
          value={blogDescription}
          onChange={(e) => { setBlogDescription(e.target.value); setErrors(prev => ({ ...prev, blogDescription: null })) }}
          style={errors.blogDescription ? { borderColor: "red" } : {}}
        ></textarea>
        {errors.blogDescription && <span style={{ color: "red", fontSize: "14px", alignSelf: "flex-start", marginTop: "-10px", marginBottom: "10px", marginLeft: "5px" }}>{errors.blogDescription}</span>}

        
        
        {/* Drag and Drop Zone */}
        <div
          className="drop-zone"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
          onClick={() => fileInputRef.current.click()}
          style={errors.selectedFile ? { border: "2px dashed red" } : {}}
        >
          {selectedFile ? selectedFile.name : "Drag & Drop Image or Click to Browse"}
        </div>


        {errors.selectedFile && <span style={{ color: "red", fontSize: "14px", alignSelf: "flex-start", marginTop: "5px", marginLeft: "5px" }}>{errors.selectedFile}</span>}


        <input type="file" hidden ref={fileInputRef} onChange={(e) => handleFile(e.target.files[0])} />

        <button type="submit" className="loginBtn" disabled={isLoading}>
          {isLoading ? "Publishing..." : "Publish Post"}
        </button>
      </form>
    </div>
  );
}
export default AddPost;