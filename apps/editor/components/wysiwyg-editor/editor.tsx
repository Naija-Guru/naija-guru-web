import React, { FC } from 'react';
import {
  BtnBold,
  BtnBulletList,
  BtnClearFormatting,
  BtnItalic,
  BtnNumberedList,
  BtnRedo,
  BtnStrikeThrough,
  BtnUnderline,
  BtnUndo,
  Editor as WYSIWYGEditor,
  EditorProvider,
  Separator,
  Toolbar,
} from 'react-simple-wysiwyg';

import { cn } from '@naija-spell-checker/ui';

import styles from './editor.module.scss';
export interface EditorProps {
  className?: string;
  content: string;
  setContent: (content: string) => void;
  disabled: boolean;
}

export const Editor: FC<EditorProps> = ({
  className,
  content,
  setContent,
  disabled,
}) => {
  return (
    <EditorProvider>
      <WYSIWYGEditor
        containerProps={{
          className: cn(
            className,
            {
              'tw-opacity-25 tw-cursor-not-allowed': disabled,
            },
            styles.container
          ),
        }}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        // @ts-ignore
        placeholder="Type or paste your text here"
        disabled={disabled}
      >
        <Toolbar>
          <BtnRedo />
          <BtnUndo />
          <Separator />
          <BtnBold />
          <BtnItalic />
          <BtnUnderline />
          <BtnStrikeThrough />
          <Separator />
          <BtnNumberedList />
          <BtnBulletList />
          <Separator />
          <BtnClearFormatting />
        </Toolbar>
      </WYSIWYGEditor>
    </EditorProvider>
  );
};
