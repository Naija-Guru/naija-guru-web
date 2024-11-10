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
import { HEADER_ROUTES } from '../constants';

export function MobileNavigationMenu() {
  return (
    <Sheet>
      <SheetTrigger asChild className="md:hidden">
        <Button variant="ghost" size="icon" className="w-auto">
          <MenuIcon />
        </Button>
      </SheetTrigger>
      <SheetContent
        className="bg-white w-screen sm:max-w-screen py-10 px-0"
        showClose={false}
      >
        <div className="flex justify-between px-4">
          <Logo className="h-8 mr-2" />
          <SheetClose>
            <Button variant="ghost" size="icon" className="w-auto">
              <XIcon />
            </Button>
          </SheetClose>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {HEADER_ROUTES.map((route, i) =>
            Array.isArray(route.routes) ? (
              <AccordionItem value={route.label} key={i}>
                <AccordionTrigger className="px-4">
                  {route.label}
                </AccordionTrigger>
                <AccordionContent>
                  {route.routes.map((subroute, index) => (
                    <Link
                      className="flex py-4 pl-4"
                      href={subroute.url}
                      key={`${route.label}${index}`}
                    >
                      <ChevronRight />
                      {subroute.label}
                    </Link>
                  ))}
                </AccordionContent>
              </AccordionItem>
            ) : (
              <Link className="block py-4 px-4" href={route.url ?? ''} key={i}>
                {route.label}
              </Link>
            )
          )}
        </Accordion>
      </SheetContent>
    </Sheet>
  );
}
