import { useContent } from '../context/ContentContext';
import React from 'react';
import { ExperienceItem, FontPairOption } from '../types';
import { Zap } from 'lucide-react';

interface BrandingSectionProps {
  workExperience: ExperienceItem[];
  fontPair: FontPairOption;
}

export const BrandingSection: React.FC<BrandingSectionProps> = ({
  workExperience,
  fontPair,
}) => {
  const { t, settings: { clients: CLIENT_LOGOS } } = useContent();
  return (
    <section id="branding" className="py-24 px-6 border-b border-white/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Top Header */}
        <div className="mb-16">
          <div className="text-xs font-mono-code uppercase tracking-widest text-zinc-400 mb-2">
            {t('branding.eyebrow')}
          </div>
          <h2
            className={`text-3xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tight ${fontPair.headlineClass}`}
          >
            {t('branding.title')}
          </h2>
        </div>

        {/* {t('branding.brandsLabel')}: Continuous Scrolling Marquee of pure white outline logos */}
        <div className="mb-20">
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-white/10">
            <h3 className="text-xs sm:text-sm font-mono-code uppercase tracking-widest text-zinc-400">
              BRANDS I'VE HANDLED
            </h3>
            <span className="text-[11px] font-mono-code text-zinc-500">
              {t('branding.brandsMeta')}
            </span>
          </div>

          {/* Marquee ticker container with subtle edge fade */}
          <div className="relative w-full overflow-hidden py-4 mask-radial">
            <div className="flex animate-marquee gap-8 items-center whitespace-nowrap">
              {CLIENT_LOGOS.concat(CLIENT_LOGOS).map((logo, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-zinc-950/80 border border-white/15 hover:border-white transition-all group shrink-0"
                >
                  {/* Minimalist white monogram badge */}
                  <div className="w-8 h-8 rounded-lg bg-black border border-white/30 flex items-center justify-center text-xs font-mono-code font-bold text-white group-hover:bg-white group-hover:text-black transition-colors">
                    {logo.symbol}
                  </div>
                  <span className="text-sm font-bold tracking-widest text-white/90 group-hover:text-white uppercase font-mono-code">
                    {logo.name}
                  </span>
                </div>
              ))}
            </div>

            {/* Gradient shadow edge overlays */}
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-black to-transparent pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-black to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Main Grid: CYBERFIX Pulse Frame on Left + WORK HISTORY Timeline on Right */}
        <div id="experience" className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* LEFT: Central large rounded-square frame labeled "CYBERFIX" with subtle continuous animated white glow or pulse */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="w-full max-w-md p-8 sm:p-10 rounded-[28px] bg-zinc-950 border-2 border-white/30 animate-pulse-glow flex flex-col items-center justify-center text-center relative overflow-hidden">
              {/* Corner tech crosshairs */}
              <div className="absolute top-4 left-4 text-[10px] font-mono-code text-zinc-500">+</div>
              <div className="absolute top-4 right-4 text-[10px] font-mono-code text-zinc-500">+</div>
              <div className="absolute bottom-4 left-4 text-[10px] font-mono-code text-zinc-500">+</div>
              <div className="absolute bottom-4 right-4 text-[10px] font-mono-code text-zinc-500">+</div>

              {/* Glowing center emblem */}
              <div className="w-24 h-24 rounded-2xl bg-black border-2 border-white flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                <Zap className="w-12 h-12 text-white" />
              </div>

              {/* Large prominent text: CYBERFIX */}
              <h3 className={`text-4xl sm:text-5xl font-black text-white tracking-widest uppercase mb-2 ${fontPair.headlineClass}`}>
                CYBERFIX
              </h3>
              <div className="text-xs font-mono-code text-zinc-400 uppercase tracking-widest mb-6">
                CYBERBIX IN-HOUSE VENTURES
              </div>

              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-xs mb-6">
                Spearheading comprehensive brand architectures, AI-assisted visual guidelines, and direct growth engines for high-impact social commerce.
              </p>

              {/* Live metrics inside the Cyberfix frame */}
              <div className="w-full pt-4 border-t border-white/15 grid grid-cols-2 gap-3 text-left">
                <div className="p-3 bg-black rounded-xl border border-white/10">
                  <div className="text-[10px] font-mono-code text-zinc-500 uppercase">Brands Built</div>
                  <div className="text-lg font-bold text-white tabular-nums">Orderbix · 6thLoom</div>
                </div>
                <div className="p-3 bg-black rounded-xl border border-white/10">
                  <div className="text-[10px] font-mono-code text-zinc-500 uppercase">Active Status</div>
                  <div className="text-lg font-bold text-white tabular-nums">Current Role</div>
                </div>
              </div>
            </div>

            <div className="mt-4 text-center">
              <span className="text-[11px] font-mono-code text-zinc-500 uppercase tracking-wider">
                Continuous white glow pulse · verified ecosystem
              </span>
            </div>
          </div>

          {/* RIGHT: Work Experience Vertical Timeline */}
          <div className="lg:col-span-7">
            <div className="flex items-center justify-between mb-8 pb-3 border-b border-white/10">
              <h3 className="text-xs font-mono-code uppercase tracking-widest text-zinc-400">
                WORK HISTORY
              </h3>
              <span className="text-xs font-mono-code text-zinc-500">
                2025 — PRESENT (CHRONOLOGICAL)
              </span>
            </div>

            <div className="relative pl-6 sm:pl-8 border-l border-white/20 space-y-12">
              {workExperience.map((exp) => (
                <div key={exp.id} className="relative group">
                  {/* Small white circle icon marking each timeline point */}
                  <div className="absolute -left-[31px] sm:-left-[39px] top-1 w-4 h-4 rounded-full bg-black border-2 border-white group-hover:scale-125 group-hover:bg-white transition-all shadow-[0_0_10px_rgba(255,255,255,0.4)]" />

                  {/* Role & Company */}
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-2">
                    <h4 className={`text-xl sm:text-2xl font-bold text-white uppercase tracking-tight ${fontPair.headlineClass}`}>
                      {exp.role}
                    </h4>
                    <span className="text-xs font-mono-code text-zinc-400 tabular-nums">
                      {exp.period}
                    </span>
                  </div>

                  <div className="text-sm font-semibold text-zinc-300 uppercase tracking-wider font-mono-code mb-3">
                    {exp.company} <span className="text-zinc-500">· {exp.location}</span>
                  </div>

                  <p className="text-sm text-zinc-400 leading-relaxed mb-4">
                    {exp.summary}
                  </p>

                  {/* Bullet Highlights */}
                  <ul className="space-y-2 text-xs sm:text-sm text-zinc-300">
                    {exp.achievements.map((ach, aIdx) => (
                      <li key={aIdx} className="flex items-start gap-2.5">
                        <span className="text-white font-mono-code mt-0.5">•</span>
                        <span>{ach}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
