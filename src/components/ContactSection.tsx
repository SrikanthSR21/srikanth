import { useContent } from '../context/ContentContext';
import React, { useState } from 'react';
import { FontPairOption, TicketItem } from '../types';
import { Send, MessageSquare, CheckCircle, ArrowRight, Mail, Phone } from 'lucide-react';

interface ContactSectionProps {
  fontPair: FontPairOption;
  onSubmitTicket: (ticket: TicketItem) => void;
  whatsappNumber: string;
  email: string;
  phone: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  fontPair,
  onSubmitTicket,
  whatsappNumber,
  email,
  phone,
}) => {
  const { t } = useContent();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: 'Paid Advertising (Meta/Google Ads)',
    budget: '$2,500 - $5,000',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [lastTicket, setLastTicket] = useState<TicketItem | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) return;

    // 1. Create Ticket for Admin Panel
    const newTicket: TicketItem = {
      id: `TCK-${Math.floor(1000 + Math.random() * 9000)}`,
      clientName: formData.name,
      clientEmail: formData.email,
      service: formData.service,
      budget: formData.budget,
      message: formData.message,
      status: 'New',
      date: new Date().toISOString().split('T')[0],
    };

    onSubmitTicket(newTicket);
    setLastTicket(newTicket);
    setSubmitted(true);

    // 2. Pre-fill WhatsApp message strictly formatted as prompt specifies:
    // "New Portfolio Message: [Name] from [Email] says [Message]"
    const formattedWaText = encodeURIComponent(
      `New Portfolio Message: ${formData.name} from ${formData.email} says ${formData.message}`
    );
    const cleanPhone = whatsappNumber.replace(/[^0-9]/g, '');
    const waUrl = `https://wa.me/${cleanPhone}?text=${formattedWaText}`;

    // Open WhatsApp
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      service: 'Paid Advertising (Meta/Google Ads)',
      budget: '$2,500 - $5,000',
      message: '',
    });
    setSubmitted(false);
    setLastTicket(null);
  };

  return (
    <section id="contact" className="py-24 px-6 border-b border-white/10 relative">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="text-xs font-mono-code uppercase tracking-widest text-zinc-400 mb-2">
            {t('contact.eyebrow')}
          </div>
          <h2
            className={`text-4xl sm:text-5xl md:text-6xl font-black text-white uppercase tracking-tight mb-4 ${fontPair.headlineClass}`}
          >
            {t('contact.title')}
          </h2>
          <p className="text-sm font-mono-code text-zinc-400">
            Or reach out on social.
          </p>
        </div>

        {/* Dynamic Form Container */}
        <div className="p-8 sm:p-12 rounded-[24px] bg-black border border-white/20 shadow-2xl relative">
          {submitted && lastTicket ? (
            <div className="py-8 text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(255,255,255,0.4)]">
                <CheckCircle className="w-8 h-8" />
              </div>

              <div>
                <h3 className={`text-2xl sm:text-3xl font-bold text-white uppercase mb-2 ${fontPair.headlineClass}`}>
                  MESSAGE ROUTED SUCCESSFULLY
                </h3>
                <p className="text-sm text-zinc-300 max-w-md mx-auto">
                  Your inquiry has been registered in the Developer Admin Panel as{' '}
                  <span className="font-mono-code text-white font-bold">{lastTicket.id}</span> and
                  forwarded directly to WhatsApp.
                </p>
              </div>

              {/* Direct launcher fallback */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-white/15 max-w-md mx-auto text-left">
                <div className="text-xs font-mono-code text-zinc-400 uppercase mb-2">
                  Pre-filled WhatsApp Message:
                </div>
                <div className="text-xs font-mono-code text-zinc-200 p-2.5 bg-black rounded-lg border border-white/10 mb-4 break-words">
                  "New Portfolio Message: {lastTicket.clientName} from {lastTicket.clientEmail} says {lastTicket.message}"
                </div>

                <a
                  href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                    `New Portfolio Message: ${lastTicket.clientName} from ${lastTicket.clientEmail} says ${lastTicket.message}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 bg-white text-black text-xs font-bold uppercase rounded-xl flex items-center justify-center gap-2 hover:bg-zinc-200 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Open WhatsApp Directly</span>
                </a>
              </div>

              <button
                onClick={handleReset}
                className="text-xs font-mono-code text-zinc-400 hover:text-white underline underline-offset-4 cursor-pointer"
              >
                Send Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Field: Name */}
                <div className="space-y-2">
                  <label className="text-xs uppercase font-mono-code tracking-wider text-zinc-300 block">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Morgan Maxwell"
                    className="w-full px-4 py-3.5 rounded-xl bg-zinc-950 border border-white/20 text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-white transition-colors"
                  />
                </div>

                {/* Field: Email */}
                <div className="space-y-2">
                  <label className="text-xs uppercase font-mono-code tracking-wider text-zinc-300 block">
                    Your Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. hello@agency.com"
                    className="w-full px-4 py-3.5 rounded-xl bg-zinc-950 border border-white/20 text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-white transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Service Interest */}
                <div className="space-y-2">
                  <label className="text-xs uppercase font-mono-code tracking-wider text-zinc-300 block">
                    Service Focus
                  </label>
                  <select
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-xl bg-zinc-950 border border-white/20 text-white text-sm focus:outline-none focus:border-white transition-colors cursor-pointer"
                  >
                    <option value="Paid Advertising (Meta/Google Ads)">Paid Advertising (Meta/Google Ads)</option>
                    <option value="E-Commerce Storefront Architecture">E-Commerce Storefront Architecture</option>
                    <option value="International SEO & Local Ranking">International SEO & Local Ranking</option>
                    <option value="Viral Growth & Brand Identity">Viral Growth & Brand Identity</option>
                    <option value="Full-Stack Web Development">Full-Stack Web Development</option>
                  </select>
                </div>

                {/* Estimated Budget */}
                <div className="space-y-2">
                  <label className="text-xs uppercase font-mono-code tracking-wider text-zinc-300 block">
                    Project Scale / Budget
                  </label>
                  <select
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-xl bg-zinc-950 border border-white/20 text-white text-sm focus:outline-none focus:border-white transition-colors cursor-pointer"
                  >
                    <option value="$1,500 - $3,000">$1,500 - $3,000</option>
                    <option value="$3,000 - $6,000">$3,000 - $6,000</option>
                    <option value="$6,000 - $12,000+">$6,000 - $12,000+</option>
                    <option value="Monthly Retainer">Monthly Retainer</option>
                  </select>
                </div>
              </div>

              {/* Field: Message */}
              <div className="space-y-2">
                <label className="text-xs uppercase font-mono-code tracking-wider text-zinc-300 block">
                  Project Message *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell me about your campaign objectives, timeline, or storefront vision..."
                  className="w-full px-4 py-3.5 rounded-xl bg-zinc-950 border border-white/20 text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-white transition-colors resize-none"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-4 bg-white text-black text-sm font-bold uppercase tracking-wider rounded-xl hover:bg-zinc-200 hover:scale-[1.02] active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                  <Send className="w-4 h-4" />
                  <span>SEND MESSAGE</span>
                </button>

                <div className="text-[11px] font-mono-code text-zinc-500">
                  Instant routing to WhatsApp & Admin Inbox
                </div>
              </div>
            </form>
          )}

          {/* Direct channels below form */}
          <div className="mt-8 pt-8 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs font-mono-code text-zinc-400">
            <div className="flex items-center gap-4">
              <a href={`mailto:${email}`} className="hover:text-white transition-colors flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                <span>{email}</span>
              </a>
              <span aria-hidden="true">·</span>
              <a href={`tel:${phone}`} className="hover:text-white transition-colors flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" />
                <span>{phone}</span>
              </a>
            </div>
            <div className="text-zinc-500">
              Location: Kanyakumari, India (Open to UAE)
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
