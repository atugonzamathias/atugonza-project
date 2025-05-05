import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from "../../API";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpRequired, setOtpRequired] = useState(false);
  const [loadingOtp, setLoadingOtp] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    if (otp.length === 6) {
      verifyOtp(otp);
    }
  }, [otp]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await API.post("/login/", formData);

      localStorage.setItem("accessToken", response.data.access);
      localStorage.setItem("refreshToken", response.data.refresh);

      if (response.data.otp_required) {
        setOtpRequired(true);
        toast.info("OTP verification required", { autoClose: 10000 });
      } else {
        toast.success("Login successful!", { autoClose: 3000 });
        handleRoleRedirect(response.data.role);
      }

    } catch (err) {
      console.error("Login Error:", err);
      toast.error(err.response?.data?.message || "Invalid credentials. Please try again.", {
        autoClose: 15000,  // 15 seconds for error messages
      });
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (otpCode) => {
    setLoadingOtp(true);
    try {
      const accessToken = localStorage.getItem("accessToken");

      const response = await API.post(
        "/verify-otp/",
        { code: otpCode },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      localStorage.setItem("accessToken", response.data.access);
      localStorage.setItem("refreshToken", response.data.refresh);
      localStorage.setItem("userRole", response.data.user.role);

      toast.success("OTP verified successfully!", { autoClose: 10000 });
      handleRoleRedirect(response.data.user.role);

    } catch (err) {
      console.error("OTP Error:", err);
      toast.error("Invalid OTP, please try again.", { autoClose: 15000 });
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
        <div className="form-wrapper">
          <h2 className="form-title">Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
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
              <label htmlFor="password">Password</label>
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
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;
