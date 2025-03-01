import { PenLineIcon } from 'lucide-react';
import { FC } from 'react';

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  FloatingButton,
} from '@naija-spell-checker/ui';

import { CONTENT_SAMPLES } from '@/constants/content';
import { useIsMobile } from '@/hooks/use-is-mobile';

interface AddSampleContentProps {
  onAddSampleContent: (content: string) => void;
}

export const AddSampleContent: FC<AddSampleContentProps> = ({
  onAddSampleContent,
}) => {
  const isMobile = useIsMobile();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {isMobile ? (
          <FloatingButton
            variant="outline"
            className="md:tw-hidden"
            position="bottom-left"
            size="lg"
          >
            <PenLineIcon />
          </FloatingButton>
        ) : (
          <Button
            variant="outline"
            className="tw-mb-4 tw-hidden md:tw-inline-flex"
          >
            <PenLineIcon className="tw-h-4 tw-w-4 tw-mr-1" />
            Sample content
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {CONTENT_SAMPLES.map((sample, index) => (
          <DropdownMenuItem
            key={index}
            onClick={() => onAddSampleContent(sample.content)}
          >
            <Button variant="ghost">{sample.title}</Button>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
