import React, { useState } from "react";  
import { Link, useNavigate } from "react-router-dom";
import "./Signin.css";
import axios from "axios";

export default function Signin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // 1️⃣ Login request
      const res = await axios.post(
        "http://localhost:8080/LifelineJavaBackend/api/authentication/login",
        { email, password },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = res.data;

      // 2️⃣ Save tokens to localStorage
      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);

      // 3️⃣ Fetch profile to get role + username
      try {
        const profileRes = await axios.get(
          "http://localhost:8080/LifelineJavaBackend/api/authentication/profile",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${data.access}`,
            },
          }
        );

        const profileData = profileRes.data;

        // Save role, name and profile picture to localStorage
        localStorage.setItem("username", profileData.name || profileData.email);
        localStorage.setItem("userEmail", profileData.email);
        localStorage.setItem("role", profileData.role);
        if (profileData.profile_picture) {
          localStorage.setItem("profile_picture", profileData.profile_picture);
        }

        // ✅ Trigger welcome message for dashboards (only once after login)
        localStorage.setItem("showWelcome", "true");

        // Redirect based on role
        const role = (profileData.role || "").toLowerCase();
        if (role === "admin") {
          navigate("/dashboard");
        } else if (role === "emergencyservice" || role === "emergency service" || role === "hospital" || role === "police" || role === "dispatcher") {
          navigate("/emergency");
        } else {
          // fallback redirect
          navigate("/emergency");
        }

      } catch (profileErr) {
        console.error("Error fetching profile:", profileErr);
        setError("Login succeeded but failed to fetch profile.");
      }

    } catch (err) {
      if (err.response) {
        setError(err.response.data.detail || "Login failed");
      } else {
        setError("Something went wrong. Please try again.");
      }
      console.error("Login error:", err);
    }
  };

  return (
    <div className="signin-page">
      <div className="signin-container">
        <div className="signin-left">
          <div className="welcome-text">
            <h1>Welcome Page</h1>
            <p>Sign In To Your Account</p>
          </div>
        </div>

        <div className="signin-right">
          <h3><span className="good-morning">Good Morning</span></h3>
          <p className="login-text"><span className="login-highlight">Login</span></p>

          <form className="signin-form" onSubmit={handleSubmit}>
            <label>Email Address</label>
            <input 
              type="email" 
              placeholder="Email Address" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label>Password</label>
            <input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && <p style={{color:"red"}}>{error}</p>}

            <div className="form-options">
              <label><input type="checkbox" /> Remember</label>
              <a href="#" className="forgot-password">Forgot Password?</a>
            </div>

            <button type="submit">Submit</button>
          </form>

          <p className="create-account">
            <Link to="/Pack" style={{color:"blue"}}>Create Account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}