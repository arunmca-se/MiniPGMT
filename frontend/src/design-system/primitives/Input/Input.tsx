import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../utils/cn';

/**
 * Input Component
 *
 * A professional input component with variants and states.
 * Consumes design tokens for consistent styling.
 *
 * @example
 * <Input type="text" placeholder="Enter text..." />
 * <Input variant="error" helperText="This field is required" />
 */

const inputVariants = cva(
  'flex w-full rounded-md border bg-white px-3 py-2 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'border-neutral-300 focus-visible:ring-primary-500 hover:border-neutral-400',
        error:
          'border-error-main focus-visible:ring-error-main',
        success:
          'border-success-main focus-visible:ring-success-main',
      },
      inputSize: {
        sm: 'h-8 text-xs',
        md: 'h-10 text-sm',
        lg: 'h-12 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      inputSize: 'md',
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  /** Label for the input */
  label?: string;
  /** Helper text below the input */
  helperText?: string;
  /** Error message (automatically sets variant to error) */
  error?: string;
  /** Left icon/element */
  leftElement?: React.ReactNode;
  /** Right icon/element */
  rightElement?: React.ReactNode;
  /** Wrapper className */
  wrapperClassName?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      variant,
      inputSize,
      label,
      helperText,
      error,
      leftElement,
      rightElement,
      wrapperClassName,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    const displayVariant = error ? 'error' : variant;
    const displayHelperText = error || helperText;

    return (
      <div className={cn('w-full', wrapperClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-neutral-700 mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftElement && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
              {leftElement}
            </div>
          )}
          <input
            id={inputId}
            className={cn(
              inputVariants({ variant: displayVariant, inputSize }),
              leftElement && 'pl-10',
              rightElement && 'pr-10',
              className
            )}
            ref={ref}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500">
              {rightElement}
            </div>
          )}
        </div>
        {displayHelperText && (
          <p
            className={cn(
              'mt-1.5 text-xs',
              error ? 'text-error-main' : 'text-neutral-600'
            )}
          >
            {displayHelperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
