'use client';

import * as React from 'react';
import * as ToastPrimitives from '@radix-ui/react-toast';
import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';

import { cn } from './utils';

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = (
  {
    ref,
    className,
    ...props
  }: React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport> & {
    ref: React.RefObject<React.ComponentRef<typeof ToastPrimitives.Viewport>>;
  }
) => (<ToastPrimitives.Viewport
  ref={ref}
  className={cn(
    'tw-fixed tw-top-0 tw-z-[100] tw-flex tw-max-h-screen tw-w-full tw-flex-col-reverse tw-p-4 sm:tw-bottom-0 sm:tw-right-0 sm:tw-top-auto sm:tw-flex-col md:tw-max-w-[420px]',
    className
  )}
  {...props}
/>);
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const toastVariants = cva(
  'tw-group tw-pointer-events-auto tw-relative tw-flex tw-w-full tw-items-center tw-justify-between tw-space-x-2 tw-overflow-hidden tw-rounded-md tw-border tw-p-4 tw-pr-6 tw-shadow-lg tw-transition-all data-[swipe=cancel]:tw-translate-x-0 data-[swipe=end]:tw-translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:tw-translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:tw-transition-none data-[state=open]:tw-animate-in data-[state=closed]:tw-animate-out data-[swipe=end]:tw-animate-out data-[state=closed]:tw-fade-out-80 data-[state=closed]:tw-slide-out-to-right-full data-[state=open]:tw-slide-in-from-top-full data-[state=open]:tw-sm',
  {
    variants: {
      variant: {
        default: 'tw-border tw-bg-background tw-text-foreground',
        destructive:
          'tw-destructive tw-group tw-border-destructive tw-bg-destructive tw-text-destructive-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const Toast = (
  {
    ref,
    className,
    variant,
    ...props
  }
) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  );
};
Toast.displayName = ToastPrimitives.Root.displayName;

const ToastAction = (
  {
    ref,
    className,
    ...props
  }: React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action> & {
    ref: React.RefObject<React.ComponentRef<typeof ToastPrimitives.Action>>;
  }
) => (<ToastPrimitives.Action
  ref={ref}
  className={cn(
    'tw-inline-flex tw-h-8 tw-shrink-0 tw-items-center tw-justify-center tw-rounded-md tw-border tw-bg-transparent tw-px-3 tw-text-sm tw-font-medium tw-transition-colors hover:tw-bg-secondary focus:tw-outline-none focus:tw-ring-1 focus:tw-ring-ring disabled:tw-pointer-events-none disabled:tw-opacity-50 group-[.destructive]:tw-border-muted/40 group-[.destructive]:tw-hover group-[.destructive]:tw-hover group-[.destructive]:tw-hover group-[.destructive]:tw-focus',
    className
  )}
  {...props}
/>);
ToastAction.displayName = ToastPrimitives.Action.displayName;

const ToastClose = (
  {
    ref,
    className,
    ...props
  }: React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close> & {
    ref: React.RefObject<React.ComponentRef<typeof ToastPrimitives.Close>>;
  }
) => (<ToastPrimitives.Close
  ref={ref}
  className={cn(
    'tw-absolute tw-right-1 tw-top-1 tw-rounded-md tw-p-1 tw-text-foreground/50 tw-opacity-0 tw-transition-opacity hover:tw-text-foreground focus:tw-opacity-100 focus:tw-outline-none focus:tw-ring-1 group-hover:tw-opacity-100 group-[.destructive]:tw-text-red-300 group-[.destructive]:tw-hover group-[.destructive]:tw-focus group-[.destructive]:tw-focus',
    className
  )}
  toast-close="tw-"
  {...props}
>
  <X className="tw-h-4 tw-w-4" />
</ToastPrimitives.Close>);
ToastClose.displayName = ToastPrimitives.Close.displayName;

const ToastTitle = (
  {
    ref,
    className,
    ...props
  }: React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title> & {
    ref: React.RefObject<React.ComponentRef<typeof ToastPrimitives.Title>>;
  }
) => (<ToastPrimitives.Title
  ref={ref}
  className={cn('tw-text-sm tw-font-semibold [&+div]:tw-text-xs', className)}
  {...props}
/>);
ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = (
  {
    ref,
    className,
    ...props
  }: React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description> & {
    ref: React.RefObject<React.ComponentRef<typeof ToastPrimitives.Description>>;
  }
) => (<ToastPrimitives.Description
  ref={ref}
  className={cn('tw-text-sm tw-opacity-90', className)}
  {...props}
/>);
ToastDescription.displayName = ToastPrimitives.Description.displayName;

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>;

type ToastActionElement = React.ReactElement<typeof ToastAction>;

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
};
