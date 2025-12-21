import React, { useState, useEffect } from 'react';
import { Mail, Phone, Menu, X, ChevronDown } from 'lucide-react';
import { NavItem } from '../types';

interface HeaderProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activePage, onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedMobileItems, setExpandedMobileItems] = useState<string[]>([]);

  // Define nav items with ids to map to navigation
  const navItems = [
    { label: 'Home', id: 'home', hasDropdown: false },
    { label: 'Who We Are', id: 'about', hasDropdown: false },
    {
      label: 'Videos',
      id: 'videos',
      hasDropdown: true,
      children: ['Latest Reports', 'Documentaries', 'Field Interviews']
    },
    {
      label: 'Blogs & News',
      id: 'news',
      hasDropdown: true,
      children: ['Press Releases', 'Field Blogs', 'Annual Reports']
    },
    { label: 'Locations', id: 'locations', hasDropdown: false },
    { label: 'Contact', id: 'contact', hasDropdown: false },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when screen resizes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNavClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    if (['home', 'about', 'locations', 'contact'].includes(id)) {
      onNavigate(id);
      setMobileMenuOpen(false);
      window.scrollTo(0, 0);
    }
  };

  const toggleMobileSubmenu = (id: string) => {
    setExpandedMobileItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <header className={`w-full z-50 transition-all duration-300 ${isScrolled ? 'fixed top-0 shadow-lg' : 'relative'}`}>
      {/* Top Bar - Primary Brand Color #1F4E6F */}
      <div className={`bg-[#1F4E6F] text-white transition-all duration-300 ${isScrolled ? 'h-0 overflow-hidden py-0' : 'h-auto py-2'}`}>
        <div className="container mx-auto px-4 lg:px-8 flex justify-between items-center text-sm font-medium">
          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <div key={item.label} className="relative group py-2">
                <a
                  href="#"
                  onClick={(e) => handleNavClick(e, item.id)}
                  className={`flex items-center transition-colors ${activePage === item.id ? 'text-rose-300 font-bold' : 'text-white hover:text-rose-300'}`}
                >
                  {item.label}
                  {item.hasDropdown && <ChevronDown className="w-4 h-4 ml-1 text-white" />}
                </a>

                {/* Desktop Dropdown */}
                {item.hasDropdown && (
                  <div className="absolute top-full left-0 w-48 bg-white text-slate-800 shadow-xl rounded-b-md opacity-0 invisible group-hover:visible group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-200 z-50 border-t-4 border-rose-500">
                    <div className="py-2">
                      {item.children?.map((child) => (
                        <a
                          key={child}
                          href="#"
                          className="block px-4 py-2 hover:bg-slate-50 hover:text-rose-600 transition-colors text-sm"
                        >
                          {child}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Mobile Toggle Placeholder */}
          <div className="lg:hidden"></div>

          {/* Right Side Info */}
          <div className="flex items-center space-x-2 ml-auto">
            <Mail className="w-4 h-4 text-white" />
            <a href="mailto:ichr.geneva@gmail.com" className="hover:underline text-white/90">ichr.geneva@gmail.com</a>
          </div>
        </div>
      </div>

      {/* Second Row - White Background */}
      <div className="bg-white border-b border-slate-100 py-4 relative z-50">
        <div className="container mx-auto px-4 lg:px-8 flex justify-between items-center">
          {/* Logo Section */}
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => onNavigate('home')}
          >
            <div className="w-10 h-10 md:w-12 md:h-12 bg-[#1F4E6F] rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 md:w-7 md:h-7">
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-[#1F4E6F] leading-none tracking-tight">ICHR</span>
              <span className="text-xs font-semibold text-slate-500 tracking-widest uppercase">Intl. Coalition for Human Rights</span>
            </div>
          </div>

          {/* Right Action Section */}
          <div className="hidden lg:flex items-center gap-8">
            <div className="text-right">
              <div className="text-xs text-slate-500 uppercase tracking-wide font-semibold">24/7 Crisis Response</div>
              <div className="text-lg font-bold text-slate-800">+33 7 68 85 10 66</div>
            </div>
            <button className="bg-rose-500 hover:bg-rose-600 text-white font-semibold py-3 px-8 rounded-full transition-transform hover:scale-105 shadow-md">
              Call Now
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-slate-800 p-2 hover:bg-slate-50 rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay with Smooth Transition */}
      <div
        className={`lg:hidden absolute top-full left-0 w-full bg-white shadow-2xl border-t border-slate-100 overflow-hidden transition-all duration-300 ease-in-out origin-top ${mobileMenuOpen
            ? 'opacity-100 max-h-[calc(100vh-80px)] visible'
            : 'opacity-0 max-h-0 invisible'
          }`}
      >
        <div className="flex flex-col p-4 pb-20 overflow-y-auto max-h-[calc(100vh-80px)]">
          {navItems.map((item) => (
            <div key={item.label} className="border-b border-slate-100 last:border-0">
              <button
                onClick={(e) => {
                  if (item.hasDropdown) {
                    e.preventDefault();
                    toggleMobileSubmenu(item.id);
                  } else {
                    handleNavClick(e, item.id);
                  }
                }}
                className={`w-full flex items-center justify-between py-4 px-2 text-lg font-semibold transition-colors ${activePage === item.id ? 'text-rose-500' : 'text-[#1F4E6F]'}`}
              >
                {item.label}
                {item.hasDropdown && (
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${expandedMobileItems.includes(item.id) ? 'rotate-180 text-rose-500' : ''}`}
                  />
                )}
              </button>

              {/* Mobile Submenu with transition */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${item.hasDropdown && expandedMobileItems.includes(item.id)
                    ? 'max-h-96 opacity-100 mb-2'
                    : 'max-h-0 opacity-0'
                  }`}
              >
                <div className="bg-slate-50 rounded-lg py-2 mx-2">
                  {item.children?.map((child) => (
                    <a
                      key={child}
                      href="#"
                      className="block px-6 py-3 text-slate-600 font-medium hover:text-rose-500 hover:bg-slate-100 transition-colors border-l-4 border-transparent hover:border-rose-500 text-base"
                    >
                      {child}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ))}

          <div className="mt-8 p-6 bg-[#1F4E6F]/5 rounded-xl text-center border border-[#1F4E6F]/10">
            <p className="text-sm text-slate-500 mb-2 font-medium">Need immediate assistance?</p>
            <a href="tel:+33768851066" className="block text-2xl font-bold text-[#1F4E6F] mb-6 hover:underline">+33 7 68 85 10 66</a>
            <button className="w-full bg-rose-500 active:bg-rose-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg transform active:scale-[0.98] transition-all">
              Call Now
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};