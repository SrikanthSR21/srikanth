import React, { useState } from 'react';
import { useContent } from '../../context/ContentContext';
import { RecordsEditor, Field } from './RecordsEditor';
import { ImageUploader } from './ImageUploader';
import { DEFAULT_TEXTS, ClientLogo, HeroMetric, NavItem } from '../../lib/defaults';
import { cloudifyCampaigns, cloudifyProjects, toCloud } from '../../lib/seed';
import profileFallback from '../../assets/images/profile_editorial_portrait_1791718263477.jpg';
import { AdCampaignItem, ExperienceItem, ProjectItem } from '../../types';

const uid = (p: string) => `${p}-${Math.random().toString(36).slice(2, 8)}`;
const inputCls = 'w-full px-2.5 py-1.5 text-xs bg-black border border-white/15 rounded-lg text-white';

const NAV_FIELDS: Field[] = [
  { key: 'label', label: 'Label', type: 'text' },
  { key: 'href', label: 'Link (#section, /page or https://…)', type: 'text' },
  { key: 'kind', label: 'Type', type: 'select', options: ['link', 'resume'] },
  { key: 'visible', label: 'Visible', type: 'bool' },
];
const METRIC_FIELDS: Field[] = [
  { key: 'value', label: 'Big number', type: 'text' },
  { key: 'label', label: 'Caption', type: 'text' },
];
const CLIENT_FIELDS: Field[] = [
  { key: 'name', label: 'Brand name', type: 'text' },
  { key: 'symbol', label: '2-letter monogram', type: 'text' },
];
const PROJECT_FIELDS: Field[] = [
  { key: 'title', label: 'Title', type: 'text' },
  { key: 'client', label: 'Client', type: 'text' },
  { key: 'category', label: 'Category', type: 'text' },
  { key: 'role', label: 'Your role', type: 'text' },
  { key: 'year', label: 'Year', type: 'text' },
  { key: 'shortDesc', label: 'Short description (card)', type: 'textarea' },
  { key: 'fullDesc', label: 'Full description (modal)', type: 'textarea' },
  { key: 'heroImage', label: 'Hero image', type: 'image', folder: 'projects' },
  { key: 'liveUrl', label: 'Live URL', type: 'text' },
  { key: 'tags', label: 'Tags (comma separated)', type: 'tags' },
  { key: 'metrics', label: 'Metrics line', type: 'text' },
];
const CAMPAIGN_FIELDS: Field[] = [
  { key: 'title', label: 'Title', type: 'text' },
  { key: 'clientBrand', label: 'Client / brand', type: 'text' },
  { key: 'platform', label: 'Platform', type: 'select', options: ['Meta Ads', 'Google Ads', 'Omnichannel', 'SEO & SEM'] },
  { key: 'metricHeadline', label: 'Headline metric', type: 'text' },
  { key: 'summary', label: 'Summary', type: 'textarea' },
  { key: 'hasScreenshot', label: 'Show screenshot', type: 'bool' },
  { key: 'screenshotImage', label: 'Screenshot', type: 'image', folder: 'advertising' },
  { key: 'achievements', label: 'Achievements (one per line)', type: 'lines' },
  { key: 'keyStats', label: 'Key stats', type: 'pairs' },
];
const EXPERIENCE_FIELDS: Field[] = [
  { key: 'role', label: 'Role', type: 'text' },
  { key: 'company', label: 'Company', type: 'text' },
  { key: 'period', label: 'Period', type: 'text' },
  { key: 'location', label: 'Location', type: 'text' },
  { key: 'isCurrent', label: 'Current job', type: 'bool' },
  { key: 'summary', label: 'Summary', type: 'textarea' },
  { key: 'achievements', label: 'Achievements (one per line)', type: 'lines' },
];

const TABS = ['Navigation', 'Texts', 'Hero stats', 'Projects', 'Advertising', 'Experience', 'Brands', 'Images', 'Setup'] as const;

export const ContentAdmin: React.FC = () => {
  const c = useContent();
  const [tab, setTab] = useState<(typeof TABS)[number]>('Navigation');
  const [texts, setTexts] = useState<Record<string, string>>(c.settings.texts);
  const [msg, setMsg] = useState('');

  const groups = Object.keys(DEFAULT_TEXTS).reduce<Record<string, string[]>>((acc, k) => {
    (acc[k.split('.')[0]] ||= []).push(k); return acc;
  }, {});

  const seed = async () => {
    if (!confirm('Copy ALL built-in content and images into your database? Existing database content will be overwritten.')) return;
    setMsg('Uploading images and saving… (≈ 20 s)');
    try {
      await c.saveCollection('projects', await cloudifyProjects(c.collections.projects));
      await c.saveCollection('ad_campaigns', await cloudifyCampaigns(c.collections.ad_campaigns));
      await c.saveCollection('experience', c.collections.experience);
      await c.saveSetting('info', c.settings.info);
      await c.saveSetting('nav', c.settings.nav);
      await c.saveSetting('texts', c.settings.texts);
      await c.saveSetting('hero_metrics', c.settings.hero_metrics);
      await c.saveSetting('clients', c.settings.clients);
      const profile = await toCloud(c.settings.images.profile || profileFallback, 'profile');
      await c.saveSetting('images', { ...c.settings.images, profile: profile || '' });
      setMsg('Done ✓ — everything is now stored in Supabase and editable.');
    } catch (e: any) { setMsg(`Failed: ${e.message}`); }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-1.5">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-2.5 py-1.5 text-xs rounded-lg border cursor-pointer ${tab === t ? 'bg-white text-black border-white font-semibold' : 'text-zinc-300 border-white/15 hover:border-white/40'}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'Navigation' && (
        <RecordsEditor<NavItem> title="Navigation bar" items={c.settings.nav} fields={NAV_FIELDS} titleKey="label"
          blank={() => ({ id: uid('n'), label: 'New link', href: '#', kind: 'link', visible: true })}
          onSave={(items) => c.saveSetting('nav', items)} />
      )}

      {tab === 'Texts' && (
        <div className="space-y-6">
          <button onClick={async () => { try { await c.saveSetting('texts', texts); setMsg('Texts saved ✓'); } catch (e: any) { setMsg(e.message); } }}
            className="px-3 py-1.5 text-xs font-bold bg-white text-black rounded-lg cursor-pointer">Save texts</button>
          {Object.entries(groups).map(([g, keys]) => (
            <div key={g} className="space-y-2">
              <div className="text-[10px] uppercase tracking-widest text-zinc-500">{g}</div>
              {keys.map((k) => (
                <label key={k} className="grid gap-1">
                  <span className="text-[11px] text-zinc-400 font-mono-code">{k}</span>
                  <input className={inputCls} value={texts[k] ?? ''} onChange={(e) => setTexts({ ...texts, [k]: e.target.value })} />
                </label>
              ))}
            </div>
          ))}
        </div>
      )}

      {tab === 'Hero stats' && (
        <RecordsEditor<HeroMetric> title="Hero metric bar" items={c.settings.hero_metrics} fields={METRIC_FIELDS} titleKey="value"
          blank={() => ({ id: uid('m'), value: '0', label: 'New metric' })}
          onSave={(items) => c.saveSetting('hero_metrics', items)} />
      )}
      {tab === 'Projects' && (
        <RecordsEditor<ProjectItem> title="Projects" items={c.collections.projects} fields={PROJECT_FIELDS} titleKey="title"
          blank={() => ({ id: uid('proj'), title: 'New project', client: '', category: '', role: '', shortDesc: '', fullDesc: '', heroImage: '', liveUrl: '', year: String(new Date().getFullYear()), tags: [], metrics: '' })}
          onSave={(items) => c.saveCollection('projects', items)} />
      )}
      {tab === 'Advertising' && (
        <RecordsEditor<AdCampaignItem> title="Ad campaigns" items={c.collections.ad_campaigns} fields={CAMPAIGN_FIELDS} titleKey="title"
          blank={() => ({ id: uid('ad'), title: 'New campaign', clientBrand: '', platform: 'Meta Ads', metricHeadline: '', summary: '', hasScreenshot: false, achievements: [], keyStats: [] })}
          onSave={(items) => c.saveCollection('ad_campaigns', items)} />
      )}
      {tab === 'Experience' && (
        <RecordsEditor<ExperienceItem> title="Work experience" items={c.collections.experience} fields={EXPERIENCE_FIELDS} titleKey="company"
          blank={() => ({ id: uid('exp'), role: '', company: 'New company', period: '', location: '', summary: '', achievements: [] })}
          onSave={(items) => c.saveCollection('experience', items)} />
      )}
      {tab === 'Brands' && (
        <RecordsEditor<ClientLogo> title="Brand ticker" items={c.settings.clients} fields={CLIENT_FIELDS} titleKey="name"
          blank={() => ({ id: uid('c'), name: 'NEW BRAND', symbol: 'NB' })}
          onSave={(items) => c.saveSetting('clients', items)} />
      )}

      {tab === 'Images' && (
        <div className="space-y-2">
          <div className="text-xs text-zinc-400">Profile portrait (About section)</div>
          <ImageUploader value={c.settings.images.profile} folder="profile"
            onChange={(url) => c.saveSetting('images', { ...c.settings.images, profile: url }).then(() => setMsg('Portrait updated ✓')).catch((e) => setMsg(e.message))} />
          <div className="text-[11px] text-zinc-500">Project, campaign and brand images are edited inside their own tabs.</div>
        </div>
      )}

      {tab === 'Setup' && (
        <div className="space-y-3 text-xs text-zinc-400">
          <p>First time only: copy all the built-in content and bundled images into Supabase so everything becomes editable.</p>
          <button onClick={seed} className="px-3 py-1.5 text-xs font-bold bg-white text-black rounded-lg cursor-pointer">Publish built-in content to database</button>
        </div>
      )}

      {msg && <div className="text-xs text-zinc-300 font-mono-code">{msg}</div>}
    </div>
  );
};
