import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'success';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 font-medium',
    md: 'text-sm px-4 py-2 gap-2 font-semibold',
    lg: 'text-base px-5 py-2.5 gap-2.5 font-semibold'
  };

  const variantStyles = {
    primary: 'bg-[#FFA51F] hover:bg-[#F29412] text-[#171717] font-bold shadow-sm shadow-[#FFA51F]/30 focus:ring-[#FFA51F]',
    secondary: 'bg-[#F5F5F4] hover:bg-[#E7E2D9] text-[#171717] focus:ring-stone-300',
    outline: 'border border-[#E7E2D9] hover:bg-[#FFF8ED] text-[#171717] focus:ring-[#FFA51F]',
    danger: 'bg-[#DC5252] hover:bg-red-700 text-white focus:ring-red-400',
    ghost: 'hover:bg-black/5 text-[#666666] hover:text-[#171717] focus:ring-stone-300',
    success: 'bg-[#72D94B] hover:bg-green-600 text-[#171717] font-bold focus:ring-green-400'
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
          {children}
          {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
        </>
      )}
    </button>
  );
};
