import * as React from 'react';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../utils/cn';

/**
 * Avatar Component
 *
 * Displays user avatars with fallback initials.
 * Built on Radix UI for accessibility.
 *
 * @example
 * <Avatar src="/avatar.jpg" alt="John Doe" />
 * <Avatar fallback="JD" />
 */

const avatarVariants = cva(
  'relative flex shrink-0 overflow-hidden rounded-full',
  {
    variants: {
      size: {
        sm: 'h-8 w-8',
        md: 'h-10 w-10',
        lg: 'h-12 w-12',
        xl: 'h-16 w-16',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

export interface AvatarProps
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>,
    VariantProps<typeof avatarVariants> {
  /** Image source URL */
  src?: string;
  /** Alt text for the image */
  alt?: string;
  /** Fallback text (usually initials) */
  fallback?: string;
  /** Status indicator */
  status?: 'online' | 'offline' | 'away' | 'busy';
}

export const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  AvatarProps
>(({ className, size, src, alt, fallback, status, ...props }, ref) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const displayFallback = fallback || (alt ? getInitials(alt) : '?');

  const statusColors = {
    online: 'bg-success-main',
    offline: 'bg-neutral-400',
    away: 'bg-warning-main',
    busy: 'bg-error-main',
  };

  return (
    <div className="relative inline-block">
      <AvatarPrimitive.Root
        ref={ref}
        className={cn(avatarVariants({ size }), className)}
        {...props}
      >
        <AvatarPrimitive.Image
          src={src}
          alt={alt}
          className="aspect-square h-full w-full object-cover"
        />
        <AvatarPrimitive.Fallback
          className="flex h-full w-full items-center justify-center rounded-full bg-primary-100 text-primary-700 font-semibold"
          style={{ fontSize: size === 'sm' ? '0.75rem' : size === 'lg' ? '1rem' : size === 'xl' ? '1.25rem' : '0.875rem' }}
        >
          {displayFallback}
        </AvatarPrimitive.Fallback>
      </AvatarPrimitive.Root>
      {status && (
        <span
          className={cn(
            'absolute bottom-0 right-0 block rounded-full ring-2 ring-white',
            statusColors[status],
            size === 'sm' ? 'h-2 w-2' : size === 'lg' ? 'h-3.5 w-3.5' : size === 'xl' ? 'h-4 w-4' : 'h-3 w-3'
          )}
        />
      )}
    </div>
  );
});

Avatar.displayName = 'Avatar';

// Avatar Group for displaying multiple avatars
export interface AvatarGroupProps {
  /** Maximum number of avatars to show before "+N" */
  max?: number;
  /** Array of avatar props */
  avatars: AvatarProps[];
  /** Size for all avatars */
  size?: AvatarProps['size'];
  /** ClassName for the group */
  className?: string;
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  max = 3,
  avatars,
  size = 'md',
  className,
}) => {
  const displayAvatars = avatars.slice(0, max);
  const remainingCount = Math.max(0, avatars.length - max);

  return (
    <div className={cn('flex -space-x-2', className)}>
      {displayAvatars.map((avatar, index) => (
        <Avatar
          key={index}
          {...avatar}
          size={size}
          className="ring-2 ring-white"
        />
      ))}
      {remainingCount > 0 && (
        <div
          className={cn(
            'relative flex shrink-0 overflow-hidden rounded-full ring-2 ring-white bg-neutral-200 text-neutral-700 font-semibold items-center justify-center',
            avatarVariants({ size })
          )}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
};

AvatarGroup.displayName = 'AvatarGroup';

export default Avatar;
