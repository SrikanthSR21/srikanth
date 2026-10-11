import React, { useState } from 'react';
import { FontPairOption, BackgroundTheme } from '../types';
import { FONT_PAIRS } from '../data/portfolioData';
import { useContent } from '../context/ContentContext';
import { Sliders, Sun, Moon, Lock, ChevronDown, Check } from 'lucide-react';

interface NavbarProps {
  currentTheme: BackgroundTheme;
  onThemeChange: (theme: BackgroundTheme) => void;
  currentFontPair: FontPairOption;
  onFontPairChange: (fontPair: FontPairOption) => void;
  onOpenAdmin: () => void;
  onOpenResume: () => void;
  personaName: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTheme,
  onThemeChange,
  currentFontPair,
  onFontPairChange,
  onOpenAdmin,
  onOpenResume,
  personaName,
}) => {
  const [fontMenuOpen, setFontMenuOpen] = useState(false);
  const { settings, t } = useContent();

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-black/80 border-b border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between gap-8">
        {/* Zone 1: Brand title, single element */}
        <a
          href="#home"
          className={`text-lg md:text-xl font-bold tracking-tight text-white hover:opacity-80 transition-opacity whitespace-nowrap shrink-0 ${currentFontPair.headlineClass}`}
        >
          {personaName}
        </a>

        {/* Zone 2: Primary Nav Links */}
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

        {/* Zone 3: Actions (Theme switcher, Typography menu, Admin) */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Typography Picker Dropdown */}
          <div className="relative">
            <button
              onClick={() => setFontMenuOpen(!fontMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-zinc-300 border border-white/15 rounded-lg hover:border-white/40 hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              title="Preview with different font pairs"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('nav.type')}</span>
              <ChevronDown className="w-3 h-3 text-zinc-400" />
            </button>

            {fontMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 p-2 rounded-xl bg-zinc-950 border border-white/20 shadow-2xl z-50 animate-in fade-in zoom-in-95">
                <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold px-2 py-1 mb-1">
                  Typography Pairing
                </div>
                {FONT_PAIRS.map((fp) => (
                  <button
                    key={fp.id}
                    onClick={() => {
                      onFontPairChange(fp);
                      setFontMenuOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-2 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
                      currentFontPair.id === fp.id
                        ? 'bg-white text-black font-semibold'
                        : 'text-zinc-300 hover:bg-white/10'
                    }`}
                  >
                    <div>
                      <div className="leading-tight">{fp.name}</div>
                      <div
                        className={`text-[10px] mt-0.5 ${
                          currentFontPair.id === fp.id ? 'text-zinc-700' : 'text-zinc-500'
                        }`}
                      >
                        {fp.headlineFont} + {fp.bodyFont}
                      </div>
                    </div>
                    {currentFontPair.id === fp.id && <Check className="w-3.5 h-3.5 shrink-0 ml-2" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Switcher: True Black vs Midnight Black */}
          <button
            onClick={() =>
              onThemeChange(currentTheme === 'true-black' ? 'midnight-black' : 'true-black')
            }
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-zinc-300 border border-white/15 rounded-lg hover:border-white/40 hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            title={`Current: ${
              currentTheme === 'true-black' ? 'True Black (#000000)' : 'Midnight Black (#0a0b0e)'
            }. Click to toggle.`}
          >
            {currentTheme === 'true-black' ? (
              <>
                <Moon className="w-3.5 h-3.5 text-zinc-300" />
                <span className="hidden sm:inline">{t('nav.trueBlack')}</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-zinc-300" />
                <span className="hidden sm:inline">{t('nav.midnight')}</span>
              </>
            )}
          </button>

          {/* Admin Panel Access Button */}
          <button
            onClick={onOpenAdmin}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-white border border-white/20 rounded-lg hover:bg-white/10 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            title="Open Developer & Admin Dashboard"
          >
            <Lock className="w-3 h-3 text-zinc-400" />
            <span className="hidden md:inline">{t('nav.admin')}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
