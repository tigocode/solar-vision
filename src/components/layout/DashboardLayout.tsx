'use client';

import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { UIProvider, useUI } from '@/hooks/useUI';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayoutContent: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { isMenuOpen, setIsMenuOpen } = useUI();

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-800">
      {/* SIDEBAR FIXA / MOBILE OVERLAY */}
      <Sidebar />

      {/* BACKDROP (Mobile) */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ÁREA DE CONTEÚDO PRINCIPAL */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* HEADER SUPERIOR */}
        <Header />

        {/* CORPO DA PÁGINA (SCROLLABLE) */}
        <main className="flex-1 overflow-y-auto p-8 max-w-[1600px] w-full mx-auto relative animate-in fade-in duration-500">
          {children}
        </main>
      </div>
    </div>
  );
};

const DashboardLayout: React.FC<DashboardLayoutProps> = (props) => {
  return (
    <UIProvider>
      <DashboardLayoutContent {...props} />
    </UIProvider>
  );
};

export default DashboardLayout;
