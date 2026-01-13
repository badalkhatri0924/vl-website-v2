import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  return (
    <div 
    className={`bg-obsidian-950/60 backdrop-blur-3xl border border-blue-500/25 rounded-2xl transition-colors duration-200 hover:bg-gray-800/60 ${className}`}
    onClick={onClick}
    >
      {children}
    </div>
  );
};

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`${className}`}>
      {children}
    </div>
  );
};

