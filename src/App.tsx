import React, { useState, useEffect } from 'react';
import { TicketItem } from './types';
import { FONT_PAIRS } from './data/portfolioData';
import { useContent } from './context/ContentContext';

import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { ProjectPortfolio } from './components/ProjectPortfolio';
import { AdvertisingPortfolio } from './components/AdvertisingPortfolio';
import { BrandingSection } from './components/BrandingSection';
import { ContactSection } from './components/ContactSection';
import { FloatingContactButtons } from './components/FloatingContactButtons';
import { ResumeModal } from './components/ResumeModal';

export default function App() {
  // Everything below is driven by the database (managed at /admin); visitors have no controls.
  const { settings, collections, addTicket, t } = useContent();
  const themeSettings = settings.theme;
  const currentFontPair = FONT_PAIRS.find((f) => f.id === themeSettings.fontPairId) || FONT_PAIRS[0];
  const portfolioInfo = settings.info;

  const [resumeModalOpen, setResumeModalOpen] = useState(false);

  // If a CV file was uploaded in /admin, open it; otherwise show the built-in printable CV.
  const openResume = () => {
    if (portfolioInfo.resumeUrl) window.open(portfolioInfo.resumeUrl, '_blank', 'noopener,noreferrer');
    else setResumeModalOpen(true);
  };

  // Sync theme to root CSS variables
  useEffect(() => {
    const root = document.documentElement;
    let bg = '#000000';
    if (themeSettings.backgroundMode === 'midnight-black') bg = '#0a0b0e';
    else if (themeSettings.backgroundMode === 'custom') bg = themeSettings.customBg || '#000000';
    root.style.setProperty('--bg-color', bg);
    root.style.setProperty('--text-color', themeSettings.customText || '#ffffff');
    root.style.setProperty('--accent-btn', themeSettings.customAccent || '#ffffff');
  }, [themeSettings]);

  const handleAddTicket = (newTicket: TicketItem) => { addTicket(newTicket); };

  return (
    <div
      className={`min-h-screen text-white transition-colors duration-300 ${currentFontPair.bodyClass}`}
      style={{
        backgroundColor:
          themeSettings.backgroundMode === 'true-black'
            ? '#000000'
            : themeSettings.backgroundMode === 'midnight-black'
            ? '#0a0b0e'
            : themeSettings.customBg,
        color: themeSettings.customText || '#ffffff',
      }}
    >
      {/* 1. Navbar adhering to Top Bar Contract */}
      <Navbar
        currentFontPair={currentFontPair}
        onOpenResume={openResume}
        personaName={portfolioInfo.personaName}
      />

      {/* 2. Heroic Section */}
      <HeroSection
        headline={portfolioInfo.personaName}
        subheadline={portfolioInfo.roleTitle}
        fontPair={currentFontPair}
        initialMode={themeSettings.heroAnimation}
        onOpenResume={openResume}
        realName={portfolioInfo.realName}
      />

      {/* 3. Section 2: About Me (Resume Details) */}
      <AboutSection
        info={portfolioInfo}
        fontPair={currentFontPair}
        onOpenResume={openResume}
      />

      {/* 4. Section 3: Project Portfolio (The 'Live Card' Gallery) */}
      <ProjectPortfolio
        projects={collections.projects}
        fontPair={currentFontPair}
      />

      {/* 5. Section 4: Advertising Portfolio (Responsive Screenshots/Text) */}
      <AdvertisingPortfolio
        campaigns={collections.ad_campaigns}
        fontPair={currentFontPair}
      />

      {/* 6. Section 5: Branding & Work Experience (Animated B&W Logos) */}
      <BrandingSection
        workExperience={collections.experience}
        fontPair={currentFontPair}
      />

      {/* 7. Section 6: Dynamic Contact Section */}
      <ContactSection
        fontPair={currentFontPair}
        onSubmitTicket={handleAddTicket}
        whatsappNumber={portfolioInfo.whatsapp}
        email={portfolioInfo.email}
        phone={portfolioInfo.phone}
      />

      {/* 8. Footer */}
      <footer className="py-12 px-6 border-t border-white/10 text-xs font-mono-code text-zinc-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-white font-bold">{portfolioInfo.personaName}</span>
            <span>·</span>
            <span>{portfolioInfo.realName}</span>
            <span>·</span>
            <span>{t('footer.arch')}</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#home" className="hover:text-white transition-colors">
              {t('footer.top')}
            </a>
            <span>·</span>
            <button
              onClick={openResume}
              className="hover:text-white transition-colors cursor-pointer"
            >
              {t('footer.cv')}
            </button>
          </div>
        </div>
      </footer>

      {/* 9. Section 7: Small Floating Social/Contact Buttons */}
      <FloatingContactButtons
        whatsappNumber={portfolioInfo.whatsapp}
        email={portfolioInfo.email}
        phone={portfolioInfo.phone}
        linkedin={portfolioInfo.linkedin}
        instagram={portfolioInfo.instagram}
      />


      {/* 11. Fullscreen Printable Resume CV Modal */}
      <ResumeModal
        isOpen={resumeModalOpen}
        onClose={() => setResumeModalOpen(false)}
        info={portfolioInfo}
        workExperience={collections.experience}
      />
    </div>
  );
}
