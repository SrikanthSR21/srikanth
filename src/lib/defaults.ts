// Every string that used to be hard-coded in JSX now has a default here.
// The database overrides these; if the DB is empty/unreachable the site looks exactly as before.

export interface NavItem {
  id: string;
  label: string;
  href: string;            // "#about", "https://…", "/page"
  kind: 'link' | 'resume'; // "resume" opens the CV modal (the underlined "Resume (Download)" item)
  visible: boolean;
}
export interface HeroMetric { id: string; value: string; label: string }
export interface ClientLogo { id: string; name: string; symbol: string }
export interface SiteImages { profile: string }

export const DEFAULT_NAV: NavItem[] = [
  { id: 'n1', label: 'Home',        href: '#home',        kind: 'link',   visible: true },
  { id: 'n2', label: 'About',       href: '#about',       kind: 'link',   visible: true },
  { id: 'n3', label: 'Projects',    href: '#projects',    kind: 'link',   visible: true },
  { id: 'n4', label: 'Advertising', href: '#advertising', kind: 'link',   visible: true },
  { id: 'n5', label: 'Experience',  href: '#experience',  kind: 'link',   visible: true },
  { id: 'n6', label: 'Branding',    href: '#branding',    kind: 'link',   visible: true },
  { id: 'n7', label: 'Contact',     href: '#contact',     kind: 'link',   visible: true },
  { id: 'n8', label: 'Resume (Download)', href: '', kind: 'resume', visible: true },
];

export const DEFAULT_HERO_METRICS: HeroMetric[] = [
  { id: 'm1', value: '5,000+',   label: 'Giveaway Viral Followers' },
  { id: 'm2', value: '4.2x',     label: 'Blended Meta ROAS' },
  { id: 'm3', value: '4 Clients', label: 'Ranked #1 on Google' },
  { id: 'm4', value: '3 Brands', label: 'CyberBix In-House GTM' },
];

export const DEFAULT_IMAGES: SiteImages = { profile: '' }; // '' = use the bundled portrait

// Flat key → text map. Add a key here + use t('key') in a component and it appears in the admin automatically.
export const DEFAULT_TEXTS: Record<string, string> = {
  'seo.title': 'Morgan Maxwell | Creative Developer & Ads Strategist Portfolio',
  'seo.description': 'Portfolio featuring live project cards, advertising case studies, branding and direct WhatsApp routing.',

  'nav.type': 'Type',
  'nav.trueBlack': 'True Black',
  'nav.midnight': 'Midnight',
  'nav.admin': 'Admin',

  'hero.animLabel': 'Anim:',
  'hero.animGrid': 'Grid',
  'hero.animCode': 'Code',
  'hero.animPulse': 'Pulse',
  'hero.eyebrow': 'PORTFOLIO 2026',
  'hero.viewAsReal': 'View as: Srikanth SR',
  'hero.viewAsPersona': 'View as: Morgan Maxwell',
  'hero.ctaPrimary': 'EXPLORE MY WORK',
  'hero.ctaSecondary': 'DOWNLOAD FULL CV',
  'hero.scroll': 'Scroll',

  'about.eyebrow': '01 // BIOGRAPHY & EXECUTIVE PROFILE',
  'about.title': 'ABOUT ME',
  'projects.eyebrow': '02 // CURATED CLIENT & FRIEND PLATFORMS',
  'projects.title': 'PROJECT PORTFOLIO',
  'ads.eyebrow': '03 // PAID MEDIA, ROAS & SEARCH ENGINE AUDITS',
  'ads.title': 'ADVERTISING PORTFOLIO',
  'branding.eyebrow': '04 // BRANDING & PRODUCTION TIMELINE',
  'branding.title': 'BRANDING & WORK EXPERIENCE',
  'branding.brandsLabel': "BRANDS I'VE HANDLED",
  'branding.brandsMeta': '10+ VENTURES · MONOCHROME TICKER',
  'contact.eyebrow': '06 // DIRECT ROUTING & CLIENT INTAKE',
  'contact.title': "LET'S BUILD SOMETHING AMAZING",

  'footer.arch': '2026 ARCHITECTURE',
  'footer.top': 'BACK TO TOP',
  'footer.admin': 'ADMIN DASHBOARD',
  'footer.cv': 'VIEW CV',
};
