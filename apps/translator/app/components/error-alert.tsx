import React from 'react';
import { Alert, AlertDescription } from '@naija-spell-checker/ui';
import { AlertCircleIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface ErrorAlertProps {
  message: string | null;
}

export function ErrorAlert({ message }: ErrorAlertProps) {
  const t = useTranslations();

  if (!message) return null;

  // Use the provided message or fall back to the generic error message
  const displayMessage = message || t('error.generic');

  return (
    <Alert
      variant="destructive"
      className="tw-mb-4 tw-fixed tw-bottom-4 tw-left-1/2 tw-transform tw--translate-x-1/2 tw-max-w-md tw-w-full tw-z-50 tw-shadow-lg"
    >
      <AlertCircleIcon className="tw-h-4 tw-w-4" />
      <AlertDescription>{displayMessage}</AlertDescription>
    </Alert>
  );
}
