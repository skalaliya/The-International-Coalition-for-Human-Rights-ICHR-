import React from 'react';
import { ChevronLeft, ChevronRight, Heart, Users } from 'lucide-react';

interface HeroProps {
  onNavigate: (page: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  return (
    <section className="relative w-full h-[600px] md:h-[700px] overflow-hidden bg-slate-900 group">
      <img 
        src="https://picsum.photos/id/238/1920/1080" 
        alt="Humanitarian Aid" 
        className="w-full h-full object-cover opacity-60 transition-transform duration-[10s] group-hover:scale-105"
      />
      
      {/* Gradient Overlay using #1F4E6F */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1F4E6F]/90 via-[#1F4E6F]/40 to-transparent"></div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        <div className="max-w-4xl space-y-6 animate-fade-in-up">
          <span className="inline-block py-1 px-3 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-sm font-semibold tracking-wider uppercase backdrop-blur-sm">
            Emergency Response Active
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight drop-shadow-lg">
            Protecting Human Dignity <br/> Across Borders
          </h1>
          <p className="text-lg md:text-xl text-slate-200 max-w-2xl mx-auto leading-relaxed">
            We provide immediate relief and long-term advocacy for communities affected by conflict and injustice worldwide.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <button 
              onClick={() => onNavigate('donate')}
              className="bg-rose-500 hover:bg-rose-600 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2 min-w-[200px]"
            >
              <Heart className="w-5 h-5 fill-current" />
              Donate Now
            </button>
            <button 
              onClick={() => onNavigate('volunteer')}
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#1F4E6F] font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2 min-w-[200px]"
            >
              <Users className="w-5 h-5" />
              Volunteer With Us
            </button>
          </div>
        </div>
      </div>

      {/* Slider Controls */}
      <div className="absolute top-1/2 left-4 md:left-8 -translate-y-1/2 hidden md:block">
        <button className="p-3 rounded-full bg-white/10 hover:bg-white/30 text-white backdrop-blur-sm transition-all border border-white/20">
          <ChevronLeft className="w-6 h-6" />
        </button>
      </div>
      <div className="absolute top-1/2 right-4 md:right-8 -translate-y-1/2 hidden md:block">
        <button className="p-3 rounded-full bg-white/10 hover:bg-white/30 text-white backdrop-blur-sm transition-all border border-white/20">
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </section>
  );
};