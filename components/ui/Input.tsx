import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    const inputStyles = `w-full px-4 py-2.5 border rounded-lg font-sans text-luxury-charcoal bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
      error 
        ? 'border-red-500 focus:ring-red-500' 
        : 'border-luxury-cream focus:border-luxury-forest-green focus:ring-luxury-forest-green'
    } disabled:bg-luxury-cream/50 disabled:cursor-not-allowed ${className}`;
    
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-luxury-charcoal mb-1.5">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={inputStyles}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm text-red-600">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1.5 text-sm text-luxury-charcoal/60">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    const textareaStyles = `w-full px-4 py-2.5 border rounded-lg font-sans text-luxury-charcoal bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 resize-y ${
      error 
        ? 'border-red-500 focus:ring-red-500' 
        : 'border-luxury-cream focus:border-luxury-forest-green focus:ring-luxury-forest-green'
    } disabled:bg-luxury-cream/50 disabled:cursor-not-allowed ${className}`;
    
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-luxury-charcoal mb-1.5">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={textareaStyles}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm text-red-600">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1.5 text-sm text-luxury-charcoal/60">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: { value: string; label: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helperText, options, className = '', ...props }, ref) => {
    const selectStyles = `w-full px-4 py-2.5 border rounded-lg font-sans text-luxury-charcoal bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
      error 
        ? 'border-red-500 focus:ring-red-500' 
        : 'border-luxury-cream focus:border-luxury-forest-green focus:ring-luxury-forest-green'
    } disabled:bg-luxury-cream/50 disabled:cursor-not-allowed ${className}`;
    
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-luxury-charcoal mb-1.5">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={selectStyles}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="mt-1.5 text-sm text-red-600">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1.5 text-sm text-luxury-charcoal/60">{helperText}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
