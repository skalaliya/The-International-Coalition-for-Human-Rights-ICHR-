import React from 'react';
import { Facebook, Twitter, Linkedin, Instagram, MapPin, Phone, Mail, Heart, Users, Lock } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="container mx-auto px-4 lg:px-8">
        
        {/* Footer CTA */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-[#1F4E6F]/20 p-6 rounded-2xl border border-[#1F4E6F]/30 mb-12 gap-6">
          <div>
            <h3 className="text-white text-xl font-bold">Support our mission today</h3>
            <p className="text-slate-400 text-sm mt-1">Your contribution changes lives immediately.</p>
          </div>
          <div className="flex gap-4">
             <button 
               onClick={() => onNavigate('donate')}
               className="bg-rose-500 hover:bg-rose-600 text-white font-bold py-2 px-6 rounded-full text-sm flex items-center gap-2 transition-colors"
             >
              <Heart className="w-4 h-4 fill-current" />
              Donate
            </button>
             <button 
               onClick={() => onNavigate('volunteer')}
               className="bg-white/10 hover:bg-white/20 text-white font-bold py-2 px-6 rounded-full text-sm flex items-center gap-2 transition-colors border border-white/10"
             >
              <Users className="w-4 h-4" />
              Volunteer
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Column 1: Brand */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <img 
                src="/logo.png" 
                alt="The International Coalition for Human Rights (ICHR)" 
                className="h-10 w-auto object-contain bg-white rounded p-1"
              />
              <div className="flex flex-col">
                <span className="text-lg font-bold text-white leading-none">ICHR</span>
                <span className="text-xs font-semibold text-slate-400 tracking-widest uppercase">Intl. Coalition for Human Rights</span>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              The International Coalition for Human Rights (ICHR) is a non-profit organisation committed to protecting human dignity, 
              providing humanitarian aid, and ensuring justice for vulnerable communities worldwide.
            </p>
          </div>

          {/* Column 2: Contact */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6 border-b border-slate-700 pb-2 inline-block">Head Offices</h4>
            <ul className="space-y-6 text-sm">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 text-rose-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-slate-300">
                  <strong className="text-white block mb-1">Geneva (International HQ)</strong>
                  123 Humanitarian Avenue,<br />
                  Geneva, Switzerland 1202
                </span>
              </li>
              <li className="flex items-start">
                <MapPin className="w-5 h-5 text-rose-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-slate-300">
                  <strong className="text-white block mb-1">Paris (Administrative HQ)</strong>
                  25 Rue de la Paix,<br />
                  75002 Paris, France
                </span>
              </li>
              <li className="flex items-center border-t border-slate-800 pt-4">
                <Phone className="w-5 h-5 text-rose-500 mr-3 flex-shrink-0" />
                <span className="text-white font-medium">+33 7 68 85 10 66</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 text-rose-500 mr-3 flex-shrink-0" />
                <span className="text-white font-medium">ichr.geneva@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Causes */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6 border-b border-slate-700 pb-2 inline-block">Our Causes</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-rose-400 transition-colors">Social Support Systems</a></li>
              <li><a href="#" className="hover:text-rose-400 transition-colors">Education for All</a></li>
              <li><a href="#" className="hover:text-rose-400 transition-colors">Emergency Response</a></li>
              <li><a href="#" className="hover:text-rose-400 transition-colors">Human Rights Advocacy</a></li>
              <li><a href="#" className="hover:text-rose-400 transition-colors">Migrant Integration</a></li>
            </ul>
          </div>

          {/* Column 4: Links */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6 border-b border-slate-700 pb-2 inline-block">Other Pages</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('about'); }} className="hover:text-rose-400 transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('contact'); }} className="hover:text-rose-400 transition-colors">
                  Contact Us
                </a>
              </li>
              <li><a href="#" className="hover:text-rose-400 transition-colors">Careers</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); onNavigate('about'); }} className="hover:text-rose-400 transition-colors">Governance & Transparency</a></li>
              <li><a href="#" className="hover:text-rose-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-rose-400 transition-colors">Terms & Conditions</a></li>
              
              <li>
                <button onClick={(e) => { e.preventDefault(); onNavigate('admin'); }} className="hover:text-rose-400 transition-colors flex items-center gap-2 mt-4 pt-4 border-t border-slate-800 w-full">
                  <Lock className="w-3 h-3" /> Staff Login
                </button>
              </li>
              
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500 text-center md:text-left">
            © {new Date().getFullYear()} The International Coalition for Human Rights (ICHR). All Rights Reserved.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-[#1F4E6F] transition-colors text-white" aria-label="Facebook">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-pink-600 transition-colors text-white" aria-label="Instagram">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-sky-500 transition-colors text-white" aria-label="Twitter">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-[#1F4E6F] transition-colors text-white" aria-label="LinkedIn">
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};