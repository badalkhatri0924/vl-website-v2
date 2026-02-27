import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  children: React.ReactNode;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  children, 
  className = '',
  ...props 
}) => {
  const baseStyles = 'px-6 py-3 font-display font-bold text-sm uppercase tracking-ultra transition-all duration-500 flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
    primary: 'bg-accent hover:bg-accent-600 text-white border border-accent/20 hover:border-accent/40',
    secondary: 'bg-transparent border border-white/10 text-white hover:bg-white hover:text-obsidian-900',
    danger: 'bg-red-600 hover:bg-red-700 text-white border border-red-600 hover:border-red-500',
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

