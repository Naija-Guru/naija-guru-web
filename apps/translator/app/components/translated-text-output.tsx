import React, { useState } from 'react';
import { Button, Textarea } from '@naija-spell-checker/ui';
import { CopyIcon, Share } from 'lucide-react';
import { VerificationBadge } from './verification-badge';

interface TranslatedTextOutputProps {
  value: string;
  verification: 'FULL' | 'PARTIAL' | 'NONE';
  alternateTranslations?: string[];
  isLoading?: boolean;
  shareLink?: string;
  onShare?: () => void;
}

export function TranslatedTextOutput({
  value,
  verification,
  isLoading = false,
  shareLink,
  onShare,
}: TranslatedTextOutputProps) {
  const [showShareMessage, setShowShareMessage] = useState(false);

  const handleCopy = async () => {
    if (value) {
      try {
        await navigator.clipboard.writeText(value);
      } catch (error) {
        console.error('Failed to copy text:', error);
      }
    }
  };

  const handleShare = () => {
    if (shareLink) {
      navigator.clipboard.writeText(shareLink);
      setShowShareMessage(true);
      setTimeout(() => setShowShareMessage(false), 2000);
      if (onShare) onShare();
    }
  };

  return (
    <div className="tw-bg-gray-100 tw-rounded-md tw-p-4 tw-relative">
      <div className="tw-flex tw-justify-between tw-items-center">
        <div className="tw-flex tw-items-center">
          <VerificationBadge status={verification} />
        </div>
        <div className="tw-flex">
          <Button
            variant="ghost"
            onClick={handleCopy}
            disabled={!value}
            title="Copy to clipboard"
          >
            <CopyIcon />
          </Button>
        </div>
      </div>
      <Textarea
        className="tw-border-none tw-resize-none tw-shadow-none md:tw-text-xl tw-bg-transparent"
        value={isLoading ? 'Translating...' : value}
        readOnly
        rows={8}
        placeholder="Translation will appear here"
      />
      {shareLink && (
        <div className="tw-mt-2">
          <Button
            variant="ghost"
            onClick={handleShare}
            disabled={!value}
            title="Share translation"
            className="tw-relative"
          >
            <Share />
            {showShareMessage && (
              <span className="tw-text-xs tw-absolute tw-left-0 tw-top-full tw-mt-1 tw-mr-2 tw-bg-black tw-text-white tw-p-1 tw-rounded tw-whitespace-nowrap tw-z-10">
                Copied to clipboard!
              </span>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
