'use client';
import Link from 'next/link';

import Logo from '../assets/images/full-logo.svg';
import { MobileNavigationMenu } from './navigation-menu/mobile-navigation-menu';
import { DesktopNavigationMenu } from './navigation-menu/desktop-navigation-menu';
import { MobileLocaleSwitcher } from './locale-switcher/mobile-locale-switcher';
import { DesktopLocaleSwitcher } from './locale-switcher/desktop-locale-switcher';

export function Header({
  pathname,
  currentLocale,
  locales,
}: {
  pathname: string;
  currentLocale: string;
  locales: string[];
}) {
  return (
    <div className="tw-border-b">
      <header className="tw-flex tw-items-center tw-justify-between tw-m-auto tw-max-w-[1200px] tw-p-4 md:tw-py-10">
        <Link href="/">
          <Logo className="tw-h-8 tw-mr-2" />
        </Link>
        <MobileNavigationMenu>
          <MobileLocaleSwitcher
            pathname={pathname}
            currentLocale={currentLocale}
            locales={locales}
          />
        </MobileNavigationMenu>
        <DesktopNavigationMenu>
          <DesktopLocaleSwitcher
            pathname={pathname}
            currentLocale={currentLocale}
            locales={locales}
          />
        </DesktopNavigationMenu>
      </header>
    </div>
  );
}
