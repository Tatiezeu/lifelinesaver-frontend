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

      const role = (data.role || "").toLowerCase();
      localStorage.setItem("username", data.name || "");
      localStorage.setItem("userEmail", data.email || email);
      localStorage.setItem("role", role);
      if (data.profile_picture) {
        localStorage.setItem("profile_picture", data.profile_picture);
      }
      localStorage.setItem("showWelcome", "true"); // Ensure welcome message shows on load

      // 3️⃣ Redirect based on role
      if (role === "admin") {
        navigate("/admin");
      } else if (role === "client") {
        navigate("/client");
      } else if (["emergency", "emergencyservice", "dispatcher", "paramedic"].includes(role)) {
        navigate("/emergency");
      } else if (role === "hospital") {
        navigate("/hospital");
      } else {
        setError("Role not recognized: " + role);
      }

    } catch (err) {
      console.error("Login error:", err);
      if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail);
      } else {
        setError("Invalid email or password. Please try again.");
      }
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