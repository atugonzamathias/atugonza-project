import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.jpg';
import '../global.css';

const Home = () => {
  return (
    <div
      style={{
        backgroundImage: `url(${logo})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        width: '100vw',
        position: 'relative',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      {/* Dark overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          padding: '0 1rem',
        }}
      >
        <h1
          style={{
            fontSize: '3.5rem',
            marginBottom: '1rem',
            fontWeight: 'bold',
            color: '#facc15', // <-- YELLOW COLOR HERE
            textShadow: '2px 2px 6px rgba(0, 0, 0, 0.8)',
          }}
        >
          Welcome to AITS
        </h1>

        <p
          style={{
            fontSize: '1.25rem',
            marginBottom: '2rem',
            maxWidth: '600px',
            color: '#ffffff',
          }}
        >
          Academic Issue Tracking System for students, lecturers, and registrars.
        </p>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/login">
            <button
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#2563eb',
                color: '#fff',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                cursor: 'pointer',
              }}
            >
              Login
            </button>
          </Link>

          <Link to="/register">
            <button
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#f3f4f6',
                color: '#111827',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                cursor: 'pointer',
              }}
            >
              Sign Up
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
