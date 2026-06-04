import React from "react";
import { Link } from "react-router-dom";
import { FaShieldAlt, FaLock, FaUserShield, FaEnvelope } from "react-icons/fa";

function PrivacyPolicy() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="privacy-container" style={{
      maxWidth: "900px",
      margin: "80px auto 40px auto",
      padding: "40px",
      color: "#e0e0e0",
      backgroundColor: "#0b0b0b",
      borderRadius: "12px",
      border: "1px solid #222",
      boxShadow: "0 8px 32px rgba(0,0,0,0.5)"
    }}>
      
      {/* Header Section */}
      <div className="privacy-header" style={{ borderBottom: "2px solid #ff0000", paddingBottom: "20px", marginBottom: "30px" }}>
        <h1 style={{ display: "flex", alignItems: "center", gap: "15px", margin: 0, color: "#fff", fontSize: "2.5rem" }}>
          <FaShieldAlt style={{ color: "#ff0000" }} /> Privacy Policy <span style={{ color: "#ff0000", fontSize: "1.5rem" }}>規約</span>
        </h1>
        <p style={{ color: "#888", margin: "10px 0 0 0", fontSize: "14px" }}>Last Updated: June 2, {currentYear}</p>
      </div>

      <p style={{ lineHeight: "1.6", color: "#b3b3b3" }}>
        Welcome to <strong>Burogu</strong>. We are deeply committed to protecting your personal information and your right to privacy. This policy outlines how we handle your data when you interact with our posts, write comments, or upload custom blog elements.
      </p>

      {/* Section 1 */}
      <section style={{ margin: "35px 0" }}>
        <h2 style={{ color: "#fff", borderBottom: "1px solid #222", paddingBottom: "8px", fontSize: "1.5rem" }}>
          1. Data Collection <span style={{ color: "#ff0000", fontSize: "1rem" }}>収集</span>
        </h2>
        <p style={{ lineHeight: "1.6" }}>We collect information directly from you when you actively use our blog ecosystem:</p>
        <ul style={{ paddingLeft: "20px", lineHeight: "1.8", color: "#ccc" }}>
          <li><strong>Account Data:</strong> Display names, profile avatar strings, and security credentials processed via your authorization state.</li>
          <li><strong>Content Submission:</strong> Blog text updates, descriptions, and structural records you submit when editing posts.</li>
          <li><strong>Media Uploads:</strong> Binary image streams processed through form arrays whenever you change post banner imagery.</li>
        </ul>
      </section>

      {/* Section 2 */}
      <section style={{ margin: "35px 0" }}>
        <h2 style={{ color: "#fff", borderBottom: "1px solid #222", paddingBottom: "8px", fontSize: "1.5rem" }}>
          2. How We Secure Data <span style={{ color: "#ff0000", fontSize: "1rem" }}>安全</span>
        </h2>
        <p style={{ lineHeight: "1.6" }}>
          We employ standard security protocols across our networks to block unauthorized configuration tampering or leaks. Rest assured, your personal logs are never traded or leased to commercial distribution networks.
        </p>
      </section>

      {/* Section 3 */}
      <section style={{ margin: "35px 0" }}>
        <h2 style={{ color: "#fff", borderBottom: "1px solid #222", paddingBottom: "8px", fontSize: "1.5rem" }}>
          3. Media File Handling <span style={{ color: "#ff0000", fontSize: "1rem" }}>画像</span>
        </h2>
        <p style={{ lineHeight: "1.6" }}>
          When uploading images, any file exceeding our standard <strong>2MB size threshold</strong> or failing our strict image extension check is instantly caught and dropped locally before touching our backend databases.
        </p>
      </section>

      {/* Section 4 */}
      <section style={{ margin: "35px 0", padding: "20px", background: "#111", borderRadius: "8px", borderLeft: "4px solid #ff0000" }}>
        <h3 style={{ margin: "0 0 10px 0", color: "#fff" }}>Questions or Concerns?</h3>
        <p style={{ margin: "0 0 15px 0", color: "#aaa", lineHeight: "1.5" }}>
          If you wish to correct your profile listings, pull down data entries, or terminate account tracking, feel free to drop our support desk a message.
        </p>
        <Link to="/contact" style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          color: "#fff",
          backgroundColor: "#ff0000",
          textDecoration: "none",
          padding: "10px 20px",
          borderRadius: "4px",
          fontWeight: "bold",
          fontSize: "14px",
          transition: "background 0.2s ease"
        }}
        onMouseOver={(e) => e.target.style.backgroundColor = "#cc0000"}
        onMouseOut={(e) => e.target.style.backgroundColor = "#ff0000"}
        >
          <FaEnvelope /> Open Contact Desk
        </Link>
      </section>
    </div>
  );
}

export default PrivacyPolicy;