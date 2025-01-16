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
        'relative z-10 flex max-w-max flex-1 items-center justify-center',
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
      'group flex flex-1 list-none items-center justify-center space-x-6',
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
  'group inline-flex h-9 w-max items-center justify-center disabled:pointer-events-none disabled:opacity-50'
);

const NavigationMenuTrigger = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Trigger
    ref={ref}
    className={cn(navigationMenuTriggerStyle(), 'group', className)}
    {...props}
  >
    {children}{' '}
    <ChevronDown
      className="relative top-[1px] w-4 h-4 ml-1 transition duration-300 group-data-[state=open]:rotate-180"
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
      'left-0 top-0 grid gap-6 p-4 data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52',
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
      className={cn('absolute left-0 top-full flex justify-center')}
    >
      <NavigationMenuPrimitive.Viewport
        className={cn(
          'origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 md:w-[var(--radix-navigation-menu-viewport-width)]',
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
      'top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in',
      className
    )}
    {...props}
  >
    <div className="relative top-[60%] h-2 w-2 rotate-45 bg-border shadow-md" />
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
