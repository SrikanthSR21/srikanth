import React, { useState } from 'react';
import {
  TicketItem,
  PortfolioInfo,
  ThemeSettings,
  FontPairOption,
} from '../types';
import { FONT_PAIRS, GITHUB_DEPLOY_STATUS } from '../data/portfolioData';
import { useContent } from '../context/ContentContext';
import { ContentAdmin } from './admin/ContentAdmin';
import {
  X,
  Lock,
  Unlock,
  GitBranch,
  ExternalLink,
  Plus,
  Trash2,
  CheckCircle,
  Clock,
  Sliders,
  FileEdit,
  Palette,
  Layers,
  Key,
} from 'lucide-react';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  tickets: TicketItem[];
  onUpdateTicketStatus: (ticketId: string, newStatus: TicketItem['status']) => void;
  onAddTicket: (ticket: TicketItem) => void;
  info: PortfolioInfo;
  onUpdateInfo: (updated: PortfolioInfo) => void;
  themeSettings: ThemeSettings;
  onUpdateTheme: (updated: Partial<ThemeSettings>) => void;
  fontPair: FontPairOption;
  onUpdateFontPair: (fontPair: FontPairOption) => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  tickets,
  onUpdateTicketStatus,
  onAddTicket,
  info,
  onUpdateInfo,
  themeSettings,
  onUpdateTheme,
  fontPair,
  onUpdateFontPair,
}) => {
  const { session, signIn, signOut, backendConnected } = useContent();
  const isAuthenticated = !!session;
  const [emailInput, setEmailInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'tickets' | 'content' | 'editor' | 'theme' | 'github'>('content');

  // Local form state for editor
  const [editInfo, setEditInfo] = useState<PortfolioInfo>(info);
  const [saveToast, setSaveToast] = useState<boolean>(false);

  // New ticket quick form
  const [newClientName, setNewClientName] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');
  const [newIssue, setNewIssue] = useState('');

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = await signIn(emailInput.trim(), passwordInput);
    setPasswordError(err ?? '');
    if (!err) setPasswordInput('');
  };

  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateInfo(editInfo);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName || !newIssue) return;
    const ticket: TicketItem = {
      id: `TCK-${Math.floor(2000 + Math.random() * 8000)}`,
      clientName: newClientName,
      clientEmail: newClientEmail || 'client@enterprise.com',
      message: newIssue,
      status: 'New',
      date: new Date().toISOString().split('T')[0],
      service: 'Custom Request',
      budget: '$3,000'
    };
    onAddTicket(ticket);
    setNewClientName('');
    setNewClientEmail('');
    setNewIssue('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl max-h-[94vh] flex flex-col bg-zinc-950 border border-white/20 rounded-[24px] shadow-2xl overflow-hidden">
        {/* Top Developer Bar / Header */}
        <div className="px-6 py-4 bg-black border-b border-white/15 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span>DEVELOPER ADMIN DASHBOARD</span>
                {isAuthenticated && (
                  <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-white/10 text-zinc-300">
                    AUTHENTICATED
                  </span>
                )}
              </div>
              <div className="text-[11px] font-mono-code text-zinc-400">
                System Version 2026.4 · Black & White Core
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white rounded-lg border border-white/10 hover:border-white/30 transition-colors cursor-pointer"
            title="Close Dashboard"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Password Protection Guard */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center max-w-md mx-auto my-auto">
            <div className="w-16 h-16 rounded-full bg-zinc-900 border border-white/20 flex items-center justify-center mb-6">
              <Lock className="w-8 h-8 text-white" />
            </div>

            <h3 className="text-2xl font-bold text-white uppercase mb-2">
              RESTRICTED DEVELOPER ACCESS
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed mb-6 font-mono-code">
              Sign in to edit navigation, texts, projects, images and contact details.{!backendConnected && ' (Backend not configured: set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.)'}
            </p>

            <form onSubmit={handleLogin} className="w-full space-y-4">
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Admin email"
                autoComplete="username"
                className="w-full px-4 py-3 rounded-xl bg-black border border-white/20 text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-white font-mono-code"
              />
              <div className="relative">
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Password" autoComplete="current-password"
                  className="w-full px-4 py-3 rounded-xl bg-black border border-white/20 text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-white font-mono-code"
                />
              </div>

              {passwordError && (
                <div className="text-xs text-red-400 font-mono-code">{passwordError}</div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-white text-black text-xs font-bold uppercase rounded-xl hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Key className="w-3.5 h-3.5" />
                <span>Unlock Dashboard</span>
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Dashboard View */
          <div className="flex flex-col flex-grow overflow-hidden">
            {/* GitHub Project Status Bar (As specified in prompt Section 8) */}
            <div className="px-6 py-3.5 bg-zinc-950 border-b border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs font-mono-code">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-bold text-white uppercase tracking-wider">
                  STATUS: {GITHUB_DEPLOY_STATUS.statusText}
                </span>
                <span className="text-zinc-500">|</span>
                <span className="text-zinc-400 flex items-center gap-1">
                  <GitBranch className="w-3.5 h-3.5" />
                  <span>{GITHUB_DEPLOY_STATUS.branch}</span>
                  <span className="text-zinc-600">({GITHUB_DEPLOY_STATUS.lastCommitHash})</span>
                </span>
              </div>

              <div className="flex items-center gap-4 text-zinc-400">
                <span className="hidden md:inline text-zinc-500 truncate max-w-sm">
                  {GITHUB_DEPLOY_STATUS.commitMessage}
                </span>
                <a
                  href={`https://${GITHUB_DEPLOY_STATUS.repoName}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:underline flex items-center gap-1 font-bold"
                >
                  <span>Repository</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Dashboard Tabs Navigation */}
            <div className="px-6 pt-3 bg-black border-b border-white/10 flex gap-2 overflow-x-auto">
              <button
                onClick={() => setActiveTab('tickets')}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-t-lg transition-colors cursor-pointer ${
                  activeTab === 'tickets'
                    ? 'bg-zinc-900 text-white border-t border-x border-white/20'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Client Tickets ({tickets.length})
              </button>
              <button
                onClick={() => setActiveTab('content')}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-t-lg transition-colors cursor-pointer ${
                  activeTab === 'content'
                    ? 'bg-zinc-900 text-white border-t border-x border-white/20'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Site Content
              </button>
              <button
                onClick={() => setActiveTab('editor')}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-t-lg transition-colors cursor-pointer ${
                  activeTab === 'editor'
                    ? 'bg-zinc-900 text-white border-t border-x border-white/20'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Info Editor (About / Contact)
              </button>
              <button
                onClick={() => setActiveTab('theme')}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-t-lg transition-colors cursor-pointer ${
                  activeTab === 'theme'
                    ? 'bg-zinc-900 text-white border-t border-x border-white/20'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Theme & Color Control
              </button>
              <button
                onClick={() => setActiveTab('github')}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-t-lg transition-colors cursor-pointer ${
                  activeTab === 'github'
                    ? 'bg-zinc-900 text-white border-t border-x border-white/20'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                GitHub Architecture
              </button>
            </div>

            {/* Main Tabs Content */}
            <div className="p-6 overflow-y-auto flex-grow bg-zinc-950">
              {activeTab === 'content' && <ContentAdmin />}
              <div className="mb-4 flex justify-end">
                <button onClick={signOut} className="text-[11px] text-zinc-500 hover:text-white cursor-pointer font-mono-code">Sign out</button>
              </div>
              {/* TAB 1: TICKETS PANEL */}
              {activeTab === 'tickets' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="text-base font-bold text-white uppercase">
                        Current Inquiries & Client Issues
                      </h4>
                      <p className="text-xs text-zinc-400 font-mono-code mt-0.5">
                        Track submissions from website contact form and live contracts.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono-code text-zinc-500">
                        {tickets.filter((t) => t.status === 'Resolved').length} / {tickets.length} Resolved
                      </span>
                    </div>
                  </div>

                  {/* Tickets Minimalist B&W Table */}
                  <div className="rounded-xl border border-white/15 overflow-hidden bg-black">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs font-mono-code">
                        <thead className="bg-zinc-900 text-zinc-400 uppercase border-b border-white/15">
                          <tr>
                            <th className="py-3 px-4 font-semibold">ID</th>
                            <th className="py-3 px-4 font-semibold">Client</th>
                            <th className="py-3 px-4 font-semibold">Issue / Message</th>
                            <th className="py-3 px-4 font-semibold">Service & Budget</th>
                            <th className="py-3 px-4 font-semibold">Status</th>
                            <th className="py-3 px-4 font-semibold text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10 text-zinc-300">
                          {tickets.map((t) => (
                            <tr key={t.id} className="hover:bg-white/5 transition-colors">
                              <td className="py-3 px-4 font-bold text-white">{t.id}</td>
                              <td className="py-3 px-4">
                                <div className="text-white font-sans font-semibold">{t.clientName}</div>
                                <div className="text-[11px] text-zinc-500">{t.clientEmail}</div>
                              </td>
                              <td className="py-3 px-4 max-w-xs font-sans text-xs text-zinc-300">
                                {t.message}
                              </td>
                              <td className="py-3 px-4">
                                <div>{t.service || 'Inquiry'}</div>
                                <div className="text-[11px] text-zinc-500">{t.budget || '—'}</div>
                              </td>
                              <td className="py-3 px-4">
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                    t.status === 'Resolved'
                                      ? 'bg-white text-black'
                                      : t.status === 'In Progress'
                                      ? 'bg-zinc-700 text-white'
                                      : 'bg-white/15 text-zinc-200'
                                  }`}
                                >
                                  {t.status}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-right">
                                <button
                                  onClick={() =>
                                    onUpdateTicketStatus(
                                      t.id,
                                      t.status === 'Resolved' ? 'In Progress' : 'Resolved'
                                    )
                                  }
                                  className="px-2.5 py-1 text-[11px] font-sans font-semibold rounded border border-white/20 hover:bg-white hover:text-black transition-colors cursor-pointer"
                                >
                                  {t.status === 'Resolved' ? 'Reopen' : 'Mark Done'}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Add Quick Ticket Form */}
                  <div className="p-4 rounded-xl bg-black border border-white/10">
                    <div className="text-xs uppercase font-mono-code text-zinc-400 mb-3 font-semibold">
                      + Add New Client Ticket
                    </div>
                    <form onSubmit={handleCreateTicket} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <input
                        type="text"
                        placeholder="Client Name"
                        value={newClientName}
                        onChange={(e) => setNewClientName(e.target.value)}
                        className="px-3 py-2 bg-zinc-950 border border-white/20 rounded-lg text-xs text-white"
                      />
                      <input
                        type="email"
                        placeholder="Client Email"
                        value={newClientEmail}
                        onChange={(e) => setNewClientEmail(e.target.value)}
                        className="px-3 py-2 bg-zinc-950 border border-white/20 rounded-lg text-xs text-white"
                      />
                      <input
                        type="text"
                        placeholder="Project Requirement / Issue"
                        value={newIssue}
                        onChange={(e) => setNewIssue(e.target.value)}
                        className="px-3 py-2 bg-zinc-950 border border-white/20 rounded-lg text-xs text-white"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-white text-black text-xs font-bold uppercase rounded-lg hover:bg-zinc-200 cursor-pointer"
                      >
                        Create Ticket
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* TAB 2: INFO EDITOR */}
              {activeTab === 'editor' && (
                <form onSubmit={handleSaveInfo} className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-bold text-white uppercase">
                        Live Info & Resume Content Editor
                      </h4>
                      <p className="text-xs text-zinc-400 font-mono-code">
                        Modify biography, headline titles, and direct contact endpoints.
                      </p>
                    </div>

                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-white text-black text-xs font-bold uppercase rounded-xl hover:bg-zinc-200 transition-colors shadow-lg cursor-pointer"
                    >
                      Save Changes Live
                    </button>
                  </div>

                  {saveToast && (
                    <div className="p-3 bg-white text-black text-xs font-bold uppercase rounded-xl text-center animate-in fade-in">
                      Changes successfully saved to live portfolio state!
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-mono-code text-zinc-300 block mb-1">
                        Hero Persona Headline
                      </label>
                      <input
                        type="text"
                        value={editInfo.personaName}
                        onChange={(e) => setEditInfo({ ...editInfo, personaName: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-black border border-white/20 rounded-lg text-xs text-white font-mono-code"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-mono-code text-zinc-300 block mb-1">
                        Executive Legal Name
                      </label>
                      <input
                        type="text"
                        value={editInfo.realName}
                        onChange={(e) => setEditInfo({ ...editInfo, realName: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-black border border-white/20 rounded-lg text-xs text-white font-mono-code"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-mono-code text-zinc-300 block mb-1">
                        Role Title
                      </label>
                      <input
                        type="text"
                        value={editInfo.roleTitle}
                        onChange={(e) => setEditInfo({ ...editInfo, roleTitle: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-black border border-white/20 rounded-lg text-xs text-white font-mono-code"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-mono-code text-zinc-300 block mb-1">
                        WhatsApp Contact Number
                      </label>
                      <input
                        type="text"
                        value={editInfo.whatsapp}
                        onChange={(e) => setEditInfo({ ...editInfo, whatsapp: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-black border border-white/20 rounded-lg text-xs text-white font-mono-code"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-mono-code text-zinc-300 block mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={editInfo.email}
                        onChange={(e) => setEditInfo({ ...editInfo, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-black border border-white/20 rounded-lg text-xs text-white font-mono-code"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-mono-code text-zinc-300 block mb-1">
                        Phone Call Number
                      </label>
                      <input
                        type="text"
                        value={editInfo.phone}
                        onChange={(e) => setEditInfo({ ...editInfo, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-black border border-white/20 rounded-lg text-xs text-white font-mono-code"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-mono-code text-zinc-300 block mb-1">
                      About Executive Biography
                    </label>
                    <textarea
                      rows={4}
                      value={editInfo.aboutBio}
                      onChange={(e) => setEditInfo({ ...editInfo, aboutBio: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-black border border-white/20 rounded-lg text-xs text-white font-sans leading-relaxed"
                    />
                  </div>
                </form>
              )}

              {/* TAB 3: THEME CONTROL */}
              {activeTab === 'theme' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-base font-bold text-white uppercase">
                      Theme & Hex Color Control
                    </h4>
                    <p className="text-xs text-zinc-400 font-mono-code">
                      Customize background color codes, text values, and button accents.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {/* Background Color Picker */}
                    <div className="p-5 rounded-xl bg-black border border-white/15 space-y-3">
                      <label className="text-xs font-mono-code uppercase text-zinc-400 block font-semibold">
                        Background Canvas
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={themeSettings.customBg}
                          onChange={(e) => onUpdateTheme({ customBg: e.target.value, backgroundMode: 'custom' })}
                          className="w-10 h-10 rounded border border-white/30 cursor-pointer bg-transparent"
                        />
                        <input
                          type="text"
                          value={themeSettings.customBg}
                          onChange={(e) => onUpdateTheme({ customBg: e.target.value, backgroundMode: 'custom' })}
                          className="px-3 py-2 bg-zinc-950 border border-white/20 rounded-lg text-xs text-white font-mono-code flex-grow"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => onUpdateTheme({ customBg: '#000000', backgroundMode: 'true-black' })}
                          className="px-2.5 py-1 text-[10px] bg-zinc-900 border border-white/20 rounded text-zinc-300 hover:text-white"
                        >
                          True Black (#000)
                        </button>
                        <button
                          type="button"
                          onClick={() => onUpdateTheme({ customBg: '#0a0b0e', backgroundMode: 'midnight-black' })}
                          className="px-2.5 py-1 text-[10px] bg-zinc-900 border border-white/20 rounded text-zinc-300 hover:text-white"
                        >
                          Midnight (#0a0b0e)
                        </button>
                      </div>
                    </div>

                    {/* Main Text Color Picker */}
                    <div className="p-5 rounded-xl bg-black border border-white/15 space-y-3">
                      <label className="text-xs font-mono-code uppercase text-zinc-400 block font-semibold">
                        Main Typography Text
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={themeSettings.customText}
                          onChange={(e) => onUpdateTheme({ customText: e.target.value })}
                          className="w-10 h-10 rounded border border-white/30 cursor-pointer bg-transparent"
                        />
                        <input
                          type="text"
                          value={themeSettings.customText}
                          onChange={(e) => onUpdateTheme({ customText: e.target.value })}
                          className="px-3 py-2 bg-zinc-950 border border-white/20 rounded-lg text-xs text-white font-mono-code flex-grow"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => onUpdateTheme({ customText: '#ffffff' })}
                          className="px-2.5 py-1 text-[10px] bg-zinc-900 border border-white/20 rounded text-zinc-300 hover:text-white"
                        >
                          Pure White (#fff)
                        </button>
                        <button
                          type="button"
                          onClick={() => onUpdateTheme({ customText: '#f4f4f5' })}
                          className="px-2.5 py-1 text-[10px] bg-zinc-900 border border-white/20 rounded text-zinc-300 hover:text-white"
                        >
                          Zinc 100 (#f4f4f5)
                        </button>
                      </div>
                    </div>

                    {/* Button Accent Picker */}
                    <div className="p-5 rounded-xl bg-black border border-white/15 space-y-3">
                      <label className="text-xs font-mono-code uppercase text-zinc-400 block font-semibold">
                        Button & Border Accent
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={themeSettings.customAccent}
                          onChange={(e) => onUpdateTheme({ customAccent: e.target.value })}
                          className="w-10 h-10 rounded border border-white/30 cursor-pointer bg-transparent"
                        />
                        <input
                          type="text"
                          value={themeSettings.customAccent}
                          onChange={(e) => onUpdateTheme({ customAccent: e.target.value })}
                          className="px-3 py-2 bg-zinc-950 border border-white/20 rounded-lg text-xs text-white font-mono-code flex-grow"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => onUpdateTheme({ customAccent: '#ffffff' })}
                          className="px-2.5 py-1 text-[10px] bg-zinc-900 border border-white/20 rounded text-zinc-300 hover:text-white"
                        >
                          Solid White
                        </button>
                        <button
                          type="button"
                          onClick={() => onUpdateTheme({ customAccent: '#e4e4e7' })}
                          className="px-2.5 py-1 text-[10px] bg-zinc-900 border border-white/20 rounded text-zinc-300 hover:text-white"
                        >
                          Light Grey (#e4e4e7)
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Typography Font Pair Selection */}
                  <div className="p-5 rounded-xl bg-black border border-white/15">
                    <label className="text-xs font-mono-code uppercase text-zinc-400 block mb-3 font-semibold">
                      Active Typography Pairing
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {FONT_PAIRS.map((fp: FontPairOption) => (
                        <div
                          key={fp.id}
                          onClick={() => onUpdateFontPair(fp)}
                          className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                            fontPair.id === fp.id
                              ? 'bg-white text-black border-white'
                              : 'bg-zinc-950 text-white border-white/15 hover:border-white/30'
                          }`}
                        >
                          <div className="text-xs font-bold uppercase">{fp.name}</div>
                          <div
                            className={`text-[11px] font-mono-code mt-1 ${
                              fontPair.id === fp.id ? 'text-zinc-700' : 'text-zinc-400'
                            }`}
                          >
                            Headline: {fp.headlineFont} · Body: {fp.bodyFont}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: GITHUB DETAILS */}
              {activeTab === 'github' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-base font-bold text-white uppercase">
                      GitHub Deployment & Source Topology
                    </h4>
                    <p className="text-xs text-zinc-400 font-mono-code">
                      Real-time repository sync, verified build state and commit history.
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl bg-black border border-white/15 space-y-4">
                    <div className="flex items-center justify-between pb-4 border-b border-white/10">
                      <div>
                        <div className="text-xs text-zinc-400 font-mono-code uppercase">Repository</div>
                        <div className="text-sm font-bold text-white font-mono-code">
                          {GITHUB_DEPLOY_STATUS.repoName}
                        </div>
                      </div>
                      <a
                        href={GITHUB_DEPLOY_STATUS.deployedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-1.5 bg-white text-black text-xs font-bold uppercase rounded-lg hover:bg-zinc-200 transition-colors flex items-center gap-1.5"
                      >
                        <span>Visit Hosted URL</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono-code">
                      <div>
                        <div className="text-zinc-500 uppercase">Branch</div>
                        <div className="text-white font-bold">{GITHUB_DEPLOY_STATUS.branch}</div>
                      </div>
                      <div>
                        <div className="text-zinc-500 uppercase">Commit</div>
                        <div className="text-white font-bold">{GITHUB_DEPLOY_STATUS.lastCommitHash}</div>
                      </div>
                      <div>
                        <div className="text-zinc-500 uppercase">Build Health</div>
                        <div className="text-emerald-400 font-bold">{GITHUB_DEPLOY_STATUS.buildCheck}</div>
                      </div>
                      <div>
                        <div className="text-zinc-500 uppercase">Runtime</div>
                        <div className="text-white font-bold">React 19 + Vite</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
