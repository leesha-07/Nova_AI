import React from "react";
import { useState } from "react";
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
        <h1>Nova AI</h1>
        <h2>Create Account</h2>
        <p>Join Nova AI and start being productive</p>
        <div>
          <label htmlFor="name" className="auth-label">
            Name{" "}
          </label>
          <input
            placeholder="Name"
            className="auth-input"
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></input>
        </div>

        <div>
          <label htmlFor="email" className="auth-label">
            Email{" "}
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

        <div>
          <label htmlFor="confirmPassword" className="auth-label">
            Confirm Password
          </label>
          <input
            placeholder="Confirm Password"
            className="auth-input"
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          ></input>
        </div>
        <p>
          <Button
            className="auth-button"
            text="Register"
            onClick={handleRegister}
          />
          <p className="auth-account">Already have an account?</p>
          <Link className="auth-link" to="/">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
