import React from 'react';

interface ButtonProps {
  label: string;
  className?: string; // Made className optional
  onClick: () => void;
}

const Button: React.FC<ButtonProps> = ({ label, className = '', onClick }): JSX.Element => {
  return (
    <button className={className} onClick={onClick}>
      {label}
    </button>
  );
};

// Ensure the Button component is exported correctly
export default Button;