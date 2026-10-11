import React from 'react';
import { FontPairOption } from '../types';
import { useContent } from '../context/ContentContext';

interface NavbarProps {
  currentFontPair: FontPairOption;
  onOpenResume: () => void;
  personaName: string;
}

export const Navbar: React.FC<NavbarProps> = ({ currentFontPair, onOpenResume, personaName }) => {
  const { settings } = useContent();

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-black/80 border-b border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between gap-8">
        {/* Brand */}
        <a
          href="#home"
          className={`text-lg md:text-xl font-bold tracking-tight text-white hover:opacity-80 transition-opacity whitespace-nowrap shrink-0 ${currentFontPair.headlineClass}`}
        >
          {personaName}
        </a>

        {/* Primary nav links (managed from /admin) */}
        <nav className="hidden lg:flex items-center gap-7 text-xs tracking-wider uppercase text-zinc-400 font-medium">
          {settings.nav.filter((n) => n.visible).map((n) =>
            n.kind === 'resume' ? (
              <button
                key={n.id}
                onClick={onOpenResume}
                className="text-zinc-300 hover:text-white underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                {n.label}
              </button>
            ) : (
              <a
                key={n.id}
                href={n.href}
                {...(/^https?:/.test(n.href) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="hover:text-white transition-colors whitespace-nowrap shrink-0"
              >
                {n.label}
              </a>
            )
          )}
        </nav>
      </div>
    </header>
  );
};
