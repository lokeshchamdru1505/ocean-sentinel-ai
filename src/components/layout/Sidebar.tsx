import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Logo } from '../ui/Logo';
import {
  LayoutDashboard,
  UploadCloud,
  History,
  Map,
  FileSpreadsheet,
  Activity,
} from 'lucide-react';

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  mobileOpen = false,
  onCloseMobile,
}) => {
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Upload & Analyze', path: '/upload', icon: UploadCloud },
    { label: 'Analysis History', path: '/history', icon: History },
    { label: 'Anomaly Map', path: '/map', icon: Map },
    { label: 'Reports', path: '/reports', icon: FileSpreadsheet },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Main Sidebar Panel */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#050b1a] border-r border-cyan-500/20 flex flex-col transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-18 px-5 border-b border-cyan-500/20 flex items-center bg-slate-950/40">
          <Logo size="sm" showSubtitle={false} />
        </div>

        {/* Navigation Link Items */}
        <div className="flex-1 overflow-y-auto px-3 py-5 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === item.path ||
              (item.path !== '/' && location.pathname.startsWith(item.path));

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onCloseMobile}
                className={({ isActive: isLinkActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                    isLinkActive
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                  }`
                }
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Bottom System Status */}
        <div className="p-4 border-t border-cyan-500/20 bg-slate-950/60">
          <div className="p-2.5 rounded-lg bg-cyan-950/30 border border-cyan-500/20 text-[11px] font-mono space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                System Status:
              </span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Operational
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
