import React, { useState } from "react";
import Button from "../components/Button.jsx";
import { Link } from "react-router-dom";
import "../styles/Auth.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  function handleForgotPassword() {
    console.log("Reset link requested for:", email);
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-logo">Nova AI</h1>

        <h2 className="auth-title">Forgot Password?</h2>

        <p className="auth-subtitle">
          Enter your registered email to reset your password.
        </p>

        <div className="auth-group">
          <label className="auth-label">Email</label>

          <input
            className="auth-input"
            type="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <Button
          className="auth-button"
          text="Send Reset Link"
          onClick={handleForgotPassword}
        />

        <div className="auth-footer">
          <p className="auth-account">
            Remember your password?{" "}
            <Link className="auth-link" to="/">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
