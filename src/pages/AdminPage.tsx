import React, { useEffect, useState } from 'react';
import { ExternalLink, Key, Lock, LogOut } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import { AppearanceAdmin } from '../components/admin/AppearanceAdmin';
import { ContentAdmin } from '../components/admin/ContentAdmin';
import { ProfileAdmin } from '../components/admin/ProfileAdmin';
import { InboxAdmin } from '../components/admin/InboxAdmin';

const TABS = ['Appearance', 'Hero, Contact & Social', 'Site Content', 'Inbox'] as const;
type Tab = (typeof TABS)[number];

const LoginForm: React.FC = () => {
  const { signIn, backendConnected } = useContent();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError((await signIn(email.trim(), password)) ?? '');
    setBusy(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4 text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-zinc-900 border border-white/20 flex items-center justify-center">
          <Lock className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-2xl font-bold uppercase text-white">Admin</h1>
        <p className="text-xs text-zinc-400 font-mono-code">
          {backendConnected ? 'Sign in to manage your portfolio.' : 'Backend not configured: set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'}
        </p>
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" autoComplete="username"
          className="w-full px-4 py-3 rounded-xl bg-black border border-white/20 text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-white font-mono-code" />
        <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" autoComplete="current-password"
          className="w-full px-4 py-3 rounded-xl bg-black border border-white/20 text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-white font-mono-code" />
        {error && <div className="text-xs text-red-400 font-mono-code">{error}</div>}
        <button type="submit" disabled={busy || !backendConnected}
          className="w-full py-3 bg-white text-black text-xs font-bold uppercase rounded-xl hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50">
          <Key className="w-3.5 h-3.5" /> {busy ? 'Signing in…' : 'Sign in'}
        </button>
        <a href="/" className="block text-[11px] text-zinc-500 hover:text-white font-mono-code">← Back to site</a>
      </form>
    </div>
  );
};

export default function AdminPage() {
  const { session, signOut, ready, tickets } = useContent();
  const [tab, setTab] = useState<Tab>('Appearance');

  useEffect(() => {
    document.title = 'Admin';
    let meta = document.querySelector('meta[name="robots"]');
    if (!meta) { meta = document.createElement('meta'); meta.setAttribute('name', 'robots'); document.head.appendChild(meta); }
    meta.setAttribute('content', 'noindex,nofollow');
    document.documentElement.style.setProperty('--bg-color', '#000000');
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-jakarta">
      {!session ? (
        ready ? <LoginForm /> : <div className="min-h-screen flex items-center justify-center text-xs text-zinc-500 font-mono-code">Loading…</div>
      ) : (
        <>
          <header className="sticky top-0 z-30 backdrop-blur-md bg-black/85 border-b border-white/10">
            <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
              <span className="text-sm font-bold uppercase tracking-widest">Admin Dashboard</span>
              <div className="flex items-center gap-4 text-xs font-mono-code">
                <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-1 text-zinc-300 hover:text-white">View site <ExternalLink className="w-3 h-3" /></a>
                <button onClick={signOut} className="flex items-center gap-1 text-zinc-400 hover:text-white cursor-pointer"><LogOut className="w-3 h-3" /> Sign out</button>
              </div>
            </div>
            <div className="max-w-5xl mx-auto px-6 flex gap-2 overflow-x-auto">
              {TABS.map((t) => (
                <button key={t} onClick={() => setTab(t)}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-t-lg whitespace-nowrap cursor-pointer ${tab === t ? 'bg-zinc-900 text-white border-t border-x border-white/20' : 'text-zinc-400 hover:text-white'}`}>
                  {t === 'Inbox' ? `Inbox (${tickets.length})` : t}
                </button>
              ))}
            </div>
          </header>
          <main className="max-w-5xl mx-auto px-6 py-8">
            {tab === 'Appearance' && <AppearanceAdmin />}
            {tab === 'Hero, Contact & Social' && <ProfileAdmin />}
            {tab === 'Site Content' && <ContentAdmin />}
            {tab === 'Inbox' && <InboxAdmin />}
          </main>
        </>
      )}
    </div>
  );
}
