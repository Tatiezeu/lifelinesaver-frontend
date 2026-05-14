import React, { useState, useEffect } from 'react';
import './Home.css';
import Navbar from '../components/Navbar';
import Signin from '../components/Signin';
import Signup from '../components/Signup';
import Services from './Services';
import About from './Aboutus';
import Contact from './Contactus';
import Footer from './Footer'; // Ensure Footer is imported
// import { Contact } from 'lucide-react';

const images = [
  '/assets/crash1.jpg',
  '/assets/crash2.webp',
  '/assets/crash3.webp',
  '/assets/crash5.avif'
];

const Home = () => {
  const [index, setIndex] = useState(0);

  // modal states
  const [showSignin, setShowSignin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* Pass down handlers to Navbar */}
      <Navbar
        onSigninClick={() => setShowSignin(true)}
        onSignupClick={() => setShowSignup(true)}
      />

      <section id="home" className="home-container">
        <div
          className="carousel"
          style={{ backgroundImage: `url(${images[index]})` }}
        >
          <div className="carousel-overlay">
            <h1>
              YOUR SAFETY IS OUR PRIORITY{" "}
              <span className="brand">LIFELINE SAVER</span>
            </h1>
            <button
              className="shop-now"
              onClick={() => {
                document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Learn more →
            </button>
          </div>
        </div>
      </section>
      <section className="lifeline-intro-section">
  <div className="lifeline-content">
    <span className="lifeline-tagline">Where It All Begins</span>
    <h2 className="lifeline-title">Lifeline Saver</h2>
    <p className="lifeline-subtitle">
      Your Trusted Partner in Safety and Emergency Preparedness
    </p>
    <p className="lifeline-description">
      At Lifeline Saver, we’re dedicated to providing top-tier safety equipment and comprehensive training 
      to ensure that you and your loved ones are always prepared. We combine cutting-edge technology with 
      expert knowledge to save lives and build stronger, safer communities.
    </p>
  </div>
</section>


      {/* Services section */}
      <Services />
      {/* Aboutus section */}
      <About />
      {/* Contactus section */}
      <Contact />
      {/* Footer */}
      <Footer />
      {/* Popups with switch support */}
      {showSignin && (
        <Signin
          onClose={() => setShowSignin(false)}
          onSwitchToSignup={() => {
            setShowSignin(false);
            setShowSignup(true);
          }}
        />
      )}
      {showSignup && (
        <Signup
          onClose={() => setShowSignup(false)}
          onSwitchToSignin={() => {
            setShowSignup(false);
            setShowSignin(true);
          }}
        />
      )}
    </>
  );
};

export default Home;
