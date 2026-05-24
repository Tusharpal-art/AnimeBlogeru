import React from "react";
import { FaTwitter, FaGithub, FaInstagram, FaLinkedin, FaEnvelope, FaYoutube, FaFacebook } from "react-icons/fa";
// Import your image from your assets folder
 
function Contact() {
   
  return (
    <div className="contact-container"   >
      <div className="contact-card" style={{ textAlign: "center" }}>
        <div className="contact-header">
          <h1>Contact Us <span className="jp-accent">連絡</span></h1>
          <p>Have any questions, feedback, or business inquiries? Reach out to us directly!</p>
        </div>

        <div className="contact-info-section" style={{ margin: "40px 0" }}>
          <p style={{ color: "#aaa", marginBottom: "10px", fontSize: "14px", textTransform: "uppercase", tracking: "1px" }}>Official Email</p>
          
          {/* Clicking this automatically opens the user's default email client */}
          <a 
            href="mailto:ody17459@gmail.com" 
            className="contact-email-link"
            style={{ 
              display: "inline-flex", 
              alignItems: "center", 
              gap: "10px", 
              color: "#fff", 
              fontSize: "22px", 
              fontWeight: "bold", 
              textDecoration: "none",
              transition: "color 0.3s"
            }}
          >
            <FaEnvelope style={{ color: "#ff0000" }} /> ody17459@gmail.com
          </a>
        </div>

        <div className="contact-socials-section">
          <p style={{ color: "#aaa", marginBottom: "20px", fontSize: "14px", textTransform: "uppercase" }}>Follow Our Socials</p>
          <div className="contact-page-socials" style={{ display: "flex", justifyContent: "center", gap: "25px" }}>
           
            <a href="https://m.facebook.com/?next=https%3A%2F%2Fwww.facebook.com%2FDARK-AMV-X-110423225124386%2F" target="_blank" rel="noreferrer" className="contact-social-icon"><FaFacebook /></a>
            <a href="https://www.instagram.com/darkamvx?utm_source=qr&igshid=MzNlNGNkZWQ4Mg%3D%3D" target="_blank" rel="noreferrer" className="contact-social-icon"><FaInstagram /></a>
            <a href="https://youtube.com/@darkamv-x5822?si=8kJLzfTlPpCWIMhJ" target="_blank" rel="noreferrer" className="contact-social-icon"><FaYoutube/></a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;