import API from "../../API"; 
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BackArrow from '../../components/BackArrow';

const BASE_URL = "https://atumathias.pythonanywhere.com";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ username: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_new_password: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [showPassword, setShowPassword] = useState({
    current_password: false,
    new_password: false,
    confirm_new_password: false,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await API.get("/api/profile/");
        const userData = response.data;
        setUser(userData);
        setFormData({
          username: userData.username,
          email: userData.email,
        });
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile.");
      }
    };
    fetchProfile();
  }, []);

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    const maxSize = 2 * 1024 * 1024;

    if (!validTypes.includes(file.type)) {
      alert("Only JPEG, JPG and PNG images are allowed.");
      return;
    }

    if (file.size > maxSize) {
      alert("File size must be less than 2MB.");
      return;
    }

    setLoading(true);
    try {
      const formDataFile = new FormData();
      formDataFile.append("profile_picture", file);

      const response = await API.post(
        "/api/profile/profile-picture/",
        formDataFile,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const updatedUser = { ...user, profile_picture: response.data.profile_picture };
      setUser(updatedUser);
    } catch (err) {
      console.error("Error uploading profile picture:", err);
      setError("Failed to upload profile picture.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await API.patch("/api/profile/", formData);
      setUser((prev) => ({ ...prev, ...response.data }));
      setEditing(false);
      setError("");
    } catch (err) {
      console.error("Error updating profile:", err);
      // Try to get detailed backend errors if any
      if (err.response?.data) {
        const messages = Object.entries(err.response.data)
          .map(([key, value]) => `${key}: ${value}`)
          .join(" ");
        setError(messages || "Failed to update profile.");
      } else {
        setError("Failed to update profile.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleChangePassword = async () => {
    setPasswordError("");
    setPasswordSuccess("");

    if (passwordData.new_password !== passwordData.confirm_new_password) {
      setPasswordError("New passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await API.post("/api/profile/change_password/", {
        current_password: passwordData.current_password,
        new_password: passwordData.new_password,
        confirm_new_password: passwordData.confirm_new_password,
      });
      setPasswordSuccess(response.data.detail || "Password updated successfully.");
      setPasswordError("");
      setShowPasswordForm(false);
      setPasswordData({
        current_password: "",
        new_password: "",
        confirm_new_password: "",
      });
    } catch (err) {
      // Handle detailed error messages from backend, which might be a dict of errors
      if (err.response?.data) {
        if (typeof err.response.data === "string") {
          setPasswordError(err.response.data);
        } else if (err.response.data.detail) {
          setPasswordError(err.response.data.detail);
        } else {
          // Concatenate all errors
          const messages = Object.entries(err.response.data)
            .map(([key, value]) => `${key}: ${value}`)
            .join(" ");
          setPasswordError(messages || "Failed to update password. Check your current password.");
        }
      } else {
        setPasswordError("Failed to update password. Check your current password.");
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const getProfilePictureUrl = () => {
    if (user.profile_picture) {
      if (user.profile_picture.startsWith("http")) {
        return user.profile_picture;
      }
      return `${BASE_URL}${user.profile_picture}`;
    }
    return "https://atumathias.pythonanywhere.com/static/images/default-profile.png";
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      <BackArrow />
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-center">My Profile</h2>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
      )}

      <div className="flex flex-col items-center mb-6">
        <div className="relative">
          <img
            src={getProfilePictureUrl()}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover mb-4"
          />
          <input
            type="file"
            accept="image/jpeg, image/png, image/jpg"
            onChange={handleProfilePictureChange}
            disabled={loading}
            className="hidden"
            id="profile-picture-upload"
          />
          <label
            htmlFor="profile-picture-upload"
            className="absolute bottom-0 right-0 bg-blue-900 text-white p-2 rounded-full cursor-pointer"
          >
            Edit
          </label>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700">Full Name</label>
          <p className="mt-1 text-sm">{user.full_name}</p>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Username</label>
          {editing ? (
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              disabled={loading}
              className="mt-1 w-full p-2 border border-gray-300 rounded"
            />
          ) : (
            <p className="mt-1 text-sm">{user.username}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Email</label>
          {editing ? (
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={loading}
              className="mt-1 w-full p-2 border border-gray-300 rounded"
            />
          ) : (
            <p className="mt-1 text-sm">{user.email}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Role</label>
          <p className="mt-1 text-sm">{user.role}</p>
        </div>

        {user.role !== "admin" && (
          <div>
            <label className="text-sm font-medium text-gray-700">College</label>
            <p className="mt-1 text-sm">{user.college}</p>
          </div>
        )}

        <div className="flex gap-4 mt-6">
          {editing ? (
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 bg-blue-900 text-white px-4 py-2 rounded"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          ) : (
            <button
              onClick={() => {
                setError("");
                setEditing(true);
              }}
              disabled={loading}
              className="flex-1 bg-blue-900 text-white px-4 py-2 rounded"
            >
              Edit Profile
            </button>
          )}
          <button
            onClick={() => {
              setPasswordError("");
              setPasswordSuccess("");
              setShowPasswordForm(!showPasswordForm);
            }}
            disabled={loading}
            className="flex-1 bg-gray-600 text-white px-4 py-2 rounded"
          >
            Change Password
          </button>
        </div>

        {showPasswordForm && (
          <div className="mt-6 p-4 bg-gray-50 rounded border">
            <h3 className="text-lg font-medium mb-4">Change Password</h3>
            {passwordError && (
              <p className="text-red-600 mb-2">{passwordError}</p>
            )}
            {passwordSuccess && (
              <p className="text-green-600 mb-2">{passwordSuccess}</p>
            )}
            {["current_password", "new_password", "confirm_new_password"].map((field) => (
              <div key={field} className="mb-4">
                <label className="block text-sm font-medium text-gray-700 capitalize">
                  {field
                    .split("_")
                    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                    .join(" ")}
                </label>
                <div className="relative">
                  <input
                    type={showPassword[field] ? "text" : "password"}
                    name={field}
                    value={passwordData[field]}
                    onChange={handlePasswordChange}
                    className="mt-1 w-full p-2 border border-gray-300 rounded"
                  />
                </div>
              </div>
            ))}
            <button
              onClick={handleChangePassword}
              disabled={loading}
              className="w-full bg-blue-900 text-white px-4 py-2 rounded"
            >
              {loading ? "Changing..." : "Change Password"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
