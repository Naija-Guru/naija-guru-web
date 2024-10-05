'use client';
import dynamic from 'next/dynamic';

const Demo = dynamic(() => import('./demo'), { ssr: false });

export default function DemoPage() {
  return <Demo />;
}
