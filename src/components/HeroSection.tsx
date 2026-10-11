import React, { useState, useRef } from 'react';
import { HeroAnimationMode, FontPairOption } from '../types';
import { ArrowDown, FileText, ArrowRight } from 'lucide-react';
import { useContent } from '../context/ContentContext';

interface HeroSectionProps {
  headline: string;
  subheadline: string;
  fontPair: FontPairOption;
  initialMode?: HeroAnimationMode;
  onOpenResume: () => void;
  realName: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  headline,
  subheadline,
  fontPair,
  initialMode = 'grid',
  onOpenResume,
  realName,
}) => {
  const { settings, t } = useContent();
  const animationMode: HeroAnimationMode = initialMode; // chosen in /admin → Appearance
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const [activePersona, setActivePersona] = useState<'persona' | 'real'>('persona');
  const displayName = activePersona === 'persona' ? headline : realName;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  };

  const matrixTerms = [
    'ROAS: 4.2x',
    'python manage.py runserver',
    'Meta_Ads_Manager.scale()',
    'SERP #1 RANK',
    'CyberBix.deploy()',
    'const ctr = 0.38;',
    'ORDERBIX_STOREFRONT',
    'Google_Search_Console',
    '6THLOOM_VIRAL_GIVEAWAY',
    'border-radius: 20px;',
    'GA4_CONVERSIONS',
    'TAILWIND_B&W',
    'git commit -m "scale"',
    'DESERT_AYURVEDA_UAE'
  ];

  return (
    <section
      id="home"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-[90vh] flex flex-col justify-center items-center px-6 overflow-hidden border-b border-white/10 select-none"
    >
      {/* Background Interactive Animation Layers */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* MODE 1: Abstract Grid with ripple effect based on mouse pos */}
        {animationMode === 'grid' && (
          <div
            className="absolute inset-0 opacity-25 transition-transform duration-300 ease-out"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(255, 255, 255, 0.12) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255, 255, 255, 0.12) 1px, transparent 1px)
              `,
              backgroundSize: '64px 64px',
              transform: `perspective(600px) rotateX(${
                (mousePos.y - 0.5) * 8
              }deg) rotateY(${-(mousePos.x - 0.5) * 8}deg) scale(${
                1 + Math.abs(mousePos.x - 0.5) * 0.08
              })`,
            }}
          >
            <div
              className="absolute w-96 h-96 rounded-full bg-white/10 blur-3xl transition-all duration-150"
              style={{
                left: `calc(${mousePos.x * 100}% - 192px)`,
                top: `calc(${mousePos.y * 100}% - 192px)`,
              }}
            />
          </div>
        )}

        {/* MODE 2: White Text Matrix Waterfall */}
        {animationMode === 'waterfall' && (
          <div className="absolute inset-0 flex justify-between opacity-20 text-[11px] font-mono-code text-white select-none">
            {[0, 1, 2, 3, 4, 5, 6, 7].map((colIndex) => (
              <div
                key={colIndex}
                className="flex flex-col gap-6 animate-pulse"
                style={{
                  animationDuration: `${3 + (colIndex % 3)}s`,
                  transform: `translateY(${((colIndex * 37) % 50)}px)`,
                }}
              >
                {matrixTerms
                  .concat(matrixTerms)
                  .slice(colIndex, colIndex + 8)
                  .map((term, i) => (
                    <span
                      key={i}
                      className="tracking-widest whitespace-nowrap opacity-60 hover:opacity-100 transition-opacity"
                    >
                      {term}
                    </span>
                  ))}
              </div>
            ))}
          </div>
        )}

        {/* MODE 3: Discreet White Outline Circle Pulse */}
        {animationMode === 'circles' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-96 h-96">
              <div className="absolute inset-0 rounded-full border border-white/25 animate-ping opacity-30" style={{ animationDuration: '4s' }} />
              <div className="absolute -inset-16 rounded-full border border-white/20 animate-ping opacity-25" style={{ animationDuration: '6s' }} />
              <div className="absolute -inset-32 rounded-full border border-white/10 animate-ping opacity-20" style={{ animationDuration: '8s' }} />
              <div className="absolute -inset-48 rounded-full border border-white/5 animate-pulse opacity-15" />
            </div>
          </div>
        )}
      </div>

      {/* Main Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
        {/* Persona toggle */}
        <div className="mb-6 flex items-center gap-2 text-xs text-zinc-400 font-mono-code">
          <span>{t('hero.eyebrow')}</span>
          <span aria-hidden="true">/</span>
          <button
            onClick={() => setActivePersona(activePersona === 'persona' ? 'real' : 'persona')}
            className="hover:text-white underline underline-offset-4 transition-colors cursor-pointer"
            title="Toggle between Creative Persona & Legal Name"
          >
            {activePersona === 'persona' ? t('hero.viewAsReal') : t('hero.viewAsPersona')}
          </button>
        </div>

        {/* Big powerful white text */}
        <h1
          className={`text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-white tracking-tighter leading-none mb-6 drop-shadow-sm transition-all ${fontPair.headlineClass}`}
          style={{ textWrap: 'balance' }}
        >
          {displayName}
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-xl md:text-2xl font-medium tracking-widest text-zinc-300 uppercase mb-10 max-w-3xl">
          {subheadline}
        </p>

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href="#projects"
            className="px-8 py-4 text-sm font-bold uppercase tracking-wider text-black bg-white rounded-full hover:bg-zinc-200 hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center gap-2 cursor-pointer"
          >
            <span>{t('hero.ctaPrimary')}</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          <button
            onClick={onOpenResume}
            className="px-7 py-4 text-sm font-semibold uppercase tracking-wider text-white border border-white/30 rounded-full hover:border-white hover:bg-white/10 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>{t('hero.ctaSecondary')}</span>
          </button>
        </div>

        {/* Metric Bar Below CTA */}
        <div className="mt-16 pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-12 text-center w-full max-w-4xl">
          {settings.hero_metrics.map((m) => (
            <div key={m.id}>
              <div className="text-2xl sm:text-3xl font-extrabold text-white tabular-nums">{m.value}</div>
              <div className="text-xs text-zinc-400 uppercase tracking-wider mt-1">{m.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Subtle Scroll Down Prompt */}
      <a
        href="#about"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-zinc-500 hover:text-white transition-colors animate-bounce flex flex-col items-center gap-1 text-[10px] uppercase font-mono-code tracking-widest"
      >
        <span>{t('hero.scroll')}</span>
        <ArrowDown className="w-3.5 h-3.5" />
      </a>
    </section>
  );
};
