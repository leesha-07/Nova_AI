import React, { useState } from "react";
import Button from "../components/Button.jsx";
import { Link } from "react-router-dom";
import "../styles/Auth.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showResetForm, setShowResetForm] = useState(false);

  async function handleForgotPassword() {
    if (!email) {
      alert("Please enter your registered email");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      setResetToken(data.resetToken);
      setShowResetForm(true);

      alert("Reset token generated successfully");
    } catch (error) {
      console.error("Forgot password error:", error);
      alert("Something went wrong. Please try again.");
    }
  }

  async function handleResetPassword() {
    if (!resetToken) {
      alert("Reset token is required");
      return;
    }

    if (!newPassword) {
      alert("Please enter your new password");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            resetToken: resetToken,
            newPassword: newPassword,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      alert("Password reset successfully");

      setEmail("");
      setResetToken("");
      setNewPassword("");
      setShowResetForm(false);
    } catch (error) {
      console.error("Reset password error:", error);
      alert("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-logo">
          <span>✨</span> Nova AI
        </h1>

        {!showResetForm ? (
          <>
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
              text="Generate Reset Token"
              onClick={handleForgotPassword}
            />

            <div className="auth-footer">
              <p className="auth-account">
                Remember your password?
                <Link className="auth-link" to="/">
                  Login
                </Link>
              </p>
            </div>
          </>
        ) : (
          <>
            <h2 className="auth-title">Reset Password</h2>

            <p className="auth-subtitle">
              Enter your reset token and create a new password.
            </p>

            <div className="auth-group">
              <label className="auth-label">Reset Token</label>

              <input
                className="auth-input"
                type="text"
                value={resetToken}
                onChange={(e) => setResetToken(e.target.value)}
              />
            </div>

            <div className="auth-group">
              <label className="auth-label">New Password</label>

              <input
                className="auth-input"
                type="password"
                placeholder="Enter your new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <Button
              className="auth-button"
              text="Reset Password"
              onClick={handleResetPassword}
            />

            <div className="auth-footer">
              <p className="auth-account">
                Remember your password?
                <Link className="auth-link" to="/">
                  Login
                </Link>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
