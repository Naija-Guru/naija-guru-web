'use client';

import { useTranslatorWithUrl } from '../hooks/use-translator-with-url';
import { LanguageSelector } from '../components/language-selector';
import { SourceTextInput } from '../components/source-text-input';
import { TranslatedTextOutput } from '../components/translated-text-output';
import { ErrorAlert } from '../components/error-alert';

export default function Home() {
  const {
    sourceText,
    translatedText,
    alternateTranslations,
    verification,
    sourceLanguage,
    targetLanguage,
    isLoading,
    error,
    setSourceText,
    switchLanguages,
    clearText,
    shareLink,
  } = useTranslatorWithUrl();

  return (
    <div className="tw-p-6 tw-mx-auto tw-max-w-[1280px]">
      <div className="tw-flex tw-justify-center">
        <LanguageSelector
          sourceLanguage={sourceLanguage}
          targetLanguage={targetLanguage}
          onSwitchLanguages={switchLanguages}
        />
      </div>
      <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-2 tw-my-10">
        <SourceTextInput
          value={sourceText}
          onChange={setSourceText}
          onClear={clearText}
          isDisabled={isLoading}
        />
        <TranslatedTextOutput
          value={translatedText}
          verification={verification}
          alternateTranslations={alternateTranslations}
          isLoading={isLoading}
          shareLink={shareLink}
        />
      </div>
      <ErrorAlert message={error} />
    </div>
  );
}
