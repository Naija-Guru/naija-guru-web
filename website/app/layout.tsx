import type { Metadata } from 'next';
import localFont from 'next/font/local';

import clsx from 'clsx';
import '@/styles/global.scss';

const CabinetGroteskFont = localFont({
  src: [
    {
      path: './fonts/CabinetGrotesk/CabinetGrotesk-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/CabinetGrotesk/CabinetGrotesk-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: './fonts/CabinetGrotesk/CabinetGrotesk-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-cabinet-grotesk',
  display: 'swap',
});

const PoppinsFont = localFont({
  src: [
    {
      path: './fonts/Poppins/Poppins-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/Poppins/Poppins-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: './fonts/Poppins/Poppins-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Naija Spell Check',
  description: 'Nigerian Pidgin spell check web app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={clsx(CabinetGroteskFont.className, PoppinsFont.className)}
      >
        {children}
      </body>
    </html>
  );
}
