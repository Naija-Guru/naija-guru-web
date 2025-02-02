'use client';

import React, { FC } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from '@naija-spell-checker/ui';
import { usePreferencesReducer } from 'reducers/preferences-reducer';

const formSchema = z.object({
  url: z.union([z.string().url(), z.literal('')]),
});

export const ApiForm: FC = () => {
  const [preferencesState, dispatchPreferencesState] = usePreferencesReducer();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: preferencesState.customSpellCheckApiEndpoint ?? '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    dispatchPreferencesState({
      type: 'SET_CUSTOM_API_DOMAIN',
      payload: {
        url: values.url,
      },
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Custom Spellcheck API endpoint</FormLabel>
              <FormControl>
                <Input
                  placeholder="Custom Spellcheck API endpoint"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={
            form.getValues().url ===
            preferencesState.customSpellCheckApiEndpoint
          }
        >
          Save
        </Button>
      </form>
    </Form>
  );
};
