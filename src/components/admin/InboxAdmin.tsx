import React from 'react';
import { useContent } from '../../context/ContentContext';
import { TicketItem } from '../../types';

const STATUSES: TicketItem['status'][] = ['New', 'In Review', 'In Progress', 'Resolved'];

export const InboxAdmin: React.FC = () => {
  const { tickets, updateTicketStatus } = useContent();
  if (!tickets.length) return <p className="text-sm text-zinc-500">No messages yet. Contact-form submissions appear here.</p>;
  return (
    <div className="space-y-3">
      {tickets.map((t) => (
        <div key={t.id} className="p-4 rounded-xl border border-white/15 bg-zinc-950 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-sm text-white font-semibold">{t.clientName} <span className="text-zinc-500 font-normal">· {t.clientEmail}</span></div>
            <select value={t.status} onChange={(e) => updateTicketStatus(t.id, e.target.value as TicketItem['status'])}
              className="px-2 py-1 text-xs bg-black border border-white/20 rounded-lg text-white">
              {STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="text-[11px] text-zinc-500 font-mono-code">{t.id} · {t.date}{t.service ? ` · ${t.service}` : ''}{t.budget ? ` · ${t.budget}` : ''}</div>
          <p className="text-sm text-zinc-300 whitespace-pre-wrap">{t.message}</p>
        </div>
      ))}
    </div>
  );
};
