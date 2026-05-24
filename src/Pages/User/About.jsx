import React from "react";
import { Link } from "react-router-dom";


function About() {
  return (
    <div className="about-container">
      <div className="about-hero">
        <h1>About Burogu <span className="jp-accent">ブログ</span></h1>
        <p className="subtitle">Where stories meet passion, and ideas come to life.</p>
      </div>

      <div className="about-content">
        <section className="about-section">
          <h2>Our Vision <span className="jp-sub">ビジョン</span></h2>
          <p>
            Welcome to <strong>Burogu</strong> (derived from the Japanese word for "Blog"). We built this platform 
            to act as a clean, engaging haven for writers, creators, anime enthusiasts, and thinkers to share 
            their stories with the world without boundaries.
          </p>
        </section>

        <section className="about-section middle">
          <h2>Why "Burogu"?</h2>
          <p>
            In Japanese culture, mindfulness, aesthetic balance, and intentional storytelling are highly valued. 
            We try to bring that exact same energy to our UI design—striking red accents against deep, immersive dark tones 
            to make your reading journey both visually stunning and incredibly comfortable.
          </p>
        </section>

        <div className="about-cta">
          <h3>Have a story itching to get out?</h3>
          <p>Join our ever-growing community of creative minds today.</p>
          <Link to="/addpost">
            <button className="cta-btn">Start Writing</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default About;