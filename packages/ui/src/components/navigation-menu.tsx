'use client';

import * as React from 'react';
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu';
import { cva } from 'class-variance-authority';
import { ChevronDown } from 'lucide-react';

import { cn } from './utils';

interface NavigationItemPositionContext {
  leftPosition: number;
  setLeftPosition?: (leftPosition: number) => void;
  onLeftPositionChange?: (leftPosition: number) => void;
}

class NavigationItemPositionDefaultContext
  implements NavigationItemPositionContext
{
  public setLeftPosition?: (leftPosition: number) => void;
  public onLeftPositionChange?: (leftPosition: number) => void;

  constructor(public leftPosition: number = 0) {
    this.setLeftPosition = (leftPosition: number) => {
      this.leftPosition = leftPosition;
      if (this.onLeftPositionChange) {
        this.onLeftPositionChange(leftPosition);
      }
    };
  }
}
const CurrentNavigationItemPositionContext =
  React.createContext<NavigationItemPositionContext | null>(null);

const NavigationMenuItemProvider: React.FC<{
  navigationItemPosition: NavigationItemPositionContext | null;
  children: React.ReactNode;
}> = ({ navigationItemPosition, children }) => {
  return (
    <CurrentNavigationItemPositionContext.Provider
      value={navigationItemPosition}
    >
      {children}
    </CurrentNavigationItemPositionContext.Provider>
  );
};

const NavigationMenu = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root>
>(({ className, children, ...props }, ref) => {
  const navigationItemPosition = new NavigationItemPositionDefaultContext();

  return (
    <NavigationMenuPrimitive.Root
      ref={ref}
      className={cn(
        'tw-relative tw-z-10 tw-flex tw-max-w-max tw-flex-1 tw-items-center tw-justify-center',
        className
      )}
      {...props}
    >
      <NavigationMenuItemProvider
        navigationItemPosition={navigationItemPosition}
      >
        {children}
        <NavigationMenuViewport />
      </NavigationMenuItemProvider>
    </NavigationMenuPrimitive.Root>
  );
});
NavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName;

const NavigationMenuList = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.List
    ref={ref}
    className={cn(
      'tw-group tw-flex tw-flex-1 tw-list-none tw-items-center tw-justify-center tw-space-x-6',
      className
    )}
    {...props}
  />
));
NavigationMenuList.displayName = NavigationMenuPrimitive.List.displayName;

const NavigationMenuItem = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Item>
>(({ className, children, ...props }, ref) => {
  const currentNavigationItemPositionContext = React.useContext(
    CurrentNavigationItemPositionContext
  );
  const itemRef = React.useRef<HTMLLIElement>(null);

  React.useEffect(() => {
    itemRef.current?.addEventListener('mouseenter', () => {
      if (itemRef.current && currentNavigationItemPositionContext != null) {
        const parentRect =
          itemRef.current.parentElement?.getBoundingClientRect();
        const rect = itemRef.current.getBoundingClientRect();
        if (
          parentRect &&
          currentNavigationItemPositionContext?.setLeftPosition
        ) {
          currentNavigationItemPositionContext.setLeftPosition(
            rect.left - parentRect.left
          );
        }
      }
    });
  }, [itemRef, currentNavigationItemPositionContext]);

  return (
    <NavigationMenuPrimitive.Item
      ref={(node) => {
        itemRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          (ref as React.RefObject<HTMLLIElement | null>).current = node;
        }
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </NavigationMenuPrimitive.Item>
  );
});
NavigationMenuItem.displayName = NavigationMenuPrimitive.Item.displayName;

const navigationMenuTriggerStyle = cva(
  'tw-group tw-inline-flex tw-h-9 tw-w-max tw-items-center tw-justify-center disabled:tw-pointer-events-none disabled:tw-opacity-50'
);

const NavigationMenuTrigger = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Trigger
    ref={ref}
    className={cn(navigationMenuTriggerStyle(), 'tw-group', className)}
    {...props}
  >
    {children}
    <ChevronDown
      className="tw-relative tw-top-[1px] tw-w-4 tw-h-4 tw-ml-1 tw-transition tw-duration-300 group-data-[state=open]:tw-rotate-180"
      aria-hidden="true"
    />
  </NavigationMenuPrimitive.Trigger>
));
NavigationMenuTrigger.displayName = NavigationMenuPrimitive.Trigger.displayName;

const NavigationMenuContent = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Content
    ref={ref}
    className={cn(
      'tw-left-0 tw-top-0 tw-grid tw-gap-6 tw-p-4 data-[motion^=from-]:tw-animate-in data-[motion^=to-]:tw-animate-out data-[motion^=from-]:tw-fade-in data-[motion^=to-]:tw-fade-out data-[motion=from-end]:tw-slide-in-from-right-52 data-[motion=from-start]:tw-slide-in-from-left-52 data-[motion=to-end]:tw-slide-out-to-right-52 data-[motion=to-start]:tw-slide-out-to-left-52',
      className
    )}
    {...props}
  />
));
NavigationMenuContent.displayName = NavigationMenuPrimitive.Content.displayName;

const NavigationMenuLink = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Link>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Link>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Link className={className} ref={ref} {...props} />
));
NavigationMenuLink.displayName = NavigationMenuPrimitive.Link.displayName;

const NavigationMenuViewport = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport>
>(({ className, ...props }, ref) => {
  const currentNavigationItemPositionContext = React.useContext(
    CurrentNavigationItemPositionContext
  );
  if (!currentNavigationItemPositionContext) {
    throw new Error(
      'Cannot use NavigationMenuViewport outside of NavigationMenu'
    );
  }
  const [leftPosition, setLeftPosition] = React.useState<number>(
    currentNavigationItemPositionContext?.leftPosition ?? 0
  );
  currentNavigationItemPositionContext.onLeftPositionChange = (
    leftPosition: number
  ) => {
    setLeftPosition(leftPosition);
  };

  return (
    <div
      style={{ left: leftPosition }}
      className={cn(
        'tw-absolute tw-left-0 tw-top-full tw-flex tw-justify-center'
      )}
    >
      <NavigationMenuPrimitive.Viewport
        className={cn(
          'tw-origin-top-center tw-relative tw-mt-1.5 tw-h-[var(--radix-navigation-menu-viewport-height)] tw-w-full tw-overflow-hidden tw-rounded-md tw-border tw-bg-popover tw-text-popover-foreground tw-shadow-lg data-[state=open]:tw-animate-in data-[state=closed]:tw-animate-out data-[state=closed]:tw-zoom-out-95 data-[state=open]:tw-zoom-in-90 md:tw-w-[var(--radix-navigation-menu-viewport-width)]',
          className
        )}
        ref={ref}
        {...props}
      />
    </div>
  );
});
NavigationMenuViewport.displayName =
  NavigationMenuPrimitive.Viewport.displayName;

const NavigationMenuIndicator = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Indicator>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Indicator>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Indicator
    ref={ref}
    className={cn(
      'tw-top-full tw-z-[1] tw-flex tw-h-1.5 tw-items-end tw-justify-center tw-overflow-hidden data-[state=visible]:tw-animate-in data-[state=hidden]:tw-animate-out data-[state=hidden]:tw-fade-out data-[state=visible]:tw-fade-in',
      className
    )}
    {...props}
  >
    <div className="tw-relative tw-top-[60%] tw-h-2 tw-w-2 tw-rotate-45 tw-bg-border tw-shadow-md" />
  </NavigationMenuPrimitive.Indicator>
));
NavigationMenuIndicator.displayName =
  NavigationMenuPrimitive.Indicator.displayName;

export {
  navigationMenuTriggerStyle,
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
};
