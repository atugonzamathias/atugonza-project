import React, { useState, useEffect } from 'react';
import API from "../../API";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [otp, setOtp] = useState(""); // OTP state
  const [otpRequired, setOtpRequired] = useState(false); // Flag to check if OTP is required
  const [loadingOtp, setLoadingOtp] = useState(false); // Flag to handle OTP verification loading

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    // Automatically verify OTP when 6 digits are entered
    if (otp.length === 6) {
      verifyOtp(otp);
    }
  }, [otp]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    try {
      const response = await API.post("/login/", formData);
  
      // ✅ Always save tokens immediately
      localStorage.setItem("accessToken", response.data.access);
      localStorage.setItem("refreshToken", response.data.refresh);
  
      if (response.data.otp_required) {
        setOtpRequired(true); // ✅ Show OTP input now
      } else {
        // ✅ OTP not needed, go straight to dashboard
        handleRoleRedirect(response.data.role);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  

  const verifyOtp = async (otp) => {
    setLoadingOtp(true);
    try {
      const accessToken = localStorage.getItem("accessToken");
  
      const response = await API.post(
        "/verify-otp/",
        { code: otp },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
  
      // ✅ Update tokens after successful OTP verification
      localStorage.setItem("accessToken", response.data.access);
      localStorage.setItem("refreshToken", response.data.refresh);
      localStorage.setItem("userRole", response.data.user.role);
  
      // ✅ Redirect based on role
      handleRoleRedirect(response.data.user.role);
  
    } catch (err) {
      setError("Invalid OTP, please try again.");
    } finally {
      setLoadingOtp(false);
    }
  };

  const handleRoleRedirect = (role) => {
    if (role === "student") navigate("/studdash");
    else if (role === "lecturer") navigate("/lectdash");
    else if (role === "registrar") navigate("/regdash");
    else navigate("/unknown-role");
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Login Form */}
        <div className="form-wrapper">
          <h2 className="form-title">Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username" className="form-label">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="Enter your Username"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                className="form-input"
              />
            </div>

            {error && <div className="form-error">{error}</div>}

            <button type="submit" disabled={loading} className="login-btn">
              {loading ? "LOGGING IN..." : "L O G I N"}
            </button>
          </form>

          <div className="form-footer">
            <p>Don't have an account? <Link to="/register" className="link">Register</Link></p>
            <p><Link to="/forgot-password" className="link">Forgot Password?</Link></p>
            <p><Link to="/" className="link">SIGN OUT</Link></p>
          </div>
        </div>

        {/* OTP Modal */}
        {otpRequired && (
          <div className="otp-modal">
            <h2>Enter OTP</h2>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="6-digit OTP"
              maxLength="6"
              className="otp-input"
            />
            {loadingOtp && <p>Verifying OTP...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;
