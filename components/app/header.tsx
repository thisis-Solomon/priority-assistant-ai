import { Logo } from '@/components/icons/logo';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="py-4 border-b">
      <div className="container mx-auto px-4">
        <Link href="/" className="flex items-center gap-3">
          <Logo className="h-8 w-8 text-primary" />
          <span className="text-xl font-semibold tracking-tight text-foreground">
            Priority Assistant AI
          </span>
        </Link>
      </div>
    </header>
  );
}
