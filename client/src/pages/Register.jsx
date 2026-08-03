import React, { useState } from "react";
import Button from "../components/Button.jsx";
import { Link } from "react-router-dom";
import "../styles/Auth.css";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  function handleRegister() {
    alert("Registration Done");
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-logo">Nova AI</h1>

        <h2 className="auth-title">Create Account</h2>

        <p className="auth-subtitle">
          Join Nova AI and start being productive.
        </p>

        <div className="auth-group">
          <label className="auth-label">Name</label>

          <input
            className="auth-input"
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
