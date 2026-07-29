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
        <label htmlFor="email">Email: </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          id="email"
        ></input>
        <br></br>
        <br></br>
        <label htmlFor="password">Password: </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          id="password"
        ></input>
        <p>
          <Button text="Login" onClick={handleLogin} />
          <br></br>
          <br></br>
          Don't have an account?<br></br> <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}
