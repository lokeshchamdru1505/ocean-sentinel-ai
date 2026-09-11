import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../ui/Logo';
import { LayoutDashboard, ArrowRight, Menu, X, LogIn, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isLoggedIn, userProfile } = useApp();

  const navLinks = [
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'Features', href: '/#features' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-cyan-500/20 bg-[#04091a]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/">
          <Logo size="md" />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-slate-400 hover:text-cyan-300 transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Right Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/login"
            className="px-3.5 py-2 rounded-lg border border-cyan-500/30 bg-slate-900/60 hover:bg-cyan-950/40 text-cyan-300 hover:text-white text-xs font-semibold tracking-wide uppercase transition-all flex items-center gap-1.5"
          >
            {isLoggedIn ? <User className="w-4 h-4 text-cyan-400" /> : <LogIn className="w-4 h-4 text-cyan-400" />}
            <span>{isLoggedIn ? userProfile.avatarInitials : 'Log In'}</span>
          </Link>

          <Link
            to="/dashboard"
            className="px-3.5 py-2 rounded-lg border border-cyan-500/30 bg-transparent hover:bg-cyan-950/30 text-cyan-300 text-xs font-semibold tracking-wide uppercase transition-all flex items-center gap-1.5"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>

          <Link
            to="/upload"
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-black tracking-wide uppercase shadow-[0_0_18px_rgba(6,182,212,0.4)] transition-all flex items-center gap-1.5"
          >
            <span>Start Analysis</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-900 border border-cyan-500/30 text-cyan-400"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-cyan-500/20 bg-[#061026] px-4 py-5 space-y-4">
          <div className="space-y-2">
            {navLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm text-slate-300 hover:text-cyan-300 font-medium"
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="pt-4 border-t border-white/10 flex flex-col gap-2">
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 rounded-lg text-center bg-cyan-950/40 border border-cyan-500/40 text-cyan-300 text-xs font-bold uppercase tracking-wider"
            >
              Open Dashboard
            </Link>
            <Link
              to="/upload"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 rounded-lg text-center bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 text-xs font-black uppercase tracking-wider"
            >
              Start Analysis
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
