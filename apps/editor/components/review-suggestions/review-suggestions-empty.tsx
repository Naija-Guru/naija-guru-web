import { FileCheck } from 'lucide-react';

export function ReviewSuggestionsEmpty() {
  return (
    <div>
      <FileCheck className="mx-auto h-10 w-10 md:h-20 md:w-20 text-secondary" />
      <p className="p-4 text-center">You are all good here!</p>
    </div>
  );
}
