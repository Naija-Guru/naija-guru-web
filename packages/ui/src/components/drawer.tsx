'use client';

import * as React from 'react';
import { Drawer as DrawerPrimitive } from 'vaul';

import { cn } from './utils';

const Drawer = ({
  shouldScaleBackground = true,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) => (
  <DrawerPrimitive.Root
    shouldScaleBackground={shouldScaleBackground}
    {...props}
  />
);
Drawer.displayName = 'Drawer';

const DrawerTrigger: typeof DrawerPrimitive.Trigger = DrawerPrimitive.Trigger;

const DrawerPortal = DrawerPrimitive.Portal;

const DrawerClose: typeof DrawerPrimitive.Close = DrawerPrimitive.Close;

const DrawerOverlay = (({
  ref,
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay> & {
  ref?: React.Ref<React.ComponentRef<typeof DrawerPrimitive.Overlay>>;
}) => (
  <DrawerPrimitive.Overlay
    ref={ref}
    className={cn('tw-fixed tw-inset-0 tw-z-50 tw-bg-black/80', className)}
    {...props}
  />
)) as typeof DrawerPrimitive.Overlay;
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName;

const DrawerContent = (({
  ref,
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content> & {
  ref?: React.Ref<React.ComponentRef<typeof DrawerPrimitive.Content>>;
}) => (
  <DrawerPortal>
    <DrawerOverlay />
    <DrawerPrimitive.Content
      ref={ref}
      className={cn(
        'tw-fixed tw-inset-x-0 tw-bottom-0 tw-z-50 tw-mt-24 tw-flex tw-h-auto tw-flex-col tw-rounded-t-[10px] tw-border tw-bg-background',
        className
      )}
      {...props}
    >
      <div className="tw-mx-auto tw-mt-4 tw-h-2 tw-w-[100px] tw-rounded-full tw-bg-muted" />
      {children}
    </DrawerPrimitive.Content>
  </DrawerPortal>
)) as typeof DrawerPrimitive.Content;
DrawerContent.displayName = 'DrawerContent';

const DrawerHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'tw-grid tw-gap-1.5 tw-p-4 tw-text-center sm:tw-text-left',
      className
    )}
    {...props}
  />
);
DrawerHeader.displayName = 'DrawerHeader';

const DrawerFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('tw-mt-auto tw-flex tw-flex-col tw-gap-2 tw-p-4', className)}
    {...props}
  />
);
DrawerFooter.displayName = 'DrawerFooter';

const DrawerTitle = (({
  ref,
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title> & {
  ref?: React.Ref<React.ComponentRef<typeof DrawerPrimitive.Title>>;
}) => (
  <DrawerPrimitive.Title
    ref={ref}
    className={cn(
      'tw-text-lg tw-font-semibold tw-leading-none tw-tracking-tight',
      className
    )}
    {...props}
  />
)) as typeof DrawerPrimitive.Title;
DrawerTitle.displayName = DrawerPrimitive.Title.displayName;

const DrawerDescription = (({
  ref,
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description> & {
  ref?: React.Ref<React.ComponentRef<typeof DrawerPrimitive.Description>>;
}) => (
  <DrawerPrimitive.Description
    ref={ref}
    className={cn('tw-text-sm tw-text-muted-foreground', className)}
    {...props}
  />
)) as typeof DrawerPrimitive.Description;
DrawerDescription.displayName = DrawerPrimitive.Description.displayName;

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};
