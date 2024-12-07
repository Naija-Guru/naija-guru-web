import { Button } from '@naija-spell-checker/ui';
import { WrenchIcon } from 'lucide-react';

export const ApplyAllSuggestions = ({
  isAcceptingAllSuggestions,
  onApplyAllSuggestions,
}: {
  isAcceptingAllSuggestions: boolean;
  onApplyAllSuggestions: () => void;
}) => {
  return (
    <>
      {isAcceptingAllSuggestions ? (
        <div className="grid place-items-center text-secondary">
          <WrenchIcon className="animate-bounce mx-auto h-10 w-10 md:h-20 md:w-20" />
          <span className="text-center p-4">Applying all suggestions...</span>
        </div>
      ) : (
        <Button className="mx-6 mb-2" onClick={onApplyAllSuggestions}>
          Accept All
        </Button>
      )}
    </>
  );
};
