import React from 'react';

const Button = ({ children, ...props }) => {
  return (
    <button
      className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none"
      {...props}
    >
      {children}
    </button>
  );
};

export { Button };
