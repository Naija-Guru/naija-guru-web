'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Button,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@naija-spell-checker/ui';
import { PlusSquareIcon, ShareIcon } from 'lucide-react';

import { isAndroid, isIOS, isSafari, isStandalone } from '@/lib/device';

const INSTALL_BANNER_SHOWN_ON_IOS_KEY = `install-banner-shown-on-ios`;

export function InstallPrompt() {
  const [isBannerOpen, setIsBannerOpen] = useState(true);
  const [isIOSDevice, setIsIOSDevice] = useState(false);
  const [isAndroidDevice, setIsAndroidDevice] = useState(false);
  const [isStandaloneApp, setIsStandaloneApp] = useState(false);
  const [isSafariBrowser, setIsSafariBrowser] = useState(false);
  const [isBannerShownOnIOS] = useState(
    typeof window !== 'undefined'
      ? localStorage.getItem(INSTALL_BANNER_SHOWN_ON_IOS_KEY) === 'true'
      : false
  );
  const installBtn = useRef<HTMLButtonElement | null>(null);
  const installPrompt = useRef<BeforeInstallPromptEvent | null>(null);
  const [installedPromptReady, setInstalledPromptReady] = useState(false);

  const closeBanner = () => {
    localStorage.setItem(INSTALL_BANNER_SHOWN_ON_IOS_KEY, 'true');
    setIsBannerOpen(false);
  };

  const onInstallApp = useCallback(async () => {
    if (!installPrompt.current) {
      return;
    }

    setIsBannerOpen(false);
    await installPrompt.current.prompt();
  }, []);

  useEffect(() => {
    setIsIOSDevice(isIOS());
    setIsAndroidDevice(isAndroid());
    setIsStandaloneApp(isStandalone());
    setIsSafariBrowser(isSafari());
  }, []);

  const beforeInstallPromptHandler = (event: Event) => {
    event.preventDefault();
    installPrompt.current = event as BeforeInstallPromptEvent;
    setInstalledPromptReady(true);
  };

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', beforeInstallPromptHandler);

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        beforeInstallPromptHandler
      );
    };
  }, []);

  if (
    (!isAndroidDevice && !isIOSDevice) ||
    isStandaloneApp ||
    (isIOSDevice && (!isSafariBrowser || isBannerShownOnIOS)) ||
    (isAndroidDevice && !installedPromptReady)
  ) {
    return null;
  }

  return (
    <Drawer open={isBannerOpen}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle className="text-secondary">
              Install Naija Spell Checker
            </DrawerTitle>
            <DrawerDescription>
              Install the app on your device to easily access it anytime. No app
              store. No download. No hassle.
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-10">
            {isIOSDevice && (
              <ol>
                <li className="mb-4">
                  Tap on the share button{' '}
                  <ShareIcon className="inline mx-2 text-secondary" />
                </li>
                <li className="mb-4">
                  Select{' '}
                  <span className="text-secondary">Add to Home Screen</span>{' '}
                  <PlusSquareIcon className="inline mx-2 text-secondary" />
                </li>
              </ol>
            )}
          </div>
          <DrawerFooter>
            {!isIOSDevice && (
              <Button className="mb-4" ref={installBtn} onClick={onInstallApp}>
                <PlusSquareIcon className="mr-2" />
                Install
              </Button>
            )}
            <Button variant="outline" onClick={closeBanner}>
              Close
            </Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
