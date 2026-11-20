import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Button from "../components/Button.jsx";
import "../styles/Auth.css";
import API_BASE_URL from "../config/api";
function ResetPassword() {
  const { resetToken } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setMessageType("");

    if (!resetToken) {
      setMessage("Invalid or missing reset link.");
      setMessageType("error");
      return;
    }

    if (newPassword.length < 8) {
      setMessage("Password must be at least 8 characters.");
      setMessageType("error");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      setMessageType("error");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resetToken,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Unable to reset password.");
        setMessageType("error");
        return;
      }

      setMessage("Password reset successfully! Redirecting to login...");
      setMessageType("success");

      setTimeout(() => navigate("/"), 1500);
    } catch (error) {
      console.error("Reset password error:", error);
      setMessage("Unable to connect to the server. Please try again.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1 className="auth-logo">
          <span>✨</span> Nova AI
        </h1>

        <h2 className="auth-title">Reset Password</h2>

        <p className="auth-subtitle">
          Create a new password for your Nova AI account.
        </p>

        <div className="auth-group">
          <label className="auth-label" htmlFor="newPassword">
            New Password
          </label>

          <input
            id="newPassword"
            className="auth-input"
            type="password"
            placeholder="Enter your new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            minLength={8}
            autoComplete="new-password"
            required
          />
        </div>

        <div className="auth-group">
          <label className="auth-label" htmlFor="confirmPassword">
            Confirm Password
          </label>

          <input
            id="confirmPassword"
            className="auth-input"
            type="password"
            placeholder="Confirm your new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            minLength={8}
            autoComplete="new-password"
            required
          />
        </div>

        {message && (
          <p className={`auth-message ${messageType}`} role="status">
            {message}
          </p>
        )}

        <Button
          className="auth-button"
          text={loading ? "Resetting..." : "Reset Password"}
          disabled={loading}
          type="submit"
        />

        <div className="auth-footer">
          <p className="auth-account">
            Remember your password?
            <Link className="auth-link" to="/">
              Login
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default ResetPassword;
