import React from 'react';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import './Footer.css'; // renamed CSS file

const Footer = () => {
  return (
    <section id="footer-section">
      <footer className="contact-footer">
        <div className="container">
          <div className="footer-columns">
            {/* Logo & Description */}
            <div className="footer-column">
              <img
                src="/assets/logo.jpg"
                alt="Lifeline Saver Logo"
                className="footer-logo"
              />
              <h3>Lifeline Saver</h3>
              <p>
                Empowering lives through smart emergency response, real-time alerts,
                and safety technology.
              </p>
              <div className="social-icons">
                <a href="#"><i className="fab fa-twitter" /></a>
                <a href="#"><i className="fab fa-facebook-f" /></a>
                <a href="#"><i className="fab fa-instagram" /></a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-column">
              <h4>Quick Links</h4>
              <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About Us</a></li>
                <li><a href="#services">Services</a></li>
                <li><a href="#contact">Contact Us</a></li>
              </ul>
            </div>

            {/* Services */}
            <div className="footer-column">
              <h4>Services</h4>
              <ul>
                <li>Automatic Alerts</li>
                <li>Accident Detection</li>
                <li>Localisation</li>
                <li>Emergency Response</li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="footer-column">
              <h4>Contact</h4>
              <ul className="contact-info">
                <li><FaMapMarkerAlt className="icon" /> Yaounde, Cameroon</li>
                <li><FaPhoneAlt className="icon" /> +237 676 61 25 97</li>
                <li><FaEnvelope className="icon" /> tatiezeub@gmail.com</li>
                <li><FaPhoneAlt className="icon" /> +237 686 99 98 83</li>
                <li><FaEnvelope className="icon" /> tekengyvan@gmail.com</li>
              </ul>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="bottom-footer">
            <ul className="bottom-links">
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Use</a></li>
              <li><a href="#">Accessibility</a></li>
              <li><a href="#">Careers</a></li>
            </ul>
            <p>© 2025 Lifeline Saver. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </section>
  );
};

export default Footer;
