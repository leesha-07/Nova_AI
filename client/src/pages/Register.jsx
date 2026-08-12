import React, { useState } from "react";
import Button from "../components/Button.jsx";
import { Link } from "react-router-dom";
import "../styles/Auth.css";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleRegister() {
    const response = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        name: name,
        email: email,
        password: password,
        confirmPassword: confirmPassword,
      }),
    });

    const data = await response.json();

    console.log("STATUS:", response.status);
    console.log("RESPONSE:", data);

    setMessage(data.message);
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
        {message && <p>{message}</p>}
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
