import React, { useRef, useState } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import { supabase, BUCKET } from '../../lib/supabase';

/** Resize to max 1800px and re-encode as WebP before upload (keeps the site fast). */
async function shrink(file: File, maxSide = 1800): Promise<Blob> {
  if (!file.type.startsWith('image/') || file.type === 'image/svg+xml' || file.type === 'image/gif') return file;
  const bmp = await createImageBitmap(file);
  const scale = Math.min(1, maxSide / Math.max(bmp.width, bmp.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bmp.width * scale);
  canvas.height = Math.round(bmp.height * scale);
  canvas.getContext('2d')!.drawImage(bmp, 0, 0, canvas.width, canvas.height);
  return new Promise((res) => canvas.toBlob((b) => res(b ?? file), 'image/webp', 0.88));
}

export async function uploadImage(file: Blob, folder: string, name = 'image'): Promise<string> {
  if (!supabase) throw new Error('Supabase is not configured');
  const clean = name.replace(/\.[^.]+$/, '').replace(/[^a-z0-9-_]/gi, '-').slice(0, 40);
  const ext = file.type === 'image/webp' ? 'webp' : (file.type.split('/')[1] || 'bin');
  const path = `${folder}/${Date.now()}-${clean}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    contentType: file.type, cacheControl: '31536000',
  });
  if (error) throw error;
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

interface Props { value: string; onChange: (url: string) => void; folder?: string }

export const ImageUploader: React.FC<Props> = ({ value, onChange, folder = 'misc' }) => {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const pick = async (f?: File) => {
    if (!f) return;
    setBusy(true); setErr('');
    try { onChange(await uploadImage(await shrink(f), folder, f.name)); }
    catch (e: any) { setErr(e.message || 'Upload failed'); }
    finally { setBusy(false); if (input.current) input.current.value = ''; }
  };

  return (
    <div className="flex items-center gap-3">
      <div className="w-16 h-16 rounded-lg border border-white/15 bg-zinc-900 overflow-hidden shrink-0">
        {value && <img src={value} alt="" className="w-full h-full object-cover" />}
      </div>
      <div className="flex-1 min-w-0 space-y-1.5">
        <input
          value={value} onChange={(e) => onChange(e.target.value)} placeholder="Image URL or upload →"
          className="w-full px-2.5 py-1.5 text-xs bg-black border border-white/15 rounded-lg text-white"
        />
        <button type="button" onClick={() => input.current?.click()} disabled={busy}
          className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] text-zinc-300 border border-white/15 rounded-lg hover:border-white/40 cursor-pointer">
          {busy ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
          {busy ? 'Uploading…' : 'Upload image'}
        </button>
        {err && <div className="text-[11px] text-red-400">{err}</div>}
      </div>
      <input ref={input} type="file" accept="image/*" hidden onChange={(e) => pick(e.target.files?.[0])} />
    </div>
  );
};
