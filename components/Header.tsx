import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

interface HeaderProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

/**
 * Institutional Header Component
 * Clean, minimal design appropriate for Geneva NGO standards
 */
export const Header: React.FC<HeaderProps> = ({ activePage, onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Core navigation - simplified, no dropdowns
  const navItems = [
    { label: 'Home', id: 'home' },
    { label: 'About', id: 'about' },
    { label: 'Locations', id: 'locations' },
    { label: 'Contact', id: 'contact' },
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setMobileMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
    window.scrollTo(0, 0);
  };

  return (
    <header
      className={`w-full z-50 transition-all duration-300 ${isScrolled
          ? 'fixed top-0 bg-white shadow-sm'
          : 'relative bg-white'
        }`}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* Logo - Single instance, properly sized */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 focus:outline-none"
          >
            <img
              src="/logo.png"
              alt="ICHR"
              className="h-8 md:h-10 w-auto"
            />
            <div className="hidden sm:block">
              <span className="text-lg font-semibold text-[#1a4a68] leading-none">
                ICHR
              </span>
            </div>
          </button>

          {/* Desktop Navigation - Clean, horizontal */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-sm font-medium transition-colors ${activePage === item.id
                    ? 'text-[#1a4a68]'
                    : 'text-slate-600 hover:text-[#1a4a68]'
                  }`}
              >
                {item.label}
              </button>
            ))}

            {/* CTA Button - Restrained */}
            <button
              onClick={() => handleNavClick('donate')}
              className="text-sm font-medium text-white bg-[#1a4a68] hover:bg-[#133549] px-5 py-2 rounded transition-colors"
            >
              Support Us
            </button>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 text-slate-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu - Clean, calm */}
      <div
        className={`lg:hidden fixed inset-x-0 top-16 bg-white border-t border-slate-100 shadow-lg transition-all duration-300 ${mobileMenuOpen
            ? 'opacity-100 visible'
            : 'opacity-0 invisible pointer-events-none'
          }`}
      >
        <nav className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-left py-3 px-4 rounded-lg text-base font-medium transition-colors ${activePage === item.id
                    ? 'text-[#1a4a68] bg-slate-50'
                    : 'text-slate-700 hover:bg-slate-50'
                  }`}
              >
                {item.label}
              </button>
            ))}

            <div className="pt-4 mt-4 border-t border-slate-100">
              <button
                onClick={() => handleNavClick('donate')}
                className="w-full text-center font-medium text-white bg-[#1a4a68] hover:bg-[#133549] py-3 rounded-lg transition-colors"
              >
                Support Us
              </button>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};