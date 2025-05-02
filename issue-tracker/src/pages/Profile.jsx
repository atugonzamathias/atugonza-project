// ProfilePage.jsx
// This file contains the user profile page component with functionality for:
// - Viewing and editing user profile information
// - Updating profile picture
// - Changing password

import React, { useState, useEffect } from "react";
// UI Components from shadcn/ui
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// Icons from lucide-react
import { Eye, EyeOff } from "lucide-react";
// API service
import api from "../services/api"; // Adjust path as needed for your API configuration

const ProfilePage = () => {
  // State management
  const [user, setUser] = useState({});
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ username: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/userprofile/");
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

  // Handle profile picture update
  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png"];
    const maxSize = 2 * 1024 * 1024; // 2MB

    if (!validTypes.includes(file.type)) {
      alert("Only JPEG and PNG images are allowed.");
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
      const response = await api.post("/userprofile/profile-picture/", formDataFile, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // Update profile picture URL from response
      setUser((prev) => ({ ...prev, ...response.data }));
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

  // Update profile details (username and email)
  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await api.put("/userprofile/", formData);
      setUser((prev) => ({ ...prev, ...response.data }));
      setEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  // Handle changes in password form fields
  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  // Change password
  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/userprofile/change_password/", {
        current_password: passwordData.currentPassword,
        new_password: passwordData.newPassword,
        confirm_new_password: passwordData.confirmPassword,
      });
      setPasswordSuccess(response.data.detail || "Password updated successfully.");
      setPasswordError("");
      setShowPasswordForm(false);
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setPasswordError(
        err.response?.data?.detail ||
          "Failed to update password. Check your current password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    // Card component for overall profile container
    <Card className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      {/* CardHeader component for title */}
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">My Profile</CardTitle>
      </CardHeader>
      {/* CardContent component for main content */}
      <CardContent>
        {/* Error display */}
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
            {error}
          </div>
        )}

        {/* Profile Picture Section */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <img
              src={user.profile_picture || "/default-profile.png"}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover mb-4"
            />
            {/* File input for profile picture */}
            <input
              type="file"
              accept="image/jpeg, image/png"
              onChange={handleProfilePictureChange}
              disabled={loading}
              className="hidden"
              id="profile-picture-upload"
            />
            <label
              htmlFor="profile-picture-upload"
              className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer"
            >
              Edit
            </label>
          </div>
        </div>

        {/* User Information Form */}
        <div className="space-y-4">
          {/* Full Name Field */}
          <div>
            <Label className="block text-sm font-medium text-gray-700">Full Name</Label>
            <p className="mt-1 text-sm">{user.full_name}</p>
          </div>

          {/* Username Field */}
          <div>
            <Label className="block text-sm font-medium text-gray-700">Username</Label>
            {editing ? (
              <Input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                disabled={loading}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
              />
            ) : (
              <p className="mt-1 text-sm">{user.username}</p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <Label className="block text-sm font-medium text-gray-700">Email</Label>
            {editing ? (
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={loading}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
              />
            ) : (
              <p className="mt-1 text-sm">{user.email}</p>
            )}
          </div>

          {/* Role Field */}
          <div>
            <Label className="block text-sm font-medium text-gray-700">Role</Label>
            <p className="mt-1 text-sm">{user.role}</p>
          </div>

          {/* College Field (conditional) */}
          {user.role !== "admin" && (
            <div>
              <Label className="block text-sm font-medium text-gray-700">College</Label>
              <p className="mt-1 text-sm">{user.college}</p>
            </div>
          )}

          {/* Button Group */}
          <div className="flex space-x-4 mt-6">
            {editing ? (
              <Button onClick={handleSave} disabled={loading} className="w-full">
                {loading ? "Saving..." : "Save"}
              </Button>
            ) : (
              <Button
                onClick={() => setEditing(true)}
                disabled={loading}
                className="w-full"
              >
                Edit Profile
              </Button>
            )}
            <Button
              onClick={() => setShowPasswordForm(!showPasswordForm)}
              disabled={loading}
              className="w-full bg-gray-500 text-white hover:bg-gray-600 disabled:opacity-50"
            >
              Change Password
            </Button>
          </div>

          {/* Password Change Form (conditional) */}
          {showPasswordForm && (
            <div className="mt-6 p-4 bg-gray-50 rounded-md">
              <h3 className="text-lg font-semibold mb-4">Change Password</h3>
              <div className="space-y-4">
                {/* Current Password Input */}
                <Input
                  type="password"
                  name="currentPassword"
                  placeholder="Current Password"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  disabled={loading}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                />
                {/* New Password Input */}
                <Input
                  type="password"
                  name="newPassword"
                  placeholder="New Password"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  disabled={loading}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                />
                {/* Confirm Password Input */}
                <Input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm New Password"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  disabled={loading}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                />

                {/* Error and Success Messages */}
                {passwordError && (
                  <p className="text-red-500 text-sm mt-2">{passwordError}</p>
                )}
                {passwordSuccess && (
                  <p className="text-green-500 text-sm mt-2">{passwordSuccess}</p>
                )}

                {/* Update Password Button */}
                <Button
                  onClick={handleChangePassword}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? "Updating..." : "Update Password"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfilePage;