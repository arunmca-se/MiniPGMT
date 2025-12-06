import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../utils/cn';
import { colors, type PriorityLevel, type StatusType } from '../../tokens/colors';

/**
 * Badge Component
 *
 * Displays priority levels, status, or other categorical information.
 * Uses design tokens for semantic colors.
 *
 * @example
 * <Badge variant="priority" priority="high">High Priority</Badge>
 * <Badge variant="status" status="inProgress">In Progress</Badge>
 */

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-neutral-100 text-neutral-800 border border-neutral-300',
        primary: 'bg-primary-100 text-primary-800 border border-primary-300',
        success: 'bg-success-light text-success-dark border border-success-main',
        error: 'bg-error-light text-error-dark border border-error-main',
        warning: 'bg-warning-light text-warning-dark border border-warning-main',
        info: 'bg-info-light text-info-dark border border-info-main',
      },
      size: {
        sm: 'text-xs px-2 py-0.5',
        md: 'text-sm px-2.5 py-0.5',
        lg: 'text-base px-3 py-1',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    Omit<VariantProps<typeof badgeVariants>, 'variant'> {
  /** Variant type */
  variant?: 'default' | 'primary' | 'success' | 'error' | 'warning' | 'info' | 'priority' | 'status';
  /** Priority level (only when variant="priority") */
  priority?: PriorityLevel;
  /** Status type (only when variant="status") */
  status?: StatusType;
  /** Show dot indicator */
  dot?: boolean;
  /** Icon to display */
  icon?: React.ReactNode;
  /** Show label text (for PriorityBadge/StatusBadge) */
  showLabel?: boolean;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size, priority, status, dot, icon, children, style, showLabel, ...props }, ref) => {
    // Determine styling based on variant
    let customStyle = style || {};
    let displayVariant = variant;

    if (variant === 'priority' && priority) {
      const priorityColors = colors.priority[priority];
      customStyle = {
        ...customStyle,
        backgroundColor: priorityColors.bg,
        color: priorityColors.text,
        borderColor: priorityColors.border,
      };
      displayVariant = 'default'; // Use default variant structure with custom colors
    } else if (variant === 'status' && status) {
      const statusColors = colors.status[status];
      customStyle = {
        ...customStyle,
        backgroundColor: statusColors.bg,
        color: statusColors.text,
        borderColor: statusColors.border,
      };
      displayVariant = 'default';
    }

    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ variant: displayVariant as any, size }), className)}
        style={customStyle}
        {...props}
      >
        {dot && (
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: customStyle.color as string }}
          />
        )}
        {icon && <span className="inline-flex">{icon}</span>}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

// Specialized Badge variants for common use cases
export const PriorityBadge = React.forwardRef<
  HTMLSpanElement,
  Omit<BadgeProps, 'variant'> & { priority: PriorityLevel; showLabel?: boolean }
>(({ priority, showLabel = true, children, ...props }, ref) => (
  <Badge ref={ref} variant="priority" priority={priority} {...props}>
    {children || (showLabel ? priority.charAt(0).toUpperCase() + priority.slice(1) : null)}
  </Badge>
));

PriorityBadge.displayName = 'PriorityBadge';

export const StatusBadge = React.forwardRef<
  HTMLSpanElement,
  Omit<BadgeProps, 'variant'> & { status: StatusType }
>(({ status, ...props }, ref) => {
  const statusLabels: Record<StatusType, string> = {
    todo: 'To Do',
    inProgress: 'In Progress',
    inReview: 'In Review',
    blocked: 'Blocked',
    done: 'Done',
  };

  return (
    <Badge ref={ref} variant="status" status={status} dot {...props}>
      {props.children || statusLabels[status]}
    </Badge>
  );
});

StatusBadge.displayName = 'StatusBadge';

export default Badge;
