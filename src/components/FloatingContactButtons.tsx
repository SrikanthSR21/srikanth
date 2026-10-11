import React from 'react';
import { MessageSquare, Instagram, Linkedin, Mail, Phone } from 'lucide-react';

interface FloatingContactButtonsProps {
  whatsappNumber: string;
  email: string;
  phone: string;
  linkedin: string;
  instagram?: string;
}

export const FloatingContactButtons: React.FC<FloatingContactButtonsProps> = ({
  whatsappNumber,
  email,
  phone,
  linkedin,
  instagram,
}) => {
  const abs = (u: string) => (/^https?:\/\//i.test(u) ? u : `https://${u}`);
  const cleanPhone = whatsappNumber.replace(/[^0-9]/g, '');

  const items = [
    {
      name: 'WhatsApp',
      icon: MessageSquare,
      href: `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
        'Hi, I would like to discuss a project with you.'
      )}`,
      label: 'WhatsApp Chat',
    },
    {
      name: 'Instagram',
      icon: Instagram,
      href: abs(instagram || 'instagram.com'),
      label: 'Instagram',
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      href: abs(linkedin),
      label: 'LinkedIn Profile',
    },
    {
      name: 'Mail',
      icon: Mail,
      href: `mailto:${email}`,
      label: 'Direct Email',
    },
    {
      name: 'Call',
      icon: Phone,
      href: `tel:${phone}`,
      label: 'Direct Call',
    },
  ];

  return (
    <aside
      aria-label="Quick contact links"
      className="fixed bottom-6 right-6 z-40 flex flex-col items-center gap-2.5"
    >
      <div className="flex flex-col items-center gap-2 p-1.5 rounded-full bg-black/80 backdrop-blur-md border border-white/20 shadow-2xl">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.name}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white text-black flex items-center justify-center hover:scale-115 hover:bg-zinc-200 transition-all duration-200 shadow-md"
              title={item.label}
              aria-label={item.label}
            >
              <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:rotate-6" />

              {/* Tooltip on left */}
              <span className="absolute right-12 px-2.5 py-1 text-[11px] font-mono-code whitespace-nowrap bg-zinc-950 text-white rounded-lg border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl">
                {item.label}
              </span>
            </a>
          );
        })}
      </div>
    </aside>
  );
};
