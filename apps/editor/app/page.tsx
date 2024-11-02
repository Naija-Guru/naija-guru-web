'use client';
import dynamic from 'next/dynamic';

const EditorPageContent = dynamic(() => import('./editor-page-content'), {
  ssr: false,
});

export default function EditorPage() {
  return <EditorPageContent />;
}
