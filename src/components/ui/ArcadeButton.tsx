import React from 'react';
import { soundManager } from '../../audio/soundManager';

interface ArcadeButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  glow?: boolean;
  pulse?: boolean;
  icon?: React.ReactNode;
}

export const ArcadeButton: React.FC<ArcadeButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  glow = true,
  pulse = false,
  icon,
  className = '',
  onClick,
  ...props
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    soundManager.playClick();
    if (onClick) onClick(e);
  };

  const variantStyles = {
    primary: 'bg-gradient-to-r from-[#00F0FF] to-[#0080FF] text-[#080811] border-[#00F0FF] hover:brightness-110 shadow-[0_0_20px_rgba(0,240,255,0.4)]',
    secondary: 'bg-[#151528] text-white border-white/20 hover:border-[#00F0FF] hover:text-[#00F0FF] hover:bg-[#1c1c36]',
    accent: 'bg-gradient-to-r from-[#FF007F] to-[#B000FF] text-white border-[#FF007F] hover:brightness-110 shadow-[0_0_20px_rgba(255,0,127,0.4)]',
    danger: 'bg-gradient-to-r from-[#FF0055] to-[#FF4500] text-white border-[#FF0055] hover:brightness-110 shadow-[0_0_20px_rgba(255,0,85,0.4)]',
    success: 'bg-gradient-to-r from-[#00FF66] to-[#00CC44] text-[#080811] border-[#00FF66] hover:brightness-110 shadow-[0_0_20px_rgba(0,255,102,0.4)]'
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs font-bold rounded-lg',
    md: 'px-5 py-2.5 text-sm font-black rounded-xl tracking-wider',
    lg: 'px-7 py-3.5 text-base font-black rounded-2xl tracking-widest',
    xl: 'px-8 py-4 text-xl font-black rounded-2xl tracking-widest'
  };

  return (
    <button
      onClick={handleClick}
      className={`
        relative inline-flex items-center justify-center gap-2 select-none
        font-arcade uppercase border transition-all duration-150 active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${pulse ? 'animate-pulse' : ''}
        ${className}
      `}
      {...props}
    >
      {icon && <span className="text-lg leading-none">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};

