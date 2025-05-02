import React, { useState } from "react";
import API from "../../API";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/api/forgot-password/", { email });
      setMessage(res.data.message || "Reset link sent to your email.");
    } catch (error) {
      console.error("Error sending reset link:", error);
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="form-wrapper">
          <h2 className="form-title">Forgot Password</h2>
          <form onSubmit={handleSubmit} className="center-content">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Enter your email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                required
              />
            </div>
            <button type="submit" className="login-btn">
              Send Reset Link
            </button>
            {message && (
              <p className="form-error mt-4 text-center">{message}</p>
            )}
          </form>
          <div className="form-footer">
            <Link to="/login" className="link">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
