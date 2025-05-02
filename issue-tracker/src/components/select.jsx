// src/components/select.jsx
import React from 'react';

const Select = ({ children, ...props }) => {
  return (
    <select className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" {...props}>
      {children}
    </select>
  );
};

const SelectTrigger = ({ children, ...props }) => {
  return <div {...props}>{children}</div>;
};

const SelectValue = ({ value }) => {
  return <span>{value}</span>;
};

const SelectContent = ({ children }) => {
  return <div>{children}</div>;
};

const SelectItem = ({ children, value, ...props }) => {
  return (
    <option value={value} {...props}>
      {children}
    </option>
  );
};

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };
