import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@naija-spell-checker/ui';
import { CheckCircle2Icon } from 'lucide-react';

type VerificationStatus = 'FULL' | 'PARTIAL' | 'NONE';

interface VerificationBadgeProps {
  status: VerificationStatus;
}

export function VerificationBadge({ status }: VerificationBadgeProps) {
  if (status === 'NONE') return null;

  const colorClass =
    status === 'FULL' ? 'tw-text-green-500' : 'tw-text-yellow-500';

  const tooltipText =
    status === 'FULL'
      ? 'This translation has been verified by a human'
      : 'This translation has been partially verified by a human';

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="tw-inline-flex tw-items-center">
            <CheckCircle2Icon
              className={`tw-ml-2 tw-h-5 tw-w-5 ${colorClass}`}
            />
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
