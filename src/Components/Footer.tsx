import React from "react";
import { Link } from "react-router-dom";
import { FaTwitter, FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="burogu-footer">
      <div className="footer-top">
        {/* Brand Section */}
        <div className="footer-brand">
          <h2>Burogu <span className="jp-text">ブログ</span></h2>
          <p>Your ultimate destination for rich stories, deep reads, and creative insights.</p>
          <div className="footer-socials">
            <a href="https://twitter.com" target="_blank" rel="noreferrer"><FaTwitter /></a>
            <a href="https://github.com" target="_blank" rel="noreferrer"><FaGithub /></a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer"><FaInstagram /></a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer"><FaLinkedin /></a>
          </div>
        </div>

        {/* Quick Links Section */}
        <div className="footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/addpost">Write a Blog</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        {/* Newsletter Section */}
        <div className="footer-newsletter">
          <h3>Subscribe to Newsletter</h3>
          <p>Get the latest blogs delivered straight to your inbox.</p>
          <form onSubmit={(e) => e.preventDefault()} className="newsletter-form">
            <input type="email" placeholder="Enter your email" required />
            <button type="submit">Join</button>
          </form>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {currentYear} Burogu. All rights reserved.</p>
        <div className="footer-bottom-links">
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;