import React, { useState, useEffect } from 'react';
import {
  BackgroundTheme,
  FontPairOption,
  ThemeSettings,
  PortfolioInfo,
  TicketItem,
} from './types';
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
import { AdminPanelModal } from './components/AdminPanelModal';
import { ResumeModal } from './components/ResumeModal';

export default function App() {
  // Theme Settings
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>(() => {
    const saved = localStorage.getItem('bw_portfolio_theme');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return {
      backgroundMode: 'true-black',
      customBg: '#000000',
      customText: '#ffffff',
      customAccent: '#ffffff',
      fontPairId: 'anton-jakarta',
      heroAnimation: 'grid',
    };
  });

  // Active Typography Pairing
  const [currentFontPair, setCurrentFontPair] = useState<FontPairOption>(() => {
    const match = FONT_PAIRS.find((f) => f.id === themeSettings.fontPairId);
    return match || FONT_PAIRS[0];
  });

  // Content now comes from the cloud database (with built-in fallbacks)
  const { settings, collections, tickets, addTicket, updateTicketStatus, saveSetting, t } = useContent();
  const portfolioInfo = settings.info;
  const setPortfolioInfo = (info: PortfolioInfo) => { saveSetting('info', info).catch((e) => alert(e.message)); };

  // Modals
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [resumeModalOpen, setResumeModalOpen] = useState(false);

  // Sync Theme to Root CSS Variables & LocalStorage
  useEffect(() => {
    const root = document.documentElement;
    let bg = '#000000';
    if (themeSettings.backgroundMode === 'midnight-black') {
      bg = '#0a0b0e';
    } else if (themeSettings.backgroundMode === 'custom') {
      bg = themeSettings.customBg || '#000000';
    }

    root.style.setProperty('--bg-color', bg);
    root.style.setProperty('--text-color', themeSettings.customText || '#ffffff');
    root.style.setProperty('--accent-btn', themeSettings.customAccent || '#ffffff');

    localStorage.setItem('bw_portfolio_theme', JSON.stringify(themeSettings));
  }, [themeSettings]);

  const handleThemeModeChange = (mode: BackgroundTheme) => {
    setThemeSettings((prev) => ({
      ...prev,
      backgroundMode: mode,
      customBg: mode === 'true-black' ? '#000000' : '#0a0b0e',
    }));
  };

  const handleFontPairChange = (fp: FontPairOption) => {
    setCurrentFontPair(fp);
    setThemeSettings((prev) => ({ ...prev, fontPairId: fp.id }));
  };

  const handleAddTicket = (newTicket: TicketItem) => { addTicket(newTicket); };
  const handleUpdateTicketStatus = (ticketId: string, newStatus: TicketItem['status']) => {
    updateTicketStatus(ticketId, newStatus);
  };

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
        currentTheme={themeSettings.backgroundMode}
        onThemeChange={handleThemeModeChange}
        currentFontPair={currentFontPair}
        onFontPairChange={handleFontPairChange}
        onOpenAdmin={() => setAdminModalOpen(true)}
        onOpenResume={() => setResumeModalOpen(true)}
        personaName={portfolioInfo.personaName}
      />

      {/* 2. Heroic Section */}
      <HeroSection
        headline={portfolioInfo.personaName}
        subheadline={portfolioInfo.roleTitle}
        fontPair={currentFontPair}
        initialMode={themeSettings.heroAnimation}
        onOpenResume={() => setResumeModalOpen(true)}
        realName={portfolioInfo.realName}
      />

      {/* 3. Section 2: About Me (Resume Details) */}
      <AboutSection
        info={portfolioInfo}
        fontPair={currentFontPair}
        onOpenResume={() => setResumeModalOpen(true)}
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
              onClick={() => setAdminModalOpen(true)}
              className="hover:text-white transition-colors cursor-pointer"
            >
              {t('footer.admin')}
            </button>
            <span>·</span>
            <button
              onClick={() => setResumeModalOpen(true)}
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
      />

      {/* 10. Section 8: Developer & Admin Dashboard Modal */}
      <AdminPanelModal
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
        tickets={tickets}
        onUpdateTicketStatus={handleUpdateTicketStatus}
        onAddTicket={handleAddTicket}
        info={portfolioInfo}
        onUpdateInfo={setPortfolioInfo}
        themeSettings={themeSettings}
        onUpdateTheme={(upd) => setThemeSettings((prev) => ({ ...prev, ...upd }))}
        fontPair={currentFontPair}
        onUpdateFontPair={handleFontPairChange}
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
