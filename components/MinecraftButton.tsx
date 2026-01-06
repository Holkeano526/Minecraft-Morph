
import React from 'react';

interface MinecraftButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'danger' | 'success';
  className?: string;
}

const MinecraftButton: React.FC<MinecraftButtonProps> = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  ...props 
}) => {
  const variantStyles = {
    primary: 'bg-gray-600 border-gray-400 border-b-gray-800 border-r-gray-800',
    danger: 'bg-red-700 border-red-500 border-b-red-900 border-r-red-900',
    success: 'bg-green-700 border-green-500 border-b-green-900 border-r-green-900',
  };

  return (
    <button
      className={`mc-button font-minecraft text-[10px] md:text-xs text-white px-6 py-3 tracking-widest uppercase transition-all flex items-center justify-center gap-2 ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default MinecraftButton;
