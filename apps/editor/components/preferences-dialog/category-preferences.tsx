'use client';

import { FC } from 'react';
import { useTranslations } from 'next-intl';

import { Button, ScrollArea, ScrollBar } from '@naija-spell-checker/ui';

import { formatEnumToText } from '@/lib/string';
import { usePreferences } from '@/providers/preferences-provider';
import { ListTodoIcon, ListXIcon, Trash2Icon } from 'lucide-react';

export const CategoriesPreferences: FC = () => {
  const t = useTranslations();
  const { state: preferencesState, dispatch: preferencesDispatch } =
    usePreferences();

  const handleClearAllIgnoredCategories = () => {
    preferencesDispatch({
      type: 'CLEAR_IGNORED_CATEGORIES',
    });
  };

  const handleRemoveIgnoredCategory = (categoryId: string) => {
    preferencesDispatch({
      type: 'REMOVE_IGNORED_CATEGORY',
      payload: {
        categoryId,
      },
    });
  };

  return (
    <section>
      <header className="tw-flex tw-items-center tw-justify-between">
        <h2 className="tw-font-bold tw-text-lg tw-my-4">
          {t('preferences.ignored_categories')}
        </h2>
        {preferencesState.ignoredCategories.length > 0 && (
          <Button variant="outline" onClick={handleClearAllIgnoredCategories}>
            <ListXIcon className="tw-h-4 tw-w-4 tw-mr-1" />
            {t('preferences.clear_all')}
          </Button>
        )}
      </header>
      {preferencesState.ignoredCategories.length > 0 ? (
        <ScrollArea className="tw-w-full tw-max-h-[400px]">
          {preferencesState.ignoredCategories.map((categoryId) => (
            <div
              key={categoryId}
              className="tw-flex tw-justify-between tw-items-center tw-p-4 tw-mb-4 tw-border"
            >
              <p className="tw-text-sm">{formatEnumToText(categoryId)}</p>
              <Button
                variant="ghost"
                onClick={() => handleRemoveIgnoredCategory(categoryId)}
              >
                <Trash2Icon className="tw-text-destructive" />
              </Button>
            </div>
          ))}
          <ScrollBar />
        </ScrollArea>
      ) : (
        <div>
          <ListTodoIcon className="tw-mx-auto tw-h-10 tw-w-10 md:tw-h-20 md:tw-w-20" />
          <p className="tw-p-4 tw-text-center">
            {t('preferences.no_ignored_categories')}
          </p>
        </div>
      )}
    </section>
  );
};
