export type BackgroundTheme = 'true-black' | 'midnight-black' | 'custom';

export type HeroAnimationMode = 'grid' | 'waterfall' | 'circles';

export interface FontPairOption {
  id: string;
  name: string;
  headlineFont: string;
  headlineClass: string;
  bodyFont: string;
  bodyClass: string;
  description: string;
}

export interface ThemeSettings {
  backgroundMode: BackgroundTheme;
  customBg: string;
  customText: string;
  customAccent: string;
  fontPairId: string;
  heroAnimation: HeroAnimationMode;
}

export interface ProjectItem {
  id: string;
  title: string;
  client: string;
  category: string;
  role: string;
  shortDesc: string;
  fullDesc: string;
  heroImage: string;
  liveUrl: string;
  year: string;
  tags: string[];
  metrics: string;
}

export interface AdCampaignItem {
  id: string;
  title: string;
  clientBrand: string;
  platform: 'Meta Ads' | 'Google Ads' | 'Omnichannel' | 'SEO & SEM';
  metricHeadline: string;
  summary: string;
  hasScreenshot: boolean;
  screenshotImage?: string;
  achievements: string[];
  keyStats: {
    label: string;
    value: string;
  }[];
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  location: string;
  isCurrent?: boolean;
  summary: string;
  achievements: string[];
}

export interface TicketItem {
  id: string;
  clientName: string;
  clientEmail: string;
  message: string;
  service?: string;
  budget?: string;
  status: 'New' | 'In Review' | 'In Progress' | 'Resolved';
  date: string;
}

export interface PortfolioInfo {
  personaName: string;
  realName: string;
  roleTitle: string;
  location: string;
  email: string;
  phone: string;
  whatsapp: string;
  linkedin: string;
  githubPortfolioUrl: string;
  instagram?: string;
  resumeUrl?: string;
  aboutBio: string;
  skills: {
    category: string;
    items: string[];
  }[];
  education: {
    degree: string;
    institution: string;
    year: string;
  }[];
  certifications: string[];
}
