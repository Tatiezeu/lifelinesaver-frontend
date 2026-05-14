import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Signup.css";
import axios from "axios";

export default function Signup() {
  // const location = useLocation();
  const role = "emergencyservice"; // fixed role

  const [formData, setFormData] = useState({
    unitName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const getPasswordStrength = (pwd) => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[a-z]/.test(pwd)) strength++;
    if (/\d/.test(pwd)) strength++;
    if (/[!@#$%^&*()\-_=+{};:,<.>]/.test(pwd)) strength++;

    if (strength <= 2) return "Weak";
    if (strength === 3 || strength === 4) return "Medium";
    if (strength === 5) return "Strong";
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.unitName) newErrors.unitName = "Unit name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email address";

    if (!formData.password) newErrors.password = "Password is required";
    else {
      const pwd = formData.password;
      const strongPwdRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>]).{8,}$/;
      if (!strongPwdRegex.test(pwd))
        newErrors.password =
          "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.";
    }

    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Confirm password is required";
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    if (!formData.agree) newErrors.agree = "You must agree to the terms";

    return newErrors;
  };

  // ✅ Updated handleSubmit to call Django backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    
try {
  const res = await axios.post("http://127.0.0.1:8000/api/authentication/register/", {
    email: formData.email,
    password: formData.password,
    name: formData.unitName,
    role: role,
  }, {
    headers: { "Content-Type": "application/json" },
  });

  // Axios automatically parses JSON, so res.data contains the response body
  const data = res.data;

  console.log("Registered user:", data);
  alert("Signup successful!");
  window.location.href = "/payment"; // redirect to payment
} catch (err) {
  if (err.response) {
    // Server responded with an error
    setErrors({ api: err.response.data.detail || "Registration failed" });
  } else {
    // Network or other error
    setErrors({ api: "Something went wrong. Please try again." });
  }
  console.error(err);
}
  };
  return (
    <div className="signup-container">
      <div className="signup-left">
        <div className="welcome-text">
          <h1>Create Account</h1>
          <p>Join Us Today</p>
        </div>
      </div>

      <div className="signup-right">
        <h3>
          Welcome! <br />
          <span className="good-morning">Sign Up</span>
        </h3>
        <p className="login-text">Fill in the details below to get started</p>

        <form className="signup-form" onSubmit={handleSubmit}>
          {/* Unit Name */}
          <label>Emergency Unit Name</label>
          <input
            type="text"
            name="unitName"
            placeholder="Emergency Unit Name"
            value={formData.unitName}
            onChange={handleChange}
            required
          />
          {errors.unitName && <p className="error">{errors.unitName}</p>}

          {/* Email */}
          <label>Email Address</label>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && <p className="error">{errors.email}</p>}

          {/* Password */}
          <label>Password</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              style={{ width: "100%" }}
              required
            />
            <span
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {formData.password && (
            <p
              className={`password-strength ${getPasswordStrength(
                formData.password
              ).toLowerCase()}`}
            >
              Strength: {getPasswordStrength(formData.password)}
            </p>
          )}
          {errors.password && <p className="error">{errors.password}</p>}

          {/* Confirm Password */}
          <label>Confirm Password</label>
          <div className="password-wrapper">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              style={{ width: "100%" }}
              required
            />
            <span
              className="toggle-password"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {errors.confirmPassword && (
            <p className="error">{errors.confirmPassword}</p>
          )}

          {/* Terms */}
          <div className="form-options">
            <label>
              <input
                type="checkbox"
                name="agree"
                checked={formData.agree}
                onChange={handleChange}
                required
              />{" "}
              I agree to the <a href="#">Terms & Conditions</a>
            </label>
            {errors.agree && <p className="error">{errors.agree}</p>}
          </div>

          {/* Submit */}
          <button type="submit" className="submit-btn">
            Register & Continue to Payment
          </button>
          {errors.api && <p className="error">{errors.api}</p>}
        </form>

        <p className="already-account">
          Already have an account?{" "}
          <Link to="/signin" style={{ color: "blue" }}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
