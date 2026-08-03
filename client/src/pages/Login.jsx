import React, { useState } from "react";
import "../styles/Auth.css";
import Button from "../components/Button.jsx";
import { Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    alert("Login button clicked");
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-logo">Nova AI</h1>

        <h2 className="auth-title">Welcome Back</h2>

        <p className="auth-subtitle">
          Sign in to continue to your productivity assistant.
        </p>

        <div className="auth-group">
          <label htmlFor="email" className="auth-label">
            Email
          </label>

          <input
            id="email"
            className="auth-input"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="auth-group">
          <label htmlFor="password" className="auth-label">
            Password
          </label>

          <input
            id="password"
            className="auth-input"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <Button className="auth-button" text="Login" onClick={handleLogin} />

        <div className="auth-footer">
          <p className="auth-account">
            Don't have an account?
            <Link className="auth-link" to="/register">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
