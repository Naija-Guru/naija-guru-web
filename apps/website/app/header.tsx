import Link from 'next/link';
import Logo from '@/images/logo.svg';

export function Header() {
  return (
    <header className="px-4 lg:px-6 h-14 flex items-center">
      <Link className="flex items-center justify-center" href="/">
        <Logo className="h-6 w-6 mr-2" />
        <span className="font-bold text-primary">Naija Spell Checker</span>
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6">
        <Link
          className="text-sm font-medium text-primary hover:underline underline-offset-4"
          href="/demo"
        >
          Demo
        </Link>
      </nav>
    </header>
  );
}
