import React from 'react';

interface HeroProps {
  onNavigate?: (page: string) => void;
}

/**
 * Institutional Hero Component
 * Calm, confident, not promotional
 * Clear mandate statement with restrained CTA
 */
export const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  return (
    <section className="relative bg-[#1a4a68] text-white overflow-hidden">
      {/* Background Image - Subtle, not dominant */}
      <div className="absolute inset-0">
        <img
          src="/images/hero-advocacy.jpg"
          alt=""
          className="w-full h-full object-cover opacity-20"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a4a68]/80 to-[#1a4a68]" />
      </div>

      {/* Content */}
      <div className="relative max-w-4xl mx-auto px-6 py-24 md:py-32 text-center">
        {/* Org identifier - subtle */}
        <p className="text-sm font-medium text-white/60 uppercase tracking-wider mb-6">
          International Non-Governmental Organisation
        </p>

        {/* Main headline - authoritative, not promotional */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6">
          The International Coalition<br className="hidden md:block" /> for Human Rights
        </h1>

        {/* Mandate statement */}
        <p className="text-lg md:text-xl text-white/85 leading-relaxed max-w-2xl mx-auto mb-10">
          Coordinating civil society efforts, documenting violations, and providing
          humanitarian response to protect human dignity worldwide.
        </p>

        {/* Dual CTAs - restrained */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => onNavigate?.('about')}
            className="px-8 py-3 bg-white text-[#1a4a68] font-medium rounded hover:bg-slate-100 transition-colors"
          >
            Our Mandate
          </button>
          <button
            onClick={() => onNavigate?.('locations')}
            className="px-8 py-3 border border-white/40 text-white font-medium rounded hover:bg-white/10 transition-colors"
          >
            Global Presence
          </button>
        </div>
      </div>
    </section>
  );
};