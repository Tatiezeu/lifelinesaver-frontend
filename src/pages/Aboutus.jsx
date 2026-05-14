import React from 'react';
import './Aboutus.css';
import { FaBolt, FaEye } from 'react-icons/fa';

// Team images
import brielImg from '../assets/briel.jpg';
import ivanImg from '../assets/ivan.jpg';
import rogerImg from '../assets/roger.jpg';

import Navbar from '../components/Navbar';
import Footer from './Footer';

const About = ({ hideNavbar }) => {
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      {!hideNavbar && <Navbar />}
     
      <section id="about">
        {/* Hero Section */}
        <div className="about-hero">
          <h2>About us</h2>
          <p>
            Discover the background, mission, and excellence that define Lifeline Saver.
          </p>
          <button className="explore-btn" onClick={() => scrollToSection('history')}>
            Explore
          </button>
        </div>

        {/* Sticky Tab Bar Below Hero */}
        <div className="about-tab-bar">
          <button onClick={() => scrollToSection('history')}>Our Background</button>
          <button onClick={() => scrollToSection('mission-vision')}>Mission & Vision</button>
          <button onClick={() => scrollToSection('team')}>Our Team</button>
        </div>

        {/* Optional History Section */}
        <div id="history" className="history-section">
          <h2 className="section-title">Our Background</h2>
          <p className="section-subtitle">
            Lifeline Saver was founded with a simple but powerful goal: to provide immediate, reliable emergency assistance and life-saving support to those in critical need. Born from a passion for saving lives and improving emergency response systems, we harness cutting-edge technology and compassionate care to make every second count.
          </p>
        </div>

        {/* Mission & Vision Section */}
        <div id="mission-vision" className="mission-vision-section">
          <h2 className="section-title">Mission & Vision</h2>
          <p className="section-subtitle">
           Guiding principles that shape every Lifeline Saver experience.

          </p>

          <div className="cards-container">
            <div className="card">
              <div className="card-icon blue"><FaBolt /></div>
              <h3>Our Mission</h3>
              <p>
                Our mission is to save lives by delivering fast, efficient, and accessible emergency response services worldwide. We strive to empower communities through education, advanced technology, and seamless coordination with healthcare and first responders to ensure help arrives when it matters most.
              </p>
              <ul>
                <li>Exceeding expectations through personalized emergency support</li>
                <li>Promoting awareness and education for safer communities</li>
              </ul>
            </div>

            <div className="card">
              <div className="card-icon pink"><FaEye /></div>
              <h3>Our Vision</h3>
              <p>
                We envision a world where no life is lost due to delayed or inaccessible emergency care. Lifeline Saver aims to be the global leader in lifesaving innovations, uniting technology and humanity to create safer, healthier communities everywhere.
              </p>
              <ul>
                <li>Global leader in rapid emergency response</li>
                <li>Promoter of community safety and prevention</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div id="team" className="team-section">
          <h2 className="section-title">Meet Our Team</h2>
          <p className="section-subtitle">Discover the dedicated individuals who made every experience exceptional.</p>

          <div className="team-cards">
            {[
              {
                name: 'Briel TATIEZEU',
                title: 'CO-ANALYST and CO-PROJECT MANAGER',
                desc: "Second Year Student at AICs CAMEROON",
                img: brielImg,
              },
              {
                name: 'Yvan TEKENG',
                title: 'CO-ANALYST and CO-PROJECT MANAGER',
                desc: "Second Year Student at AICs CAMEROON",
                img: ivanImg,
              },
              {
                name: 'Mr. Roger NDIFOR',
                title: 'Academic Supervisor',
                desc: "Lecturer at AICs CAMEROON",
                img: rogerImg,
              },
            ].map((member, index) => (
              <div key={index} className="team-card">
                <img src={member.img} alt={member.name} className="team-img" />
                <h3>{member.name}</h3>
                <p className="team-title">{member.title}</p>
                <p>{member.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
