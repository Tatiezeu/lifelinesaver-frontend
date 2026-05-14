// src/pages/Contact.jsx

import React from 'react';
import './Contactus.css';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaClock } from 'react-icons/fa';

const Contact = () => {
  return (
    <section id="contact" className="contact-section">
      
      {/* Hero Section */}
      <div className="contact-hero">
        <h2>Contact Us</h2>
        <button className="contact-btn">Write to us</button>
      </div>

      {/* Contact Info Cards */}
      <div className="contact-cards">
        <div className="contact-card">
          <FaPhoneAlt className="contact-icon" />
          <h3>Phone</h3>
          <p>+237 676 61 25 97</p>
          <p>+237 686 99 98 83</p>
          <span>Available 24/7 for support</span>
        </div>

        <div className="contact-card">
          <FaEnvelope className="contact-icon" />
          <h3>Email</h3>
          <p>support@lifelinesaver.com</p>
          <p>emergency@lifelinesaver.com</p>
          <span>Response within 2 hours during business hours</span>
        </div>

        <div className="contact-card">
          <FaMapMarkerAlt className="contact-icon" />
          <h3>Address</h3>
          <p>123 Lifeline Way</p>
          <p>Yaounde, Centre Region</p>
          <span>15 minutes from Yaounde Nsimalen International Airport</span>
        </div>

        <div className="contact-card">
          <FaClock className="contact-icon" />
          <h3>Support Hours</h3>
          <p>24/7 support service</p>
          <p>Live chat: 6:00am - 11:00pm</p>
          <span>We’re here to help you</span>
        </div>
      </div>

      {/* Message Form and Side Info */}
      <div className="contact-main">
        {/* Left - Form */}
        <div className="contact-form">
          <div className="contact-tabs">
            <button className="tab active">General Inquiry</button>
            <button className="tab">Emergency Assistance</button>
          </div>
          <form>
            <input type="text" placeholder="Full Name *" required />
            <input type="email" placeholder="Email Address *" required />
            <input type="text" placeholder="Phone Number" />
            <select>
              <option>Select a subject</option>
              <option>Technical Support</option>
              <option>Emergency</option>
            </select>
            <textarea placeholder="Your message *" required></textarea>
            <button type="submit" className="send-btn">Send</button>
          </form>
        </div>

        {/* Right - Quick & Emergency Contact */}
        <div className="contact-side">
          <div className="quick-contact">
            <h4>Quick Contact</h4>
            <div className="contact-info-box phone-box">
              <FaPhoneAlt className="icon" />
              <div>
                <p>Call</p>
                <p className="contact-detail">+237 676 61 25 97</p>
              </div>
            </div>
            <div className="contact-info-box email-box">
              <FaEnvelope className="icon" />
              <div>
                <p>Email</p>
                <p className="contact-detail">support@lifelinesaver.com</p>
              </div>
            </div>
          </div>

          <div className="emergency-contact">
            <h4>Emergency Contact</h4>
            <p>For emergencies outside business hours</p>
            <div className="emergency-number-box">
              +237 686 99 98 83
            </div>
            <span>24/7 emergency line</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
