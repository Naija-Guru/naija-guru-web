'use client';

import * as React from 'react';
import { ArrowLeftIcon, ArrowRightIcon } from '@radix-ui/react-icons';
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from 'embla-carousel-react';

import { cn } from './utils';
import { Button } from './button';

type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];

type CarouselProps = {
  opts?: CarouselOptions;
  plugins?: CarouselPlugin;
  orientation?: 'horizontal' | 'vertical';
  setApi?: (api: CarouselApi) => void;
};

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: ReturnType<typeof useEmblaCarousel>[1];
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
} & CarouselProps;

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

function useCarousel() {
  const context = React.useContext(CarouselContext);

  if (!context) {
    throw new Error('useCarousel must be used within a <Carousel />');
  }

  return context;
}

const Carousel = (
  {
    ref,
    orientation = 'horizontal',
    opts,
    setApi,
    plugins,
    className,
    children,
    ...props
  }
) => {
  const [carouselRef, api] = useEmblaCarousel(
    {
      ...opts,
      axis: orientation === 'horizontal' ? 'x' : 'y',
    },
    plugins
  );
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);

  const onSelect = React.useCallback((api: CarouselApi) => {
    if (!api) {
      return;
    }

    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
  }, []);

  const scrollPrev = React.useCallback(() => {
    api?.scrollPrev();
  }, [api]);

  const scrollNext = React.useCallback(() => {
    api?.scrollNext();
  }, [api]);

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        scrollPrev();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        scrollNext();
      }
    },
    [scrollPrev, scrollNext]
  );

  React.useEffect(() => {
    if (!api || !setApi) {
      return;
    }

    setApi(api);
  }, [api, setApi]);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    onSelect(api);
    api.on('reInit', onSelect);
    api.on('select', onSelect);

    return () => {
      api?.off('select', onSelect);
    };
  }, [api, onSelect]);

  return (
    <CarouselContext.Provider
      value={{
        carouselRef,
        api: api,
        opts,
        orientation:
          orientation || (opts?.axis === 'y' ? 'vertical' : 'horizontal'),
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
      }}
    >
      <div
        ref={ref}
        onKeyDownCapture={handleKeyDown}
        className={cn('tw-relative', className)}
        role="region"
        aria-roledescription="carousel"
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  );
};
Carousel.displayName = 'Carousel';

const CarouselContent = (
  {
    ref,
    className,
    ...props
  }: React.HTMLAttributes<HTMLDivElement> & {
    ref: React.RefObject<HTMLDivElement>;
  }
) => {
  const { carouselRef, orientation } = useCarousel();

  return (
    <div ref={carouselRef} className="tw-overflow-hidden">
      <div
        ref={ref}
        className={cn(
          'tw-flex',
          {
            'tw-flex-row': orientation === 'horizontal',
            'tw-flex-col': orientation === 'vertical',
          },
          className
        )}
        {...props}
      />
    </div>
  );
};
CarouselContent.displayName = 'CarouselContent';

const CarouselItem = (
  {
    ref,
    className,
    ...props
  }: React.HTMLAttributes<HTMLDivElement> & {
    ref: React.RefObject<HTMLDivElement>;
  }
) => {
  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn(
        'tw-min-w-0 tw-shrink-0 tw-grow-0 tw-basis-full',
        className
      )}
      {...props}
    />
  );
};
CarouselItem.displayName = 'CarouselItem';

const CarouselPrevious = (
  {
    ref,
    className,
    variant = 'outline',
    size = 'icon',
    ...props
  }: React.ComponentProps<typeof Button> & {
    ref: React.RefObject<HTMLButtonElement>;
  }
) => {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel();

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        'tw-absolute tw-h-8 tw-w-8 tw-rounded-full',
        orientation === 'horizontal'
          ? 'tw-left-3 tw-top-1/2 tw-translate-y-1/2'
          : 'tw-top-3 tw-left-1/2 tw-translate-x-1/2 tw-rotate-90',
        className
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ArrowLeftIcon className="tw-h-4 tw-w-4" />
      <span className="tw-sr-only">Previous slide</span>
    </Button>
  );
};
CarouselPrevious.displayName = 'CarouselPrevious';

const CarouselNext = (
  {
    ref,
    className,
    variant = 'outline',
    size = 'icon',
    ...props
  }: React.ComponentProps<typeof Button> & {
    ref: React.RefObject<HTMLButtonElement>;
  }
) => {
  const { orientation, scrollNext, canScrollNext } = useCarousel();

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        'tw-absolute tw-h-8 tw-w-8 tw-rounded-full',
        orientation === 'horizontal'
          ? 'tw-right-3 tw-top-1/2 tw-translate-y-1/2'
          : 'tw-bottom-3 tw-left-1/2 tw-translate-x-1/2 tw-rotate-90',
        className
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ArrowRightIcon className="tw-h-4 tw-w-4" />
      <span className="tw-sr-only">Next slide</span>
    </Button>
  );
};
CarouselNext.displayName = 'CarouselNext';

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
};
