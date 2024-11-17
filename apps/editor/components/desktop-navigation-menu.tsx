import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@naija-spell-checker/ui';

import { HEADER_ROUTES } from '../constants';

export function DesktopNavigationMenu() {
  return (
    <NavigationMenu className="hidden md:block">
      <NavigationMenuList>
        {HEADER_ROUTES.map((route, i) =>
          Array.isArray(route.routes) ? (
            <NavigationMenuItem value={route.label} key={i}>
              <NavigationMenuTrigger>{route.label}</NavigationMenuTrigger>
              <NavigationMenuContent className="w-[300px]">
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
      </NavigationMenuList>
    </NavigationMenu>
  );
}
