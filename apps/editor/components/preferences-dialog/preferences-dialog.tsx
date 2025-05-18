import { FC, ReactNode } from 'react';
import { useTranslations } from 'next-intl';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@naija-spell-checker/ui';

import { ApiForm } from './api-form';
import { RulesPreferences } from './rules-preferences';
import { CategoriesPreferences } from './category-preferences';

export const PreferencesDialog: FC<{ trigger: ReactNode }> = ({ trigger }) => {
  const t = useTranslations();

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="tw-w-min-[500px]">
        <DialogHeader>
          <DialogTitle>{t('preferences.title')}</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="api">
          <TabsList className="tw-grid tw-grid-cols-3">
            <TabsTrigger value="api">{t('preferences.api')}</TabsTrigger>
            <TabsTrigger value="rules">{t('preferences.rules')}</TabsTrigger>
            <TabsTrigger value="categories">
              {t('preferences.categories')}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="api">
            <ApiForm />
          </TabsContent>
          <TabsContent value="rules">
            <RulesPreferences />
          </TabsContent>
          <TabsContent value="categories">
            <CategoriesPreferences />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
