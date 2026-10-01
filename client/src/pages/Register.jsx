import React, { useState } from "react";
import "../styles/Auth.css";
import Button from "../components/Button.jsx";
import { Link } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  async function handleRegister() {
    setMessage("");

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setMessage("All fields are required");
      return;
    }

    if (name.trim().length < 2) {
      setMessage("Name must be at least 2 characters long");
      return;
    }

    if (password.length < 8) {
      setMessage("Password must be at least 8 characters long");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
          confirmPassword,
        }),
      });

      const data = await response.json();

      console.log("STATUS:", response.status);
      console.log("RESPONSE:", data);

      setMessage(data.message);

      if (response.ok) {
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      console.error("Registration Error:", error);

      setMessage("Unable to connect to the server. Please try again later.");
    }
  }
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-logo">
          <span>✨</span> Nova AI
        </h1>

        <h2 className="auth-title">Create Account</h2>

        <p className="auth-subtitle">
          Join Nova AI and start being productive.
        </p>

        <div className="auth-group">
          <label className="auth-label">Name</label>

          <input
            className="auth-input"
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="auth-group">
          <label className="auth-label">Email</label>

          <input
            className="auth-input"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="auth-group">
          <label className="auth-label">Password</label>

          <input
            className="auth-input"
            type="password"
            placeholder="Create password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="auth-group">
          <label className="auth-label">Confirm Password</label>

          <input
            className="auth-input"
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <Button
          className="auth-button"
          text="Register"
          onClick={handleRegister}
        />

        {message && <p className={`auth-message ${messageType}`}>{message}</p>}

        <div className="auth-footer">
          <p className="auth-account">
            Already have an account?
            <Link className="auth-link" to="/">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
