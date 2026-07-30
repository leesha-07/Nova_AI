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
        <h1>Nova AI</h1>
        <h2>Welcome Back</h2>
        <p>Sign in to continue</p>
        <div>
          {" "}
          <label htmlFor="email" className="auth-label">
            Email
          </label>
          <input
            placeholder="Email"
            className="auth-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            id="email"
          ></input>
        </div>
        <div>
          <label htmlFor="password" className="auth-label">
            Password{" "}
          </label>
          <input
            placeholder="Password"
            className="auth-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            id="password"
          ></input>
        </div>
        <p>
          <Button className="auth-button" text="Login" onClick={handleLogin} />
          <p className="auth-account">Don't have an account? </p>
          <Link className="auth-link" to="/register">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
