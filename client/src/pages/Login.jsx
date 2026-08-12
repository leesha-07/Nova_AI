import React, { useState } from "react";
import "../styles/Auth.css";
import Button from "../components/Button.jsx";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  async function handleLogin() {
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    const data = await response.json();

    console.log("STATUS:", response.status);
    console.log("RESPONSE:", data);
    if (response.ok) {
      navigate("/dashboard");
    } else {
      setMessage(data.message);
    }
  }
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
        <div>
          <Link to="/forgotPassword">Forgot Password ?</Link>
        </div>
        <Button className="auth-button" text="Login" onClick={handleLogin} />
        {message && <p>{message}</p>}
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
