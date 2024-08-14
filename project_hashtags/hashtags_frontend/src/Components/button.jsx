import React from 'react';

// Define a Button component that accepts props
const Button = ({ onClick, children, className }) => {
  return (
    <button onClick={onClick} className={`py-4 px-4 rounded ${className}`}>
      {children}
    </button>
  );
};

export default Button;
