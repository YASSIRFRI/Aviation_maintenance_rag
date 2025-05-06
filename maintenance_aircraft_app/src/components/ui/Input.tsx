import React from 'react';
import { cn } from '../../utils/cn';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  hint?: string;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      hint,
      leftElement,
      rightElement,
      size = 'md',
      fullWidth = false,
      ...props
    },
    ref
  ) => {
    const sizes = {
      sm: 'h-8 text-xs',
      md: 'h-10 text-sm',
      lg: 'h-12 text-base',
    };

    const baseInputStyles = cn(
      'bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm',
      'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      sizes[size],
      fullWidth ? 'w-full' : 'w-auto',
      error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''
    );

    const inputWithElementsStyles = cn(
      baseInputStyles,
      leftElement ? 'pl-10' : 'pl-4',
      rightElement ? 'pr-10' : 'pr-4'
    );

    return (
      <div className={cn('flex flex-col', fullWidth ? 'w-full' : 'w-auto', className)}>
        {label && (
          <label className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftElement && (
            <div className="absolute left-3 text-gray-400">{leftElement}</div>
          )}
          <input
            ref={ref}
            className={inputWithElementsStyles}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3 text-gray-400">{rightElement}</div>
          )}
        </div>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        {hint && !error && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;