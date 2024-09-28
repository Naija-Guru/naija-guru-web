'use client';

import { ReactNode, FC } from 'react';
import { shift, flip, hide } from '@floating-ui/dom';
import {
  useFloating,
  useDismiss,
  useInteractions,
  FloatingPortal,
} from '@floating-ui/react';
import { cn } from '@/lib/utils';

export type VirtualAnchor = {
  getBoundingClientRect(): Omit<DOMRect, 'toJSON'>;
};

export interface PopoverProps {
  children: ReactNode;
  open: boolean;
  toggleOpen: (open: boolean) => void;
  virtualAnchor: VirtualAnchor | null;
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
    elements: {
      reference: virtualAnchor as Element,
    },
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

  return open ? (
    <FloatingPortal id="naija-spellchecker-popup-root">
      <div
        ref={refs.setFloating}
        className={cn(
          'z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none'
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
