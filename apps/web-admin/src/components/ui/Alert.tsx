import type { ReactNode } from 'react';

interface AlertProps {
  children: ReactNode;
  variant?: 'error' | 'success' | 'warning' | 'info';
  className?: string;
}

export function Alert({ children, variant = 'error', className = '' }: AlertProps) {
  const variants = {
    error: 'bg-danger/10 border-danger/20 text-danger',
    success: 'bg-success/10 border-success/20 text-success',
    warning: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-700',
    info: 'bg-primary/10 border-primary/20 text-primary',
  };

  return (
    <div className={`p-4 rounded-lg border ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
}
