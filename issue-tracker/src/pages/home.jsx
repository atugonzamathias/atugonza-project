import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.jpg';
import '../global.css'; // Ensure the path is correct

const Home = () => {
  return (
    <div 
      className="container"
      style={{
        height: '100vh', // Full viewport height
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div className="center-content">
        <img
          src={logo}
          alt="AITS Logo"
          style={{ width: '100px', height: '100px', marginBottom: '20px' }}
        />

        <h1 className="mb-4">Welcome to AITS</h1>
        <p className="mb-4">
          Academic Issue Tracking System for students, lecturers, and registrars.
        </p>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/login">
            <button>Login</button>
          </Link>
          <Link to="/register">
            <button style={{ backgroundColor: '#e5e7eb', color: '#111827' }}>
              SIGN UP
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
