import React from 'react';
import { Button, Textarea } from '@naija-spell-checker/ui';
import { CopyIcon } from 'lucide-react';
import { VerificationBadge } from './verification-badge';

interface TranslatedTextOutputProps {
  value: string;
  verification: 'FULL' | 'PARTIAL' | 'NONE';
  alternateTranslations?: string[];
  isLoading?: boolean;
}

export function TranslatedTextOutput({
  value,
  verification,
  alternateTranslations = [],
  isLoading = false,
}: TranslatedTextOutputProps) {
  const handleCopy = async () => {
    if (value) {
      try {
        await navigator.clipboard.writeText(value);
      } catch (error) {
        console.error('Failed to copy text:', error);
      }
    }
  };

  return (
    <div className="tw-bg-gray-100 tw-rounded-md tw-p-4 tw-relative">
      <div className="tw-flex tw-justify-between tw-items-center">
        <div className="tw-flex tw-items-center">
          <VerificationBadge status={verification} />
        </div>
        <Button
          variant="ghost"
          onClick={handleCopy}
          disabled={!value}
          title="Copy to clipboard"
        >
          <CopyIcon />
        </Button>
      </div>
      <Textarea
        className="tw-border-none tw-resize-none tw-shadow-none md:tw-text-xl tw-bg-transparent"
        value={isLoading ? 'Translating...' : value}
        readOnly
        rows={8}
        placeholder="Translation will appear here"
      />

      {alternateTranslations.length > 0 && (
        <div className="tw-mt-4">
          <h4 className="tw-text-sm tw-font-medium tw-text-gray-500">
            Alternative translations:
          </h4>
          <ul className="tw-mt-1 tw-space-y-1">
            {alternateTranslations.map((text, index) => (
              <li
                key={index}
                className="tw-text-sm tw-bg-white tw-p-2 tw-rounded"
              >
                {text}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
