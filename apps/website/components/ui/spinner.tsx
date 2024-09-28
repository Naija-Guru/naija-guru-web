import React, { FC } from 'react';
import { LoaderCircle } from 'lucide-react';

import { cn } from '@/lib/utils';

interface SpinnerProps {
  className?: string;
}

export const Spinner: FC<SpinnerProps> = ({ className }) => {
  return (
    <LoaderCircle className={cn('animate-spin', 'text-green', className)} />
  );
};
