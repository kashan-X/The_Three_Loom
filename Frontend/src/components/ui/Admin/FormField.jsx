import React from 'react';

const FormField = ({ label, children }) => (
  <div className="mb-4">
    {label && <label className="block mb-1 text-gray-700 font-medium">{label}</label>}
    {children}
  </div>
);

export default FormField;
