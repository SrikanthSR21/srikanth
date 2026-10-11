import React, { useState } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import { useContent } from '../../context/ContentContext';
import { PortfolioInfo } from '../../types';
import { RecordsEditor } from './RecordsEditor';
import { uploadImage } from './ImageUploader';

const inputCls = 'w-full px-2.5 py-1.5 text-xs bg-black border border-white/15 rounded-lg text-white focus:border-white/50 outline-none';
const uid = (p: string) => `${p}-${Math.random().toString(36).slice(2, 8)}`;

type TextKey = 'personaName' | 'realName' | 'roleTitle' | 'location' | 'email' | 'phone' | 'whatsapp' | 'instagram' | 'linkedin' | 'githubPortfolioUrl';
const FIELDS: { key: TextKey; label: string; hint?: string }[] = [
  { key: 'personaName', label: 'Hero heading / brand name', hint: 'Big heading + navbar brand' },
  { key: 'realName', label: 'Real name', hint: 'Shown when visitors toggle the name in the hero' },
  { key: 'roleTitle', label: 'Hero sub-text', hint: 'e.g. CREATIVE DEVELOPER / ADS STRATEGIST' },
  { key: 'location', label: 'Location' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
  { key: 'whatsapp', label: 'WhatsApp number', hint: 'With country code' },
  { key: 'instagram', label: 'Instagram link', hint: 'https://instagram.com/yourname' },
  { key: 'linkedin', label: 'LinkedIn link', hint: 'linkedin.com/in/yourname' },
  { key: 'githubPortfolioUrl', label: 'Other portfolio / GitHub link' },
];

export const ProfileAdmin: React.FC = () => {
  const { settings, saveSetting } = useContent();
  const info = settings.info;
  const [draft, setDraft] = useState<Record<string, string>>(() => ({
    ...Object.fromEntries(FIELDS.map((f) => [f.key, (info[f.key] as string) ?? ''])),
    aboutBio: info.aboutBio,
    certifications: info.certifications.join('\n'),
  }));
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);

  // Always merge onto the latest saved info so skills/education edits are never overwritten.
  const save = async (patch: Partial<PortfolioInfo>, okMsg = 'Saved ✓ — live on the public site') => {
    setMsg('Saving…');
    try { await saveSetting('info', { ...settings.info, ...patch }); setMsg(okMsg); }
    catch (e: any) { setMsg(e.message || 'Save failed'); }
  };

  const saveMain = () => save({
    ...(Object.fromEntries(FIELDS.map((f) => [f.key, draft[f.key]])) as Partial<PortfolioInfo>),
    aboutBio: draft.aboutBio,
    certifications: draft.certifications.split('\n').map((s) => s.trim()).filter(Boolean),
  });

  const uploadCv = async (f?: File) => {
    if (!f) return;
    setBusy(true);
    try { const url = await uploadImage(f, 'resume', 'cv'); await save({ resumeUrl: url }, 'CV uploaded ✓ — the Resume buttons now open this file'); }
    catch (e: any) { setMsg(e.message || 'Upload failed'); }
    finally { setBusy(false); }
  };

  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">Hero, contact & social links</h3>
          <button onClick={saveMain} className="px-3 py-1.5 text-xs font-bold bg-white text-black rounded-lg cursor-pointer">Save</button>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {FIELDS.map((f) => (
            <label key={f.key} className="grid gap-1">
              <span className="text-[10px] uppercase tracking-wider text-zinc-500">{f.label}</span>
              <input className={inputCls} value={draft[f.key]} onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value })} />
              {f.hint && <span className="text-[10px] text-zinc-600">{f.hint}</span>}
            </label>
          ))}
        </div>
        <label className="grid gap-1">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500">About bio</span>
          <textarea rows={6} className={inputCls} value={draft.aboutBio} onChange={(e) => setDraft({ ...draft, aboutBio: e.target.value })} />
        </label>
        <label className="grid gap-1">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500">Certifications (one per line)</span>
          <textarea rows={3} className={inputCls} value={draft.certifications} onChange={(e) => setDraft({ ...draft, certifications: e.target.value })} />
        </label>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-white">Resume / CV</h3>
        <p className="text-xs text-zinc-500">Upload a PDF, or paste a link. When set, every "Resume" and "Download CV" button opens it. Leave empty to use the built-in printable CV.</p>
        <div className="flex flex-wrap items-center gap-2">
          <input className={`${inputCls} flex-1 min-w-[240px]`} placeholder="https://… (PDF link)" value={info.resumeUrl ?? ''}
            onChange={(e) => saveSetting('info', { ...settings.info, resumeUrl: e.target.value }).catch((er) => setMsg(er.message))} />
          <label className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-zinc-200 border border-white/20 rounded-lg hover:border-white/50 cursor-pointer">
            {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />} Upload PDF
            <input type="file" accept="application/pdf" hidden onChange={(e) => uploadCv(e.target.files?.[0])} />
          </label>
          {info.resumeUrl && <a href={info.resumeUrl} target="_blank" rel="noreferrer" className="text-xs text-white underline">Preview</a>}
        </div>
      </section>

      <section>
        <RecordsEditor<{ id: string; category: string; items: string[] }>
          title="Skill groups"
          items={info.skills.map((s, i) => ({ id: `s${i}`, ...s }))}
          fields={[{ key: 'category', label: 'Category', type: 'text' }, { key: 'items', label: 'Skills (one per line)', type: 'lines' }]}
          titleKey="category"
          blank={() => ({ id: uid('s'), category: 'New category', items: [] })}
          onSave={(rows) => save({ skills: rows.map(({ id, ...r }) => r) })} />
      </section>

      <section>
        <RecordsEditor<{ id: string; degree: string; institution: string; year: string }>
          title="Education"
          items={info.education.map((e, i) => ({ id: `e${i}`, ...e }))}
          fields={[{ key: 'degree', label: 'Degree', type: 'text' }, { key: 'institution', label: 'Institution', type: 'text' }, { key: 'year', label: 'Year', type: 'text' }]}
          titleKey="degree"
          blank={() => ({ id: uid('e'), degree: '', institution: '', year: '' })}
          onSave={(rows) => save({ education: rows.map(({ id, ...r }) => r) })} />
      </section>

      {msg && <div className="text-xs text-zinc-300 font-mono-code">{msg}</div>}
    </div>
  );
};
