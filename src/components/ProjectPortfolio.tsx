import { useContent } from '../context/ContentContext';
import React, { useState } from 'react';
import { ProjectItem, FontPairOption } from '../types';
import { ArrowUpRight, ExternalLink, Globe, Smartphone, Monitor, X } from 'lucide-react';

interface ProjectPortfolioProps {
  projects: ProjectItem[];
  fontPair: FontPairOption;
}

export const ProjectPortfolio: React.FC<ProjectPortfolioProps> = ({
  projects,
  fontPair,
}) => {
  const { t } = useContent();
  const [activeModalProject, setActiveModalProject] = useState<ProjectItem | null>(null);
  const [deviceView, setDeviceView] = useState<'desktop' | 'mobile'>('desktop');

  return (
    <section id="projects" className="py-24 px-6 border-b border-white/10 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-16">
          <div>
            <div className="text-xs font-mono-code uppercase tracking-widest text-zinc-400 mb-2">
              {t('projects.eyebrow')}
            </div>
            <h2
              className={`text-3xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tight ${fontPair.headlineClass}`}
            >
              {t('projects.title')}
            </h2>
          </div>
          <div className="text-xs font-mono-code text-zinc-400 max-w-xs sm:text-right">
            LIVE CARD GALLERY · VIBRANT FULL-COLOR HERO PREVIEWS ON MATTE BLACK
          </div>
        </div>

        {/* Live Card Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group relative flex flex-col rounded-[20px] bg-black border border-white/15 overflow-hidden transition-all duration-500 hover:border-white hover:shadow-[0_0_35px_rgba(255,255,255,0.18)]"
            >
              {/* TOP 2/3 CONTAINER: High-Resolution Colorful Live Hero Preview */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-950 border-b border-white/10">
                {/* Browser simulation top bar */}
                <div className="absolute top-0 inset-x-0 h-7 bg-black/75 backdrop-blur-md z-10 px-3 flex items-center justify-between border-b border-white/10">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                  </div>
                  <div className="text-[10px] font-mono-code text-zinc-400 truncate max-w-[200px]">
                    https://{project.title.toLowerCase().replace(/\s+/g, '')}.live
                  </div>
                  <div className="text-[10px] text-zinc-500 font-mono-code">2026</div>
                </div>

                {/* Colorful Hero Image */}
                <img
                  src={project.heroImage}
                  alt={`${project.title} live website hero`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top pt-7 group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                {/* Category kicker on image */}
                <div className="absolute bottom-3 left-3 z-10">
                  <span className="text-[11px] font-mono-code px-2.5 py-1 bg-black/80 text-white rounded-lg border border-white/20 backdrop-blur-md">
                    {project.category}
                  </span>
                </div>
              </div>

              {/* BOTTOM 1/3 CONTAINER: Pure White Text on Black Background */}
              <div className="p-6 sm:p-7 flex flex-col justify-between flex-grow bg-black">
                <div>
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <h3
                      className={`text-xl sm:text-2xl font-bold text-white uppercase tracking-tight group-hover:text-zinc-100 transition-colors ${fontPair.headlineClass}`}
                    >
                      {project.title}
                    </h3>
                    <span className="text-xs font-mono-code text-zinc-500 tabular-nums">
                      {project.year}
                    </span>
                  </div>

                  <p className="text-zinc-300 text-sm leading-relaxed mb-4">
                    {project.shortDesc}
                  </p>

                  <div className="text-xs font-mono-code text-zinc-400 mb-5">
                    {project.metrics}
                  </div>
                </div>

                {/* Single VIEW SITE text link */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <button
                    onClick={() => setActiveModalProject(project)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-white uppercase tracking-wider group/link hover:underline hover:underline-offset-4 transition-all cursor-pointer"
                  >
                    <span>VIEW SITE</span>
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                  </button>

                  <span className="text-[11px] text-zinc-500 font-mono-code">
                    Client: {project.client}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Website Live Modal / Drawer */}
      {activeModalProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col bg-zinc-950 border border-white/20 rounded-[20px] shadow-2xl overflow-hidden">
            {/* Modal Header Bar */}
            <div className="px-6 py-4 bg-black border-b border-white/15 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-white" />
                <div>
                  <h4 className="text-sm font-bold text-white uppercase">
                    {activeModalProject.title}
                  </h4>
                  <div className="text-[11px] text-zinc-400 font-mono-code">
                    {activeModalProject.client} · {activeModalProject.role}
                  </div>
                </div>
              </div>

              {/* Viewport switcher */}
              <div className="hidden sm:flex items-center gap-1 p-1 bg-zinc-900 rounded-lg border border-white/10 text-xs">
                <button
                  onClick={() => setDeviceView('desktop')}
                  className={`px-2.5 py-1 rounded flex items-center gap-1.5 cursor-pointer ${
                    deviceView === 'desktop'
                      ? 'bg-white text-black font-semibold'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>Desktop</span>
                </button>
                <button
                  onClick={() => setDeviceView('mobile')}
                  className={`px-2.5 py-1 rounded flex items-center gap-1.5 cursor-pointer ${
                    deviceView === 'mobile'
                      ? 'bg-white text-black font-semibold'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Mobile</span>
                </button>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setActiveModalProject(null)}
                className="p-2 text-zinc-400 hover:text-white rounded-lg border border-white/10 hover:border-white/30 transition-colors cursor-pointer"
                title="Close Modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-grow space-y-6">
              {/* Simulated Device Frame with colorful hero image */}
              <div
                className={`mx-auto rounded-xl border border-white/15 overflow-hidden shadow-2xl bg-black transition-all ${
                  deviceView === 'desktop' ? 'w-full aspect-[16/9]' : 'w-72 aspect-[9/16]'
                }`}
              >
                <img
                  src={activeModalProject.heroImage}
                  alt={activeModalProject.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top"
                />
              </div>

              {/* Detailed Project Story */}
              <div className="p-6 bg-black rounded-xl border border-white/10">
                <div className="text-xs uppercase font-mono-code text-zinc-400 mb-1">
                  Architecture & Deliverables
                </div>
                <h5 className="text-lg font-bold text-white mb-3">
                  {activeModalProject.title} — Executive Case Study
                </h5>
                <p className="text-sm text-zinc-300 leading-relaxed mb-4">
                  {activeModalProject.fullDesc}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
                  <div className="text-xs font-mono-code text-white">
                    Impact: {activeModalProject.metrics}
                  </div>

                  <a
                    href={activeModalProject.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-black bg-white rounded-lg hover:bg-zinc-200 transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <span>Launch Live Site</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
