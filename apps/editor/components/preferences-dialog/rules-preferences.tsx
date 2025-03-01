'use client';

import { FC } from 'react';

import { Button, ScrollArea, ScrollBar } from '@naija-spell-checker/ui';

import { formatEnumToText } from '@/lib/string';
import { usePreferences } from '@/providers/preferences-provider';
import { ListTodoIcon, ListXIcon, Trash2Icon } from 'lucide-react';

export const RulesPreferences: FC = () => {
  const { state: preferencesState, dispatch: preferencesDispatch } =
    usePreferences();

  const handleClearAllIgnoredRules = () => {
    preferencesDispatch({
      type: 'CLEAR_IGNORED_RULES',
    });
  };

  const handleRemoveIgnoredRule = (ruleId: string) => {
    console.log({ ruleId });
    preferencesDispatch({
      type: 'REMOVE_IGNORED_RULE',
      payload: {
        ruleId,
      },
    });
  };

  return (
    <section>
      <header className="tw-flex tw-items-center tw-justify-between">
        <h2 className="tw-font-bold tw-text-lg tw-my-4">Ignored Rules</h2>
        {preferencesState.ignoredRules.length > 0 && (
          <Button variant="outline" onClick={handleClearAllIgnoredRules}>
            <ListXIcon className="tw-h-4 tw-w-4 tw-mr-1" />
            Clear all
          </Button>
        )}
      </header>
      {preferencesState.ignoredRules.length > 0 ? (
        <ScrollArea className="tw-w-full tw-max-h-[400px]">
          {preferencesState.ignoredRules.map((ruleId) => (
            <div
              key={ruleId}
              className="tw-flex tw-justify-between tw-items-center tw-p-4 tw-mb-4 tw-border"
            >
              <p className="tw-text-sm">{formatEnumToText(ruleId)}</p>
              <Button
                variant="ghost"
                onClick={() => handleRemoveIgnoredRule(ruleId)}
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
            You don&apos;t have any ignored rules
          </p>
        </div>
      )}
    </section>
  );
};
