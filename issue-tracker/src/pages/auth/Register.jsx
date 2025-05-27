import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";  // <-- Import the icons
import API from "../../API";
import "../../global.css";

export default function RegisterForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    role: "",
    college: "",
    user_number: "",
    registration_number: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const colleges = [
    "COCIS", "CEDAT", "CONAS", "CAES", "CHUSS", "COBAMS", "COVAB", "SOL", "KAES"
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const dataToSend = { ...formData };

    // Clean up irrelevant fields based on role
    if (formData.role === "student") {
      delete dataToSend.lecturer_number;
    } else if (formData.role === "lecturer") {
      delete dataToSend.registration_number;
    } else if (formData.role === "registrar") {
      delete dataToSend.user_number;
      delete dataToSend.registration_number;
    }

    try {
      const response = await API.post("/api/auth/register/", dataToSend);
      setSuccess(true);

      localStorage.setItem("otp_email", formData.email);

      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.detail ||
        "Registration failed. Please try again.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderRoleSpecificFields = () => {
    if (formData.role === "student") {
      return (
        <>
          <div className="form-field">
            <label htmlFor="user_number">Student Number</label>
            <input
              id="user_number"
              name="user_number"
              type="text"
              placeholder="e.g. 2100701234"
              value={formData.user_number}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="registration_number">Registration Number</label>
            <input
              id="registration_number"
              name="registration_number"
              type="text"
              placeholder="e.g. 21/U/12345/PS"
              value={formData.registration_number}
              onChange={handleChange}
              required
            />
          </div>
        </>
      );
    } else if (formData.role === "lecturer") {
      return (
        <div className="form-field">
          <label htmlFor="user_number">Lecturer Number</label>
          <input
            id="user_number"
            name="user_number"
            type="text"
            placeholder="e.g. LEC00123"
            value={formData.user_number}
            onChange={handleChange}
            required
          />
        </div>
      );
    }
    return null;
  };

  return (
    <div className="container">
      <h2 className="form-title">Register</h2>

      {success ? (
        <div className="p-4 bg-green-50 text-green-700 rounded-md">
          Registration successful! Redirecting to login...
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 text-sm bg-red-50 border border-red-200 text-red-600 rounded-md">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-field">
              <label htmlFor="first_name">First Name</label>
              <input
                id="first_name"
                name="first_name"
                type="text"
                value={formData.first_name}
                onChange={handleChange}
                required
                className="input-field"
              />
            </div>

            <div className="form-field">
              <label htmlFor="last_name">Last Name</label>
              <input
                id="last_name"
                name="last_name"
                type="text"
                value={formData.last_name}
                onChange={handleChange}
                required
                className="input-field"
              />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              required
              className="input-field"
            />
          </div>

          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="e.g : username@gmail.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="input-field"
            />
          </div>

          <div className="form-field">
            <label htmlFor="password">Password</label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                required
                className="input-field pr-16"
                style={{
                  color: "black", // <-- set password text color black
                  backgroundColor: "white" // <-- ensure background is visible
                }}
              />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="input-field"
            >
              <option value="" disabled>Select Role</option>
              <option value="student">Student</option>
              <option value="lecturer">Lecturer</option>
              <option value="registrar">Registrar</option>
            </select>
          </div>

          {renderRoleSpecificFields()}

          <div className="form-field">
            <label htmlFor="college">College</label>
            <select
              id="college"
              name="college"
              value={formData.college}
              onChange={handleChange}
              required
              className="input-field"
            >
              <option value="" disabled>Select College</option>
              {colleges.map((college) => (
                <option key={college} value={college}>{college}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Registering..." : "Register"}
          </button>

          <div className="flex gap-4 mt-4">
            <Link to="/login" className="link">Already have an account? Login</Link>
            <Link to="/" className="link">Home</Link>
          </div>
        </form>
      )}
    </div>
  );
}
