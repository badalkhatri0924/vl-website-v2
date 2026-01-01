import React from 'react';

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
  className?: string;
}

export const Label: React.FC<LabelProps> = ({ children, className = '', ...props }) => {
  return (
    <label 
      className={`block text-sm font-display font-bold uppercase tracking-ultra text-slate-400 mb-2 ${className}`}
      {...props}
    >
      {children}
    </label>
  );
};

