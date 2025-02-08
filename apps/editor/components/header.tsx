'use client';
import Link from 'next/link';

import Logo from '@/images/full-logo.svg';
import { MobileNavigationMenu } from './navigation-menu/mobile-navigation-menu';
import { DesktopNavigationMenu } from './navigation-menu/desktop-navigation-menu';

export function Header() {
  return (
    <div className="tw-border-b">
      <header className="tw-flex tw-items-center tw-justify-between tw-m-auto tw-max-w-[1200px] tw-p-4 md:tw-py-10">
        <Link href="/">
          <Logo className="tw-h-8 tw-mr-2" />
        </Link>
        <MobileNavigationMenu />
        <DesktopNavigationMenu />
      </header>
    </div>
  );
}
