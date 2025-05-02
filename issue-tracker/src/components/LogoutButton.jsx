import React from 'react';
import { useNavigate } from "react-router-dom";
import { logout } from "../API";  // Import the logout function

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Call logout function
    logout();
  };

  return (
    <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
      Logout
    </button>
  );
}

export default LogoutButton;

