// VerifyOTP.jsx

import React, { useState } from 'react';
import axios from 'axios';

const VerifyOTP = ({ token, onSuccess }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const verify = async () => {
    try {
      const res = await axios.post('/api/verify-otp/', { code }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      onSuccess();  // Proceed to the dashboard
    } catch (err) {
      setError(err.response?.data?.detail || 'Verification failed');
    }
  };

  return (
    <div>
      <h2>Enter OTP</h2>
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="6-digit OTP"
      />
      <button onClick={verify}>Verify</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default VerifyOTP;
