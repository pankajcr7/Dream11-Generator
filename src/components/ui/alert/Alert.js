import React from 'react';

const Alert = ({ children }) => (
  <div className="flex items-center bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
    {children}
  </div>
);

export default Alert;
