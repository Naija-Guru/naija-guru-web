import { FC, ReactNode } from 'react';

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

export const PreferencesDialog: FC<{ trigger: ReactNode }> = ({ trigger }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:tw-max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Preferences</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="api">
          <TabsList className="tw-grid tw-w-full tw-grid-cols-2">
            <TabsTrigger value="api">API</TabsTrigger>
            <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
          </TabsList>
          <TabsContent value="api">
            <ApiForm />
          </TabsContent>
          <TabsContent value="suggestions"></TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
