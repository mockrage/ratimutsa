import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className = '', children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variantStyles = {
      primary: 'bg-luxury-forest-green text-white hover:bg-luxury-garden-lime hover:shadow-lg hover:-translate-y-0.5 focus:ring-luxury-forest-green',
      secondary: 'bg-luxury-teakwood text-white hover:bg-luxury-windsor-oak hover:shadow-lg hover:-translate-y-0.5 focus:ring-luxury-teakwood',
      outline: 'border-2 border-luxury-forest-green text-luxury-forest-green hover:bg-luxury-forest-green hover:text-white hover:shadow-md focus:ring-luxury-forest-green',
      ghost: 'text-luxury-charcoal hover:bg-luxury-cream hover:text-luxury-forest-green focus:ring-luxury-charcoal'
    };
    
    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm rounded-md',
      md: 'px-5 py-2.5 text-base rounded-lg',
      lg: 'px-7 py-3.5 text-lg rounded-xl'
    };
    
    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
