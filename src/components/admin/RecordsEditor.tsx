import React, { useState } from 'react';
import { ArrowDown, ArrowUp, ChevronDown, Plus, Trash2 } from 'lucide-react';
import { ImageUploader } from './ImageUploader';

export type Field =
  | { key: string; label: string; type: 'text' | 'textarea' | 'bool' }
  | { key: string; label: string; type: 'image'; folder: string }
  | { key: string; label: string; type: 'select'; options: string[] }
  | { key: string; label: string; type: 'lines' }   // string[] — one per line
  | { key: string; label: string; type: 'tags' }    // string[] — comma separated
  | { key: string; label: string; type: 'pairs' };  // {label,value}[] — "label | value" per line

const inputCls = 'w-full px-2.5 py-1.5 text-xs bg-black border border-white/15 rounded-lg text-white focus:border-white/50 outline-none';

function FieldControl({ f, value, onChange }: { f: Field; value: any; onChange: (v: any) => void }) {
  switch (f.type) {
    case 'textarea':
      return <textarea rows={4} className={inputCls} value={value ?? ''} onChange={(e) => onChange(e.target.value)} />;
    case 'bool':
      return <input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} />;
    case 'image':
      return <ImageUploader value={value ?? ''} onChange={onChange} folder={f.folder} />;
    case 'select':
      return (
        <select className={inputCls} value={value ?? ''} onChange={(e) => onChange(e.target.value)}>
          {f.options.map((o) => <option key={o}>{o}</option>)}
        </select>
      );
    case 'lines':
      return <textarea rows={4} className={inputCls} value={(value ?? []).join('\n')}
        onChange={(e) => onChange(e.target.value.split('\n'))} />;
    case 'tags':
      return <input className={inputCls} value={(value ?? []).join(', ')}
        onChange={(e) => onChange(e.target.value.split(',').map((s) => s.trimStart()))} />;
    case 'pairs':
      return <textarea rows={3} className={inputCls} placeholder="Label | Value (one per line)"
        value={(value ?? []).map((p: any) => `${p.label} | ${p.value}`).join('\n')}
        onChange={(e) => onChange(e.target.value.split('\n').map((l) => {
          const [label, ...rest] = l.split('|'); return { label: label.trim(), value: rest.join('|').trim() };
        }))} />;
    default:
      return <input className={inputCls} value={value ?? ''} onChange={(e) => onChange(e.target.value)} />;
  }
}

/** Strip empty lines / blank tags right before saving */
const clean = (items: any[], fields: Field[]) => items.map((it) => {
  const o = { ...it };
  fields.forEach((f) => {
    if (f.type === 'lines' || f.type === 'tags') o[f.key] = (o[f.key] ?? []).map((s: string) => s.trim()).filter(Boolean);
    if (f.type === 'pairs') o[f.key] = (o[f.key] ?? []).filter((p: any) => p.label || p.value);
  });
  return o;
});

interface Props<T extends { id: string }> {
  title: string;
  items: T[];
  fields: Field[];
  titleKey: keyof T;
  blank: () => T;
  onSave: (items: T[]) => Promise<void>;
}

export function RecordsEditor<T extends { id: string }>({ title, items, fields, titleKey, blank, onSave }: Props<T>) {
  const [draft, setDraft] = useState<T[]>(items);
  const [open, setOpen] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | string>('idle');

  const patch = (i: number, k: string, v: any) => setDraft((d) => d.map((it, j) => (j === i ? { ...it, [k]: v } : it)));
  const move = (i: number, dir: -1 | 1) => setDraft((d) => {
    const n = [...d]; const j = i + dir; if (j < 0 || j >= n.length) return d;
    [n[i], n[j]] = [n[j], n[i]]; return n;
  });

  const save = async () => {
    setStatus('saving');
    try { await onSave(clean(draft, fields) as T[]); setStatus('saved'); setTimeout(() => setStatus('idle'), 2000); }
    catch (e: any) { setStatus(e.message || 'Save failed'); }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-wider text-white">{title} ({draft.length})</h3>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => { const b = blank(); setDraft((d) => [...d, b]); setOpen(b.id); }}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs border border-white/20 rounded-lg text-white hover:bg-white/10 cursor-pointer">
            <Plus className="w-3 h-3" /> Add
          </button>
          <button type="button" onClick={save} disabled={status === 'saving'}
            className="px-3 py-1.5 text-xs font-bold bg-white text-black rounded-lg hover:bg-zinc-200 cursor-pointer">
            {status === 'saving' ? 'Saving…' : status === 'saved' ? 'Saved ✓' : 'Save changes'}
          </button>
        </div>
      </div>
      {status !== 'idle' && !['saving', 'saved'].includes(status) && <div className="text-xs text-red-400">{status}</div>}

      {draft.map((it, i) => (
        <div key={it.id} className="border border-white/15 rounded-xl bg-zinc-950">
          <div className="flex items-center gap-2 px-3 py-2">
            <button type="button" className="flex-1 flex items-center gap-2 text-left text-xs text-white cursor-pointer"
              onClick={() => setOpen(open === it.id ? null : it.id)}>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open === it.id ? 'rotate-180' : ''}`} />
              <span className="truncate">{String(it[titleKey] || '(untitled)')}</span>
            </button>
            <button type="button" onClick={() => move(i, -1)} className="p-1 text-zinc-400 hover:text-white cursor-pointer"><ArrowUp className="w-3.5 h-3.5" /></button>
            <button type="button" onClick={() => move(i, 1)} className="p-1 text-zinc-400 hover:text-white cursor-pointer"><ArrowDown className="w-3.5 h-3.5" /></button>
            <button type="button" onClick={() => confirm('Delete this item?') && setDraft((d) => d.filter((_, j) => j !== i))}
              className="p-1 text-zinc-500 hover:text-red-400 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
          </div>
          {open === it.id && (
            <div className="px-3 pb-3 grid gap-3 border-t border-white/10 pt-3">
              {fields.map((f) => (
                <label key={f.key} className="grid gap-1">
                  <span className="text-[10px] uppercase tracking-wider text-zinc-500">{f.label}</span>
                  <FieldControl f={f} value={(it as any)[f.key]} onChange={(v) => patch(i, f.key, v)} />
                </label>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
