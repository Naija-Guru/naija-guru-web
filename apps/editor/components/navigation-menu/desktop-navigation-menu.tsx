import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@naija-spell-checker/ui';

import { HEADER_ROUTES } from '../../constants';
import { DesktopLocaleSwitcher } from '../locale-switcher/desktop-locale-switcher';

export function DesktopNavigationMenu() {
  return (
    <NavigationMenu className="tw-hidden md:tw-block">
      <NavigationMenuList>
        {HEADER_ROUTES.map((route, i) =>
          Array.isArray(route.routes) ? (
            <NavigationMenuItem
              value={route.label}
              key={i}
              className="tw-relative"
            >
              <NavigationMenuTrigger>{route.label}</NavigationMenuTrigger>
              <NavigationMenuContent className="tw-w-[200px]">
                {route.routes.map((subroute, index) => (
                  <NavigationMenuLink
                    href={subroute.url}
                    key={`${route.label}${index}`}
                  >
                    {subroute.label}
                  </NavigationMenuLink>
                ))}
              </NavigationMenuContent>
            </NavigationMenuItem>
          ) : (
            <NavigationMenuItem key={i}>
              <NavigationMenuLink href={route.url ?? ''}>
                {route.label}
              </NavigationMenuLink>
            </NavigationMenuItem>
          )
        )}
        <DesktopLocaleSwitcher />
      </NavigationMenuList>
    </NavigationMenu>
  );
}
