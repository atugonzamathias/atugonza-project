import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../../API";

export default function ResetPassword() {
  const { uid, token } = useParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setMessage("");
      return;
    }

    try {
      setIsLoading(true);
      const res = await API.post(`/api/reset-password/${uid}/${token}/`,{
        password,
        confirm_password: confirmPassword
      });
      setMessage(res.data.message);
      setError("");
      setIsSuccess(true); // disable the button
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong.");
      setMessage("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="form-wrapper">
          <h2 className="form-title">Reset Your Password</h2>

          {message && (
            <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4 text-center">
              {message}
            </div>
          )}

          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-group">
              <label className="form-label">New Password</label>
              <input
                type="password"
                placeholder="New Password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isSuccess}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                placeholder="Confirm Password"
                className="form-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isSuccess}
              />
            </div>

            <button
              type="submit"
              className={`login-btn ${isSuccess ? "bg-green-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
              disabled={isLoading || isSuccess}
            >
              {isLoading ? "Processing..." : isSuccess ? "Password Reset" : "Reset Password"}
            </button>
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
