import React from 'react';
import { Button, Textarea } from '@naija-spell-checker/ui';
import { ClipboardPasteIcon, XIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface SourceTextInputProps {
  value: string;
  onChange: (text: string) => void;
  onClear: () => void;
  isDisabled?: boolean;
}

export function SourceTextInput({
  value,
  onChange,
  onClear,
  isDisabled = false,
}: SourceTextInputProps) {
  const t = useTranslations();

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      onChange(clipboardText);
    } catch (error) {
      console.error('Failed to read clipboard contents:', error);
    }
  };

  return (
    <div className="tw-border tw-rounded-md tw-p-4 tw-relative">
      <div className="tw-flex tw-justify-end">
        <Button
          variant="ghost"
          onClick={onClear}
          disabled={!value}
          title={t('common.clear')}
        >
          <XIcon />
        </Button>
      </div>
      <Textarea
        className="tw-border-none tw-resize-none tw-shadow-none md:tw-text-xl"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t('common.placeholder.source')}
        rows={8}
      />
      <div className="tw-mt-2">
        <Button
          variant="ghost"
          onClick={handlePaste}
          disabled={isDisabled}
          title={t('common.paste')}
        >
          <ClipboardPasteIcon />
        </Button>
      </div>
    </div>
  );
}
