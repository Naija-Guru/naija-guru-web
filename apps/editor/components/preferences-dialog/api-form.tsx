'use client';

import React, { FC } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';

import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  useToast,
} from '@naija-spell-checker/ui';
import { usePreferences } from '@/providers/preferences-provider';

const formSchema = z.object({
  url: z.string().url(),
});

export const ApiForm: FC = () => {
  const { toast } = useToast();
  const t = useTranslations();
  const { state: preferencesState, dispatch: preferencesDispatch } =
    usePreferences();

  const form = useForm<z.infer<typeof formSchema>>({
    mode: 'onSubmit',
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: preferencesState.customSpellCheckApiEndpoint ?? '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    preferencesDispatch({
      type: 'SET_CUSTOM_SPELL_CHECKER_API_ENDPOINT',
      payload: {
        url: values.url,
      },
    });
    toast({
      title: t('preferences.settings_saved'),
    });
  }

  function resetCustomApiEndpoint() {
    preferencesDispatch({
      type: 'RESET_CUSTOM_SPELL_CHECKER_API_ENDPOINT',
    });
    form.reset({ url: '' });
  }

  const canResetForm =
    form.getValues().url === preferencesState.customSpellCheckApiEndpoint &&
    Boolean(form.getValues().url);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="tw-space-y-8">
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('preferences.custom_api_endpoint')}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t('preferences.custom_api_endpoint')}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {canResetForm ? (
          <Button type="button" onClick={resetCustomApiEndpoint}>
            {t('preferences.reset')}
          </Button>
        ) : (
          <Button type="submit">{t('preferences.save')}</Button>
        )}
      </form>
    </Form>
  );
};
