import * as React from 'react';
import { Card, CardContent } from '../../primitives/Card';
import { cn } from '../../../utils/cn';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

/**
 * StatCard Component
 *
 * Displays a key metric with optional trend indicator.
 * Used in dashboard for quick stats overview.
 */

export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string | number;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
}

export const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  ({ className, label, value, trend, trendValue, icon, variant = 'default', ...props }, ref) => {
    const variantStyles = {
      default: 'border-neutral-200',
      primary: 'border-primary-200 bg-primary-50/30',
      success: 'border-success-main/20 bg-success-light/30',
      warning: 'border-warning-main/20 bg-warning-light/30',
      error: 'border-error-main/20 bg-error-light/30',
    };

    const trendIcons = {
      up: <TrendingUp className="h-4 w-4" />,
      down: <TrendingDown className="h-4 w-4" />,
      neutral: <Minus className="h-4 w-4" />,
    };

    const trendColors = {
      up: 'text-success-main',
      down: 'text-error-main',
      neutral: 'text-neutral-500',
    };

    return (
      <Card
        ref={ref}
        className={cn(
          'border-2 transition-all hover:shadow-md',
          variantStyles[variant],
          className
        )}
        {...props}
      >
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-neutral-600">{label}</p>
              <p className="mt-2 text-3xl font-bold text-neutral-900">{value}</p>

              {trend && trendValue && (
                <div className={cn('mt-2 flex items-center gap-1 text-sm font-medium', trendColors[trend])}>
                  {trendIcons[trend]}
                  <span>{trendValue}</span>
                </div>
              )}
            </div>

            {icon && (
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-neutral-100">
                {icon}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }
);

StatCard.displayName = 'StatCard';

export default StatCard;
