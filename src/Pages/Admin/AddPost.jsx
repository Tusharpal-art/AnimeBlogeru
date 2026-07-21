import { useState, useRef } from "react";
import { useCreatePostMutation } from "../../services/apiSlice";
import { useNavigate } from "react-router-dom";
import { useSelector  } from "react-redux";
import { jwtDecode } from "jwt-decode";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

function AddPost() {

     const { user } = useSelector((state) => state.auth);
   const decoded = user?.accessToken ? jwtDecode(user.accessToken) : null;
    const userName = decoded?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];

  const [blogTitle, setBlogTitle] = useState("");
  const [blogDescription, setBlogDescription] = useState("");
  const [blogAuthor, setBlogAuthor] = useState(userName);
  const [selectedFile, setSelectedFile] = useState(null);
   
  

  const [errors, setErrors] = useState({});





  

  const fileInputRef = useRef(null);
  const [createPost, { isLoading }] = useCreatePostMutation();
  const navigate = useNavigate();

  // Custom toolbar configuration for rich document formatting
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],
      ["link", "clean"],
    ],
  };

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
 
    const strippedDescription = blogDescription.replace(/<[^>]*>/g, "").trim();
    if (!strippedDescription) {
      newErrors.blogDescription = "Description is required";
    } else if (strippedDescription.length < 10) {
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
     // console.log(pair[0] + ': ' + pair[1]);
    }

    try {
      await createPost(formData).unwrap();
      alert("Post Created Successfully ");
      navigate("/");
    } catch (err) {
      console.error("Failed to save: ", err);



      alert("Failed to create post. Please try again.");



      
      // Extract backend validation errors (handles both standard object lists and single messages)
    

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
          value={userName}
          onChange={(e) => { setBlogAuthor(e.target.value); setErrors(prev => ({ ...prev, blogAuthor: null })) }}
          style={errors.blogAuthor ? { borderColor: "red" } : {}}
        />
        {errors.blogAuthor && <span style={{ color: "red", fontSize: "14px", alignSelf: "flex-start", marginTop: "-10px", marginBottom: "10px", marginLeft: "5px" }}>{errors.blogAuthor}</span>}
      
      
      <div style={{ width: "100%", marginBottom: "15px" }}>
          <ReactQuill
            theme="snow"
            value={blogDescription}
            onChange={(content) => {
              setBlogDescription(content);
              setErrors((prev) => ({ ...prev, blogDescription: null }));
            }}
            modules={modules}
            placeholder="Write your blog description here..."
            style={{
              backgroundColor: "#fff",
              borderRadius: "4px",
              border: errors.blogDescription ? "1px solid red" : "1px solid #ccc",
            }}
          />
          {errors.blogDescription && (
            <span style={{ color: "red", fontSize: "14px", alignSelf: "flex-start", marginTop: "5px", marginLeft: "5px" }}>
              {errors.blogDescription}
            </span>
          )}
        </div>
        
        
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