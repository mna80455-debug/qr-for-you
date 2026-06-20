import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-btn font-medium transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
          {
            'bg-accent text-white hover:bg-accent-hover active:scale-[0.98] shadow-sm': variant === 'primary',
            'bg-white text-textDark hover:bg-neutral-50 border border-border shadow-sm': variant === 'secondary',
            'border border-border bg-transparent text-textDark hover:bg-neutral-50': variant === 'outline',
            'bg-transparent text-textDark hover:bg-neutral-50': variant === 'ghost',
            'h-8 px-3 text-sm': size === 'sm',
            'h-10 px-4 py-2 text-sm': size === 'md',
            'h-12 px-8 text-base': size === 'lg',
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
