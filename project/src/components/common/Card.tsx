import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverable = false,
  ...props
}) => {
  return (
    <div
      className={`bg-white rounded-2xl border border-[#E7E2D9] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] ${
        hoverable ? 'transition-all duration-200 hover:shadow-md hover:border-[#FFA51F]/40' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}> = ({ title, subtitle, action, className = '' }) => {
  return (
    <div className={`flex items-start justify-between gap-4 mb-4 ${className}`}>
      <div>
        <h3 className="text-base font-bold text-[#171717]">{title}</h3>
        {subtitle && <p className="text-xs text-[#666666] mt-0.5">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};
