import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@naija-spell-checker/ui';
import { CheckCircle2Icon } from 'lucide-react';
import { useTranslations } from 'next-intl';

type VerificationStatus = 'FULL' | 'PARTIAL' | 'NONE';

interface VerificationBadgeProps {
  status: VerificationStatus;
}

export function VerificationBadge({ status }: VerificationBadgeProps) {
  const t = useTranslations();

  if (status === 'NONE') return null;

  const colorClass =
    status === 'FULL' ? 'tw-text-green-500' : 'tw-text-yellow-500';

  const tooltipText =
    status === 'FULL' ? t('verification.full') : t('verification.partial');

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
