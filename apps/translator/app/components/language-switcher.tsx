import React from 'react';
import { Button } from '@naija-spell-checker/ui';
import { LanguageCode } from '../api/translation';

interface LanguageSwitcherProps {
  currentLanguage: LanguageCode;
  onChange: (language: LanguageCode) => void;
}

export function LanguageSwitcher({
  currentLanguage,
  onChange,
}: LanguageSwitcherProps) {
  return (
    <div className="tw-flex tw-justify-end tw-py-2">
      <div className="tw-flex tw-space-x-2 tw-bg-gray-100 tw-rounded-md tw-p-1">
        <Button
          variant={currentLanguage === 'en' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onChange('en')}
          className={`tw-text-xs ${currentLanguage === 'en' ? '' : 'tw-text-gray-500'}`}
        >
          English
        </Button>
        <Button
          variant={currentLanguage === 'pcm' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onChange('pcm')}
          className={`tw-text-xs ${currentLanguage === 'pcm' ? '' : 'tw-text-gray-500'}`}
        >
          Pidgin
        </Button>
      </div>
    </div>
  );
}
