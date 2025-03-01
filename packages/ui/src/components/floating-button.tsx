import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils';
import { Button } from './button';

const floatingButtonVariants = cva(
  'tw-fixed tw-bottom-8 tw-right-8 tw-shadow-lg tw-rounded-full tw-flex tw-items-center tw-justify-center tw-transition-all tw-duration-200 tw-ease-in-out hover:tw-scale-105 active:tw-scale-95 tw-z-50',
  {
    variants: {
      size: {
        default: 'tw-h-14 tw-w-14',
        sm: 'tw-h-10 tw-w-10',
        lg: 'tw-h-16 tw-w-16',
      },
      variant: {
        default:
          'tw-bg-primary tw-text-primary-foreground hover:tw-bg-primary/90',
        secondary:
          'tw-bg-secondary tw-text-secondary-foreground hover:tw-bg-secondary/90',
        destructive:
          'tw-bg-destructive tw-text-destructive-foreground hover:tw-bg-destructive/90',
        outline:
          'tw-border tw-border-input tw-bg-background hover:tw-bg-accent hover:tw-text-accent-foreground',
        ghost: 'hover:tw-bg-accent hover:tw-text-accent-foreground',
      },
    },
    defaultVariants: {
      size: 'default',
      variant: 'default',
    },
  }
);

export interface FloatingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof floatingButtonVariants> {
  asChild?: boolean;
}

const FloatingButton = React.forwardRef<HTMLButtonElement, FloatingButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <Button
        className={cn(floatingButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
FloatingButton.displayName = 'FloatingButton';

export { FloatingButton, floatingButtonVariants };
