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

// Carousel images
import crash1 from '../assets/crash1.jpg';
import crash2 from '../assets/crash2.webp';
import crash3 from '../assets/crash3.webp';
import crash5 from '../assets/crash5.avif';

const images = [crash1, crash2, crash3, crash5];

const Home = () => {
  const [index, setIndex] = useState(0);

  // modal states
  const [showSignin, setShowSignin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); // Force start at top carousel
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
      <Services hideNavbar={true} />
      {/* Aboutus section */}
      <About hideNavbar={true} />
      {/* Contactus section */}
      <Contact hideNavbar={true} />
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
