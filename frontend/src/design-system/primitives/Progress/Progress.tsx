import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import { cn } from '../../../utils/cn';

/**
 * Progress Component
 *
 * Displays progress with visual feedback.
 * Perfect for project completion, task progress, etc.
 *
 * @example
 * <Progress value={75} />
 * <Progress value={50} variant="success" showLabel />
 */

interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  /** Progress value (0-100) */
  value?: number;
  /** Visual variant */
  variant?: 'default' | 'success' | 'warning' | 'error';
  /** Show percentage label */
  showLabel?: boolean;
  /** Size of the progress bar */
  size?: 'sm' | 'md' | 'lg';
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value = 0, variant = 'default', showLabel = false, size = 'md', ...props }, ref) => {
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  const variantClasses = {
    default: 'bg-primary-500',
    success: 'bg-success-main',
    warning: 'bg-warning-main',
    error: 'bg-error-main',
  };

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-neutral-700">Progress</span>
          <span className="text-sm font-semibold text-neutral-900">{value}%</span>
        </div>
      )}
      <ProgressPrimitive.Root
        ref={ref}
        className={cn(
          'relative overflow-hidden rounded-full bg-neutral-200 w-full',
          sizeClasses[size],
          className
        )}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className={cn(
            'h-full w-full flex-1 transition-all duration-500 ease-out',
            variantClasses[variant]
          )}
          style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
        />
      </ProgressPrimitive.Root>
    </div>
  );
});
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress, type ProgressProps };
export default Progress;
