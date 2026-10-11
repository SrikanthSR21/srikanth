import { useContent } from '../context/ContentContext';
import React from 'react';
import { PortfolioInfo, FontPairOption } from '../types';
import { Download, CheckCircle2, Award, GraduationCap, MapPin, Mail, Phone } from 'lucide-react';
import profileBwImg from '../assets/images/profile_editorial_portrait_1791718263477.jpg';

interface AboutSectionProps {
  info: PortfolioInfo;
  fontPair: FontPairOption;
  onOpenResume: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  info,
  fontPair,
  onOpenResume,
}) => {
  const { t, settings: { images } } = useContent();
  return (
    <section id="about" className="py-24 px-6 border-b border-white/10 relative">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Rounded Arch Photo Frame (Monochrome B&W Profile as per specification) */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative group w-full max-w-sm">
              {/* Outer decorative halo border */}
              <div className="absolute -inset-2 rounded-t-[140px] rounded-b-[24px] border border-white/20 group-hover:border-white/50 transition-colors pointer-events-none" />

              {/* Arch container */}
              <div className="relative overflow-hidden rounded-t-[130px] rounded-b-[20px] bg-zinc-900 border border-white/20 shadow-2xl aspect-[3/4]">
                <img
                  src={images.profile || profileBwImg}
                  alt="Morgan Maxwell / Srikanth SR Profile Portrait"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover grayscale contrast-125 group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                {/* Subdued gradient scrim at bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />

                {/* Overlaid minimal tag on photo */}
                <div className="absolute bottom-4 left-4 right-4 p-3 bg-black/70 backdrop-blur-md rounded-xl border border-white/15">
                  <div className="text-xs font-bold text-white uppercase tracking-wider">
                    {info.realName}
                  </div>
                  <div className="text-[11px] text-zinc-400 font-mono-code mt-0.5 flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-white" />
                    <span>Open to UAE & Global Relocation</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick contact credentials strip below arch */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs font-mono-code text-zinc-400">
              <a
                href={`mailto:${info.email}`}
                className="flex items-center gap-1.5 hover:text-white transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>{info.email}</span>
              </a>
              <span aria-hidden="true">·</span>
              <a
                href={`tel:${info.phone}`}
                className="flex items-center gap-1.5 hover:text-white transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{info.phone}</span>
              </a>
            </div>
          </div>

          {/* Right Column: High-Impact Resume Details */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Header: ABOUT */}
            <div className="text-xs font-mono-code uppercase tracking-widest text-zinc-400 mb-2">
              {t('about.eyebrow')}
            </div>
            <h2
              className={`text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6 uppercase tracking-tight ${fontPair.headlineClass}`}
            >
              {t('about.title')}
            </h2>

            <p className="text-zinc-300 text-base sm:text-lg leading-relaxed mb-8">
              {info.aboutBio}
            </p>

            {/* Education & Certifications Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 p-5 bg-zinc-950 rounded-[20px] border border-white/10">
              <div className="flex gap-3">
                <GraduationCap className="w-5 h-5 text-white shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">
                    Academic Background
                  </div>
                  <div className="text-sm font-semibold text-white mt-1">
                    Master of Arts (MA) in English
                  </div>
                  <div className="text-xs text-zinc-400">
                    Vivekananda College, Agasteeswaram (2021)
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Award className="w-5 h-5 text-white shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">
                    Specialist Certification
                  </div>
                  <div className="text-sm font-semibold text-white mt-1">
                    Digital Marketing Specialist
                  </div>
                  <div className="text-xs text-zinc-400">
                    DigitalX Marketers Academy (SEO, SEM, Meta, GA4)
                  </div>
                </div>
              </div>
            </div>

            {/* Header: SKILLS */}
            <div className="text-xs font-mono-code uppercase tracking-widest text-zinc-400 mb-3">
              CORE CAPABILITIES
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              {info.skills.map((skillGroup, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-zinc-950/60 rounded-[16px] border border-white/10 hover:border-white/25 transition-colors"
                >
                  <div className="text-xs font-bold text-white uppercase tracking-wider mb-2.5 pb-1 border-b border-white/10">
                    {skillGroup.category}
                  </div>
                  <ul className="space-y-1.5 text-xs text-zinc-300">
                    {skillGroup.items.map((item, itemIdx) => (
                      <li key={itemIdx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-white/80 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Prominent White Button: DOWNLOAD FULL CV */}
            <div>
              <button
                onClick={onOpenResume}
                className="px-8 py-4 text-sm font-bold uppercase tracking-wider text-black bg-white rounded-[20px] hover:bg-zinc-200 hover:scale-[1.02] active:scale-98 transition-all shadow-xl flex items-center gap-3 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>DOWNLOAD FULL CV</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
