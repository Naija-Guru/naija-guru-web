import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils';
import { Button, ButtonProps } from './button';

const floatingButtonVariants = cva(
  'tw-fixed tw-shadow-lg tw-rounded-full tw-flex tw-items-center tw-justify-center tw-transition-all tw-duration-200 tw-ease-in-out hover:tw-scale-105 active:tw-scale-95 tw-z-50',
  {
    variants: {
      position: {
        'top-left': 'tw-top-8 tw-left-8 ',
        'top-right': 'tw-top-8 tw-right-8 ',
        'bottom-left': 'tw-bottom-8 tw-left-8 ',
        'bottom-right': 'tw-bottom-8 tw-right-8 ',
      },
    },
    defaultVariants: {
      position: 'bottom-right',
    },
  }
);

export type FloatingButtonProps =
  React.ButtonHTMLAttributes<HTMLButtonElement> &
    VariantProps<typeof floatingButtonVariants> &
    ButtonProps;

const FloatingButton = (
  {
    ref,
    className,
    position,
    ...props
  }: FloatingButtonProps & {
    ref: React.RefObject<HTMLButtonElement>;
  }
) => {
  return (
    <Button
      className={cn(floatingButtonVariants({ position, className }))}
      ref={ref}
      {...props}
    />
  );
};
FloatingButton.displayName = 'FloatingButton';

export { FloatingButton, floatingButtonVariants };
