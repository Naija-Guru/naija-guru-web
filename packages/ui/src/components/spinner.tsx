import * as React from 'react';
import { LoaderCircle } from 'lucide-react';

import { cn } from './utils';

interface SpinnerProps {
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ className }) => {
  return (
    <LoaderCircle className={cn('animate-spin', 'text-green', className)} />
  );
};
