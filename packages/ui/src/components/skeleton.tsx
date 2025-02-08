import * as React from 'react';

import { cn } from './utils';

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('tw-animate-pulse tw-rounded-md tw-bg-gray-100', className)}
      {...props}
    />
  );
}

export { Skeleton };
