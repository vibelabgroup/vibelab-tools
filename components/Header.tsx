import React, { useState } from 'react';
import { NavItem } from '../types';
import { Link, useLocation } from 'react-router-dom';

interface HeaderProps {
  toggleTheme: () => void;
  isDark: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Directory', href: '/' },
  { label: 'News', href: '/news' },
  { label: 'Submit Tool', href: '/submit' },
  { label: 'About', href: '/about' },
];

export const Header: React.FC<HeaderProps> = ({ toggleTheme, isDark }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-slate-200 dark:border-brand-surface/50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-10 h-10 rounded-xl overflow-hidden relative flex items-center justify-center gradient-bg shadow-lg shadow-brand-primary/20">
            <span className="text-white font-bold font-display text-xl">V</span>
          </div>
          <span className="text-xl font-bold tracking-tight font-display text-slate-900 dark:text-white">
            VibeLab <span className="text-brand-primary">Tools</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex gap-8 text-sm font-medium text-slate-600 dark:text-slate-400">
          {NAV_ITEMS.map((item) => (
            <Link 
              key={item.label} 
              to={item.href} 
              className={`relative transition-colors py-2 group ${isActive(item.href) ? 'text-brand-primary dark:text-white' : 'hover:text-brand-primary dark:hover:text-white'}`}
            >
              {item.label}
              <span className={`absolute bottom-0 left-0 h-0.5 bg-brand-primary transition-all duration-300 ${isActive(item.href) ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-yellow-300 hover:bg-slate-300 dark:hover:bg-white/20 transition-all active:scale-95"
            title="Toggle Theme"
          >
            {isDark ? <i className="fa-solid fa-sun"></i> : <i className="fa-solid fa-moon"></i>}
          </button>
          
          <button className="hidden sm:flex gradient-bg hover:opacity-90 text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-all shadow-lg shadow-brand-primary/25 hover:shadow-brand-primary/40 hover:-translate-y-0.5 active:translate-y-0">
             Sign In
          </button>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden w-10 h-10 flex items-center justify-center text-slate-900 dark:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <i className={`fa-solid ${mobileMenuOpen ? 'fa-xmark' : 'fa-bars'} text-xl`}></i>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-20 left-0 right-0 glass-panel border-b border-white/10 p-6 flex flex-col gap-4 animate-fade-in-down">
          {NAV_ITEMS.map((item) => (
            <Link 
              key={item.label} 
              to={item.href}
              className={`font-medium py-3 border-b border-slate-200 dark:border-white/5 last:border-0 ${isActive(item.href) ? 'text-brand-primary' : 'text-slate-900 dark:text-white'}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <button className="w-full gradient-bg text-white py-3 rounded-lg font-bold mt-2">
            Sign In
          </button>
        </div>
      )}
    </nav>
  );
};