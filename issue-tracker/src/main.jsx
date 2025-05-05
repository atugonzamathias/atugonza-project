import React from 'react';
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Register from "./pages/auth/Register.jsx";
import Login from "./pages/auth/login.jsx";
import Assign from "./pages/registrar/Assign.jsx";
import Registrardash from "./pages/registrar/Registrardash.jsx";
import Dashbord from "./pages/students/Dashbord.jsx";
import Submission from "./pages/students/Submission.jsx";
import Issues from "./pages/students/issues.jsx";
import Profile from "./pages/students/Profile.jsx";
import Profsettings from "./pages/auth/Profsettings.jsx";
import Selectrole from "./pages/auth/Selectrole.jsx";
import Home from "./pages/home.jsx";
import ForgotPassword from "./pages/auth/ForgotPassword.jsx";
import ResetPassword from "./pages/auth/ResetPassword.jsx";
import LecturerDashboard from "./pages/lecturer/Lecturerdash.jsx";
import NotificationsPage from "./pages/NotificationPage.jsx"; 
import ResolveIssue from "./pages/lecturer/ResolveIssue";
import NotFound from "./pages/auth/NotFound.jsx";
import './global.css';
import './index.css';

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      {/* ToastContainer should appear once and be outside Routes */}
      <ToastContainer 
        position="top-right"
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"  // You can use "dark" too
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />
        <Route path="/selectrole" element={<Selectrole />} />
        <Route path="/profsettings" element={<Profsettings />} />
        <Route path="/studdash" element={<Dashbord />} />
        <Route path="/submission" element={<Submission />} />
        <Route path="/issues" element={<Issues />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/regdash" element={<Registrardash />} />
        <Route path="/lectdash" element={<LecturerDashboard />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/assign/:id" element={<Assign />} />
        <Route path="/resolve/:id" element={<ResolveIssue />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
