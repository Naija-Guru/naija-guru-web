'use client';

import * as React from 'react';
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';

import { cn } from './utils';

const ScrollArea = (
  {
    ref,
    className,
    children,
    ...props
  }: React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> & {
    ref: React.RefObject<React.ComponentRef<typeof ScrollAreaPrimitive.Root>>;
  }
) => (<ScrollAreaPrimitive.Root
  ref={ref}
  className={cn('tw-relative tw-overflow-hidden', className)}
  {...props}
>
  <ScrollAreaPrimitive.Viewport className="tw-h-full tw-w-full tw-rounded-[inherit]">
    {children}
  </ScrollAreaPrimitive.Viewport>
  <ScrollBar />
  <ScrollAreaPrimitive.Corner />
</ScrollAreaPrimitive.Root>);
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;

const ScrollBar = (
  {
    ref,
    className,
    orientation = 'vertical',
    ...props
  }: React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar> & {
    ref: React.RefObject<React.ComponentRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>>;
  }
) => (<ScrollAreaPrimitive.ScrollAreaScrollbar
  ref={ref}
  orientation={orientation}
  className={cn(
    'tw-flex tw-touch-none tw-select-none tw-transition-colors',
    orientation === 'vertical' &&
      'tw-h-full tw-w-2.5 tw-border-l tw-border-l-transparent tw-p-[1px]',
    orientation === 'horizontal' &&
      'tw-h-2.5 tw-flex-col tw-border-t tw-border-t-transparent tw-p-[1px]',
    className
  )}
  {...props}
>
  <ScrollAreaPrimitive.ScrollAreaThumb className="tw-relative tw-flex-1 tw-rounded-full tw-bg-border" />
</ScrollAreaPrimitive.ScrollAreaScrollbar>);
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;

export { ScrollArea, ScrollBar };
