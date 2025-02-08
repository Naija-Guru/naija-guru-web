'use client';

import React, { ReactNode, FC, useEffect } from 'react';
import { shift, flip, hide, VirtualElement } from '@floating-ui/dom';
import {
  useFloating,
  useDismiss,
  useInteractions,
  FloatingPortal,
} from '@floating-ui/react';

import { cn } from './utils';

export interface PopoverProps {
  children: ReactNode;
  open: boolean;
  toggleOpen: (open: boolean) => void;
  virtualAnchor: VirtualElement | null;
}

const Popover: FC<PopoverProps> = ({
  children,
  open,
  toggleOpen,
  virtualAnchor,
}) => {
  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: toggleOpen,
    middleware: [
      shift(),
      flip(),
      hide({
        strategy: 'referenceHidden',
      }),
      hide({
        strategy: 'escaped',
      }),
    ],
  });

  const dismiss = useDismiss(context);

  const { getFloatingProps } = useInteractions([dismiss]);

  useEffect(() => {
    if (virtualAnchor) {
      refs.setPositionReference(virtualAnchor);
    }
  }, [refs, virtualAnchor]);

  return open ? (
    <FloatingPortal id="naija-spellchecker-popup-root">
      <div
        ref={refs.setFloating}
        className={cn(
          'tw-z-50 tw-w-72 tw-rounded-md tw-border tw-bg-popover tw-p-4 tw-text-popover-foreground tw-shadow-md tw-outline-none'
        )}
        style={floatingStyles}
        {...getFloatingProps()}
      >
        {children}
      </div>
    </FloatingPortal>
  ) : null;
};

Popover.displayName = 'Popover';

export { Popover };
