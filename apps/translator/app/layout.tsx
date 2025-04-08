import type { Metadata } from 'next';

import { Header, Footer } from '@naija-spell-checker/layout';

import '../styles/global.scss';

export const metadata: Metadata = {
  title: 'Naija Translator',
  description: 'Nigerian Pidgin translator web app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="tw-flex tw-flex-col tw-min-h-screen">
          <Header />
          <div className="tw-flex-1">{children}</div>
          <Footer appName="Naija Translator" />
        </div>
      </body>
    </html>
  );
}
