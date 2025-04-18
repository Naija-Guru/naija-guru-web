import * as React from 'react';

import { cn } from './utils';

const Textarea = ({
  ref,
  className,
  ...props
}: React.ComponentProps<'textarea'> & {
  ref?: React.Ref<HTMLTextAreaElement>;
}) => {
  return (
    <textarea
      className={cn(
        'tw-flex tw-min-h-[60px] tw-w-full tw-rounded-md tw-border tw-border-input tw-bg-transparent tw-px-3 tw-py-2 tw-text-base  placeholder:tw-text-muted-foreground focus-visible:tw-outline-none disabled:tw-cursor-not-allowed disabled:tw-opacity-50 md:tw-text-sm',
        className
      )}
      ref={ref}
      {...props}
    />
  );
};
Textarea.displayName = 'Textarea';

export { Textarea };
