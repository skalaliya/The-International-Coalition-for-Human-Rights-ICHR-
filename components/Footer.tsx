import React from 'react';
import { MapPin, Mail, Phone } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

/**
 * Institutional Footer Component
 * Three-column layout, formal legal structure
 * Single logo instance, muted tones
 */
export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300">
      {/* Main Footer Content */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">

          {/* Column 1: Organisation */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <img
                src="/logo.png"
                alt="ICHR"
                className="h-10 w-auto brightness-0 invert opacity-90"
              />
              <span className="text-lg font-semibold text-white">ICHR</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400 mb-6">
              The International Coalition for Human Rights (ICHR) is a global
              non-governmental organisation dedicated to the protection of human
              dignity and the advancement of justice worldwide.
            </p>
          </div>

          {/* Column 2: Head Offices */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-6">
              Head Offices
            </h4>
            <div className="space-y-5 text-sm">
              <div className="flex gap-3">
                <MapPin className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-white font-medium mb-1">Geneva, Switzerland</div>
                  <div className="text-slate-400">International Headquarters</div>
                </div>
              </div>
              <div className="flex gap-3">
                <MapPin className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-white font-medium mb-1">Paris, France</div>
                  <div className="text-slate-400">Administrative Office</div>
                </div>
              </div>
            </div>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-6">
              Contact
            </h4>
            <div className="space-y-4 text-sm">
              <a
                href="mailto:ichr.geneva@gmail.com"
                className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 text-slate-500" />
                ichr.geneva@gmail.com
              </a>
              <a
                href="tel:+33768851066"
                className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4 text-slate-500" />
                +33 7 68 85 10 66
              </a>
            </div>

            {/* Quick Links */}
            <div className="mt-8 pt-6 border-t border-slate-800">
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                <button
                  onClick={() => onNavigate('about')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  About
                </button>
                <button
                  onClick={() => onNavigate('locations')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Locations
                </button>
                <button
                  onClick={() => onNavigate('contact')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Contact
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Legal Footer */}
      <div className="border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
            <p>
              © {currentYear} The International Coalition for Human Rights (ICHR). All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <span className="text-slate-600">Privacy Policy</span>
              <span className="text-slate-600">Terms of Use</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};