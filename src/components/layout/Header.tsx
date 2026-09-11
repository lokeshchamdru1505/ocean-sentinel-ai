import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  Search,
  ChevronDown,
  Shield,
  Menu,
  CheckCircle,
  LogOut,
} from 'lucide-react';

interface HeaderProps {
  onOpenMobileSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userProfile, notification, logout } = useApp();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Determine current page title & breadcrumb
  const path = location.pathname;
  let pageTitle = 'Dashboard';
  let breadcrumb = 'Dashboard';

  if (path.includes('/upload')) {
    pageTitle = 'Upload & Analyze';
    breadcrumb = 'Upload & Analyze';
  } else if (path.includes('/results')) {
    pageTitle = 'Analysis Results';
    breadcrumb = 'Results';
  } else if (path.includes('/history')) {
    pageTitle = 'Analysis History';
    breadcrumb = 'History';
  } else if (path.includes('/map')) {
    pageTitle = 'Anomaly Map';
    breadcrumb = 'Anomaly Map';
  } else if (path.includes('/reports')) {
    pageTitle = 'Reports';
    breadcrumb = 'Reports';
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/history?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-30 h-18 bg-[#04091a]/90 backdrop-blur-xl border-b border-cyan-500/20 px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left: Mobile hamburger + Page Title + Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="p-2 rounded-lg bg-slate-900 border border-cyan-500/30 text-cyan-400 lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
            <Link to="/dashboard" className="hover:text-cyan-400 transition-colors">
              Platform
            </Link>
            <span>/</span>
            <span className="text-cyan-300 font-semibold">{breadcrumb}</span>
          </div>
          <h1 className="text-base sm:text-lg font-bold text-white font-['Outfit'] tracking-tight">
            {pageTitle}
          </h1>
        </div>
      </div>

      {/* Center/Right: Search bar */}
      <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center flex-1 max-w-xs relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
        <input
          type="text"
          placeholder="Search analyses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-slate-900/90 border border-cyan-500/25 focus:border-cyan-400 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400"
        />
      </form>

      {/* Right Controls: Notifications & Demo Profile */}
      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg bg-slate-900/80 border border-white/10 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-400 relative transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl bg-[#081226] border border-cyan-500/30 shadow-2xl p-4 z-50 animate-fadeIn text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="font-bold text-white font-['Outfit']">System Notifications</span>
                <span className="text-[10px] font-mono text-cyan-400">Online</span>
              </div>
              <div className="mt-3 space-y-2.5">
                <div className="p-2.5 rounded-lg bg-cyan-950/40 border border-cyan-500/20 flex gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-white font-semibold block">Acoustic Engine Online</span>
                    <span className="text-[11px] text-slate-400">
                      Sonar inference pipeline active with adaptive Lee filtering and CLAHE.
                    </span>
                  </div>
                </div>
                {notification && (
                  <div className="p-2.5 rounded-lg bg-cyan-950/40 border border-cyan-500/20 flex gap-2.5">
                    <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span className="text-slate-300 text-[11px]">{notification}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Demo Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-lg bg-slate-900/80 border border-white/10 hover:border-cyan-500/40 transition-colors"
          >
            <div className="w-7 h-7 rounded-md bg-gradient-to-tr from-cyan-600 to-blue-700 flex items-center justify-center text-xs font-black text-white font-mono shadow-sm">
              {userProfile.avatarInitials}
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-white leading-tight">{userProfile.name}</span>
              <span className="text-[10px] text-cyan-400 leading-tight">{userProfile.role}</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Profile Dropdown Menu */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-72 rounded-xl bg-[#081226] border border-cyan-500/30 shadow-2xl p-4 z-50 animate-fadeIn text-xs space-y-3">
              <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                <div className="w-10 h-10 rounded-lg bg-cyan-600 flex items-center justify-center font-bold text-white font-mono text-sm">
                  {userProfile.avatarInitials}
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm leading-tight">{userProfile.name}</h4>
                  <span className="text-[11px] text-cyan-400 block">{userProfile.role}</span>
                  <span className="text-[10px] text-slate-400 block">{userProfile.institution}</span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-cyan-950/30 border border-cyan-500/20 text-[11px] space-y-1">
                <div className="flex items-center gap-1.5 text-cyan-300 font-semibold">
                  <Shield className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Access Role</span>
                </div>
                <p className="text-slate-300 text-[10px]">{userProfile.clearanceLevel}</p>
              </div>

              <div className="space-y-1 pt-1">
                <Link
                  to="/upload"
                  onClick={() => setShowProfileMenu(false)}
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors text-xs font-medium"
                >
                  <span>New Analysis</span>
                </Link>
                <Link
                  to="/reports"
                  onClick={() => setShowProfileMenu(false)}
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors text-xs font-medium"
                >
                  <span>Generated Reports</span>
                </Link>

                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    logout();
                    navigate('/login');
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 transition-colors text-xs font-medium border border-rose-500/20 mt-1"
                >
                  <span>Switch Account / Sign Out</span>
                  <LogOut className="w-3.5 h-3.5 text-rose-400" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
