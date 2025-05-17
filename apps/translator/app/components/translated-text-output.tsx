import React, { useState } from 'react';
import { Button, Textarea } from '@naija-spell-checker/ui';
import { CopyIcon, Share } from 'lucide-react';
import { useTranslations } from 'next-intl';
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
  alternateTranslations = [],
  isLoading = false,
  shareLink,
  onShare,
}: TranslatedTextOutputProps) {
  const t = useTranslations();
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
        <div className="tw-flex tw-gap-2 tw-relative">
          {shareLink && (
            <Button
              variant="ghost"
              onClick={handleShare}
              disabled={!value}
              title={t('common.share')}
              className="tw-relative"
            >
              <Share className="tw-w-4 tw-h-4" />
              {showShareMessage && (
                <span className="tw-text-xs tw-absolute tw-right-0 tw-top-full tw-mt-1 tw-mr-2 tw-bg-black tw-text-white tw-p-1 tw-rounded tw-whitespace-nowrap tw-z-10">
                  {t('common.copied')}
                </span>
              )}
            </Button>
          )}
          <Button
            variant="ghost"
            onClick={handleCopy}
            disabled={!value}
            title={t('common.copy')}
          >
            <CopyIcon className="tw-w-4 tw-h-4" />
          </Button>
        </div>
      </div>
      <Textarea
        className="tw-border-none tw-resize-none tw-shadow-none md:tw-text-xl tw-bg-transparent"
        value={isLoading ? t('common.loading') : value}
        readOnly
        rows={8}
        placeholder={t('common.placeholder.target')}
      />

      {alternateTranslations.length > 0 && (
        <div className="tw-mt-4">
          <h4 className="tw-text-sm tw-font-medium tw-text-gray-500">
            {t('alternatives.title')}
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
