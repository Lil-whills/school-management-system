import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'danger' | 'warning' | 'neutral' | 'info';
  size?: 'sm' | 'md';
  className?: string;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
  dot = false
}) => {
  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1'
  };

  const variantStyles = {
    primary: 'bg-[#FFA51F]/15 text-[#B26A00] border border-[#FFA51F]/30',
    success: 'bg-[#72D94B]/15 text-[#2C6E19] border border-[#72D94B]/30',
    danger: 'bg-[#DC5252]/15 text-[#A52020] border border-[#DC5252]/30',
    warning: 'bg-amber-100 text-amber-800 border border-amber-200',
    neutral: 'bg-[#F5F5F4] text-[#666666] border border-[#E7E2D9]',
    info: 'bg-blue-50 text-blue-700 border border-blue-200'
  };

  const dotColors = {
    primary: 'bg-[#FFA51F]',
    success: 'bg-[#72D94B]',
    danger: 'bg-[#DC5252]',
    warning: 'bg-amber-500',
    neutral: 'bg-[#666666]',
    info: 'bg-blue-500'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />}
      {children}
    </span>
  );
};
