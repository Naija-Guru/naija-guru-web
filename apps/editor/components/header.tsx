'use client';
import Link from 'next/link';

import Logo from '@/images/full-logo.svg';
import { MobileNavigationMenu } from './navigation-menu/mobile-navigation-menu';
import { DesktopNavigationMenu } from './navigation-menu/desktop-navigation-menu';

export function Header() {
  return (
    <div className="border-b">
      <header className="flex items-center justify-between m-auto max-w-[1200px] p-4 md:py-10">
        <Link href="/">
          <Logo className="h-8 mr-2" />
        </Link>
        <MobileNavigationMenu />
        <DesktopNavigationMenu />
      </header>
    </div>
  );
}
