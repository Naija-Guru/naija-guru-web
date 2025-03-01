import Link from 'next/link';
import { ChevronRight, MenuIcon, XIcon } from 'lucide-react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from '@naija-spell-checker/ui';

import Logo from '@/images/full-logo.svg';
import { HEADER_ROUTES } from '@/constants/routes';

import { MobileLocaleSwitcher } from './locale-switcher/mobile-locale-switcher';

export function MobileNavigationMenu() {
  return (
    <Sheet>
      <SheetTrigger asChild className="md:tw-hidden">
        <Button variant="ghost" size="icon" className="tw-w-auto">
          <MenuIcon />
        </Button>
      </SheetTrigger>
      <SheetContent
        className="tw-bg-white tw-w-screen sm:tw-max-w-screen tw-py-4 tw-px-0"
        showClose={false}
      >
        <div className="tw-flex tw-justify-between tw-px-4">
          <Logo className="tw-h-8 tw-mr-2" />
          <SheetClose>
            <Button variant="ghost" size="icon" className="tw-w-auto">
              <XIcon />
            </Button>
          </SheetClose>
        </div>
        <Accordion type="single" collapsible className="tw-w-full">
          {HEADER_ROUTES.map((route, i) =>
            Array.isArray(route.routes) ? (
              <AccordionItem value={route.label} key={i}>
                <AccordionTrigger className="tw-px-4">
                  {route.label}
                </AccordionTrigger>
                <AccordionContent>
                  {route.routes.map((subroute, index) => (
                    <Link
                      className="tw-flex tw-py-4 tw-pl-4"
                      href={subroute.url}
                      key={`tw-${route.label}${index}`}
                    >
                      <ChevronRight />
                      {subroute.label}
                    </Link>
                  ))}
                </AccordionContent>
              </AccordionItem>
            ) : (
              <Link
                className="tw-block tw-p-4"
                href={route.url ?? 'tw-'}
                key={i}
              >
                {route.label}
              </Link>
            )
          )}
          <MobileLocaleSwitcher />
        </Accordion>
      </SheetContent>
    </Sheet>
  );
}
