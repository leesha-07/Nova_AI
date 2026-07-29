import React from "react";
import { useState } from "react";
import Button from "../components/Button.jsx";
import { Link } from "react-router-dom";
import "../styles/Register.css";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  function handleRegister() {
    alert("Registration Done");
  }
  return (
    <div>
      <h1>Nova AI</h1>
      <h2>Create Account</h2>
      <p>Join Nova AI and start being productive</p>
      <label htmlFor="name">Name: </label>
      <input
        type="text"
        id="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      ></input>
      <br></br>
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
      <br></br>
      <label htmlFor="confirmPassword">Confirm Password</label>
      <input
        type="password"
        id="confirmPassword"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      ></input>
      <p>
        <Button text="Register" onClick={handleRegister} />
        <br></br>
        <br></br>
        Already have an account ? <br></br>
        <Link to="/">Login</Link>
      </p>
    </div>
  );
}
