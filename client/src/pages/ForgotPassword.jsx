import { useState } from "react";
import Button from "../components/Button.jsx";
import { Link } from "react-router-dom";
import "../styles/Auth.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleForgotPassword() {
    setMessage("");
    setMessageType("");

    if (!email.trim()) {
      setMessage("Please enter your registered email.");
      setMessageType("error");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Unable to send reset email.");
        setMessageType("error");
        return;
      }

      setMessage(
        data.message || "Password reset link has been sent to your email.",
      );
      setMessageType("success");
    } catch (error) {
      console.error("Forgot password error:", error);
      setMessage("Unable to connect to the server. Please try again.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-logo">
          <span>✨</span> Nova AI
        </h1>

        <h2 className="auth-title">Forgot Password?</h2>

        <p className="auth-subtitle">
          Enter your registered email and we will send you a password reset
          link.
        </p>

        <div className="auth-group">
          <label className="auth-label" htmlFor="reset-email">
            Email
          </label>

          <input
            id="reset-email"
            className="auth-input"
            type="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </div>

        <Button
          className="auth-button"
          text={loading ? "Sending..." : "Send Reset Link"}
          onClick={handleForgotPassword}
          disabled={loading}
        />

        {message && (
          <p className={`auth-message ${messageType}`} role="status">
            {message}
          </p>
        )}

        <div className="auth-footer">
          <p className="auth-account">
            Remember your password?
            <Link className="auth-link" to="/">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
