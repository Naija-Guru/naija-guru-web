export function Footer() {
  return (
    <footer className="tw-flex tw-flex-col tw-gap-2 sm:tw-flex-row tw-py-6 tw-w-full tw-shrink-0 tw-items-center tw-px-4 md:tw-px-6 tw-border-t">
      <p className="tw-text-xs tw-text-gray-500 dark:tw-text-gray-400">
        © {new Date().getFullYear()} Naija Spell Checker.
      </p>
    </footer>
  );
}
