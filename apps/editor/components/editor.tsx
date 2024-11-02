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
export interface EditorProps {
  className?: string;
  content: string;
  setContent: (content: string) => void;
}

export const Editor: FC<EditorProps> = ({ className, content, setContent }) => {
  return (
    <EditorProvider>
      <WYSIWYGEditor
        containerProps={{
          className,
        }}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        // @ts-ignore
        placeholder="Type or paste your text here"
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
