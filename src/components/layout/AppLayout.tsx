import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Footer } from './Footer';

export const AppLayout: React.FC = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#040816] flex flex-col font-['Inter']">
      {/* Sidebar Navigation */}
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area with offset for desktop sidebar */}
      <div className="flex-1 flex flex-col lg:pl-64 transition-all duration-300">
        {/* Global Operational Header */}
        <Header onOpenMobileSidebar={() => setMobileSidebarOpen(true)} />

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>

        {/* Persistent Footer */}
        <Footer />
      </div>
    </div>
  );
};
