import * as React from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';

import { cn } from './utils';

const Accordion = AccordionPrimitive.Root;

const AccordionItem = (
  {
    ref,
    className,
    ...props
  }: React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item> & {
    ref: React.RefObject<React.ComponentRef<typeof AccordionPrimitive.Item>>;
  }
) => (<AccordionPrimitive.Item ref={ref} className={className} {...props} />);
AccordionItem.displayName = 'AccordionItem';

const AccordionTrigger = (
  {
    ref,
    className,
    children,
    ...props
  }: React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> & {
    ref: React.RefObject<React.ComponentRef<typeof AccordionPrimitive.Trigger>>;
  }
) => (<p className="tw-flex">
  <AccordionPrimitive.Trigger
    ref={ref}
    className={cn(
      'tw-flex tw-flex-1 tw-items-center tw-justify-between tw-py-4 tw-transition-all tw-text-left data-[state=open]:tw-text-secondary data-[state=open]:tw-bg-tertiary [&[data-state=open]>svg]:tw-rotate-180',
      className
    )}
    {...props}
  >
    {children}
    <ChevronDown className="tw-shrink-0 tw-transition-transform tw-duration-200" />
  </AccordionPrimitive.Trigger>
</p>);
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = (
  {
    ref,
    className,
    children,
    ...props
  }: React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content> & {
    ref: React.RefObject<React.ComponentRef<typeof AccordionPrimitive.Content>>;
  }
) => (<AccordionPrimitive.Content
  ref={ref}
  className="tw-overflow-hidden data-[state=closed]:tw-animate-accordion-up data-[state=open]:tw-animate-accordion-down"
  {...props}
>
  <div className={cn('tw-pb-4 tw-pt-0', className)}>{children}</div>
</AccordionPrimitive.Content>);
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
