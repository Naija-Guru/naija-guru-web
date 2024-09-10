import type { Metadata } from 'next';

import '@/styles/global.scss';
import { Header } from './header';
import { Footer } from './footer';
import { cn } from '@/lib/utils';
import { cabinet_grotesk, poppins } from '@/lib/fonts';

export const metadata: Metadata = {
  title: 'Naija Spell Checker',
  description: 'Nigerian Pidgin spell checker web app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(poppins.variable, cabinet_grotesk.variable)}>
        <div className="flex flex-col min-h-screen">
          <Header />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
