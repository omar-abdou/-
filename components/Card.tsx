import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => {
  return (
    <div className={`bg-brand-gray-medium border border-brand-gray-light rounded-lg shadow-lg p-4 sm:p-6 ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Card;