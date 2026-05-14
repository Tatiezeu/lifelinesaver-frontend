import React from 'react';
import './Services.css';
import { FaBolt, FaExclamationTriangle, FaLocationArrow, FaAmbulance } from 'react-icons/fa';
import Navbar from '../components/Navbar';


const servicesList = [
  { icon: <FaBolt />, title: 'Automatic Alerts' },
  { icon: <FaExclamationTriangle />, title: 'Accident Detection' },
  { icon: <FaLocationArrow />, title: 'Localisation' },
  { icon: <FaAmbulance />, title: 'Emergency Response' },
];

const Services = () => {
  return (
    <>
     
      <section id="services" className="services-section">
        
        {/* Hero section with background image */}
        <div className="services-hero">
          <h2>Our Services</h2>
          <p>Smart and responsive assistance for every critical situation.</p>
          <button className="discover-btn">Explore</button>
        </div>

        {/* Services cards section */}
        <div className="services-cards">
          {servicesList.map((service, index) => (
            <div key={index} className="service-card">
              <div className="service-icon">{service.icon}</div>
              <h3 className="service-title">{service.title}</h3>
            </div>
          ))}
        </div>
      </section>
     
    </>
  );
};

export default Services;
