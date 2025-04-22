import React from 'react';
import { Button } from '@naija-spell-checker/ui';
import { ArrowLeftRightIcon } from 'lucide-react';
import { LanguageCode } from '../api/translation';

interface LanguageSelectorProps {
  sourceLanguage: LanguageCode;
  targetLanguage: LanguageCode;
  onSwitchLanguages: () => void;
}

export function LanguageSelector({
  sourceLanguage,
  targetLanguage,
  onSwitchLanguages,
}: LanguageSelectorProps) {
  const getLanguageDisplayName = (code: LanguageCode): string => {
    return code === 'en' ? 'English' : 'Naija';
  };

  return (
    <div className="tw-flex tw-items-center tw-gap-4 tw-justify-center">
      <span className="tw-text-secondary tw-font-medium">
        {getLanguageDisplayName(sourceLanguage)}
      </span>
      <Button
        variant="ghost"
        onClick={onSwitchLanguages}
        title="Switch languages"
      >
        <ArrowLeftRightIcon className="tw-text-secondary" />
      </Button>
      <span className="tw-text-secondary tw-font-medium">
        {getLanguageDisplayName(targetLanguage)}
      </span>
    </div>
  );
}
