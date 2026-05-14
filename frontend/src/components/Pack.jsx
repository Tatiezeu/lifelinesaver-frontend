import React, { useState, useEffect } from "react";
import "./pack.css";
import { Link } from "react-router-dom";

const Pack = () => {
  // State for demo button 1
  const [loading1, setLoading1] = useState(false);
  const [progress1, setProgress1] = useState(0);
  const [message1, setMessage1] = useState("");

  // State for demo button 2
  const [loading2, setLoading2] = useState(false);
  const [progress2, setProgress2] = useState(0);
  const [message2, setMessage2] = useState("");

  // Simulate progress for Hospital Package
  useEffect(() => {
    if (!loading1) return;
    const interval = setInterval(() => {
      setProgress1((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setLoading1(false);
          setMessage1("Request sent successfully!");
          setTimeout(() => setMessage1(""), 2000);
          return 100;
        }
        return prev + 2;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [loading1]);

  // Simulate progress for Police Package
  useEffect(() => {
    if (!loading2) return;
    const interval = setInterval(() => {
      setProgress2((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setLoading2(false);
          setMessage2("Request sent successfully!");
          setTimeout(() => setMessage2(""), 2000);
          return 100;
        }
        return prev + 2;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [loading2]);

  return (
    <div>
      <h1 className="pricing-title">Choose Your Plan</h1>

      <div className="pricing-container">
        {/* Hospital Package */}
        <div className="pricing-card">
          <div className="pricing-header hospital">
            <h2>Hospital Package</h2>
            <p className="price">
              25,000 XAF <span>/month</span>
            </p>
          </div>
          <ul className="features">
            <li>✔ Live Map with Real-Time Alerts</li>
            <li>✔ Accept Alerts & Set Response Time</li>
            <li>✔ SOS History & Monthly Statistics</li>
            <li>✔ Real-Time Message Notifications</li>
            <li>✔ Full Settings & Customization</li>
          </ul>
          <div className="trial-info">
            <p>
              <strong>14-Day Trial</strong> by paying <b>6,250 XAF</b> caution
              fee
            </p>
            <p>(Deducted from first payment if continued)</p>
          </div>
          <div className="buttons">
            {/* Pass role "hospital" to signup form */}
            <Link to="/signup" state={{ role: "hospital" }}>
              <button className="subscribe-btn">Subscribe</button>
            </Link>

            <div className="demo-button-wrapper">
              <button
                className="demo-btn"
                onClick={() => {
                  setLoading1(true);
                  setProgress1(0);
                  setMessage1("");
                }}
                disabled={loading1}
              >
                {loading1 ? "Sending..." : "Request Demo"}
              </button>

              {loading1 && (
                <div className="demo-progress-bar">
                  <div
                    className="demo-progress"
                    style={{ width: `${progress1}%` }}
                  ></div>
                </div>
              )}

              {message1 && (
                <div className="demo-success-message">{message1}</div>
              )}
            </div>
          </div>
        </div>

        {/* Police Package */}
        <div className="pricing-card">
          <div className="pricing-header police">
            <h2>Police Package</h2>
            <p className="price">
              30,000 XAF <span>/month</span>
            </p>
          </div>
          <ul className="features">
            <li>✔ Live Map with Real-Time Alerts</li>
            <li>✔ Accept Alerts & Set Response Time</li>
            <li>✔ SOS History & Monthly Statistics</li>
            <li>✔ Real-Time Message Notifications</li>
            <li>✔ Full Settings & Customization</li>
          </ul>
          <div className="trial-info">
            <p>
              <strong>14-Day Trial</strong> by paying <b>7,500 XAF</b> caution
              fee
            </p>
            <p>(Deducted from first payment if continued)</p>
          </div>
          <div className="buttons">
            {/* Pass role "police" to signup form */}
            <Link to="/signup" state={{ role: "police" }}>
              <button className="subscribe-btn">Subscribe</button>
            </Link>

            <div className="demo-button-wrapper">
              <button
                className="demo-btn"
                onClick={() => {
                  setLoading2(true);
                  setProgress2(0);
                  setMessage2("");
                }}
                disabled={loading2}
              >
                {loading2 ? "Sending..." : "Request Demo"}
              </button>

              {loading2 && (
                <div className="demo-progress-bar">
                  <div
                    className="demo-progress"
                    style={{ width: `${progress2}%` }}
                  ></div>
                </div>
              )}

              {message2 && (
                  <div className="demo-success-message">{message2}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pack;
