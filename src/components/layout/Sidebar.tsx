'use client';

import React from 'react';
import { 
  Activity, 
  Cpu, 
  PlusCircle, 
  UploadCloud, 
  FileText, 
  History, 
  Settings,
  Sun,
  X
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUI } from '@/hooks/useUI';
import { NavItem } from '@/types/navigation';

const Sidebar = () => {
  const pathname = usePathname();
  const { viewMode, toggleViewMode, isMenuOpen, setIsMenuOpen } = useUI();

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', hrefPath: '/dashboard', icon: <Activity size={18} />, category: 'overview' },
    { id: 'diagnostico', label: 'Diagnóstico Técnico', hrefPath: '/dashboard/diagnostico', icon: <Cpu size={18} />, category: 'overview' },
    { id: 'nova-inspecao', label: 'Nova Inspeção', hrefPath: '/dashboard/nova-inspecao', icon: <PlusCircle size={18} />, category: 'operational', roles: ['operator'] },
    { id: 'upload', label: 'Upload de Dados', hrefPath: '/dashboard/upload', icon: <UploadCloud size={18} />, category: 'operational', roles: ['operator'] },
    { id: 'relatorios', label: 'Relatórios (PDF/PPT)', hrefPath: '/dashboard/relatorios', icon: <FileText size={18} />, category: 'management' },
    { id: 'historico', label: 'Histórico', hrefPath: '/dashboard/historico', icon: <History size={18} />, category: 'management' },
    { id: 'configuracoes', label: 'Configurações', hrefPath: '/dashboard/configuracoes', icon: <Settings size={18} />, category: 'management' },
  ];

  const renderNavGroup = (category: string, title?: string) => {
    const items = navItems.filter(item => 
      item.category === category && 
      (!item.roles || item.roles.includes(viewMode))
    );

    if (items.length === 0) return null;

    return (
      <div className="mb-8">
        {title && <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3 ml-2">{title}</p>}
        <nav className="space-y-1">
          {items.map(item => {
            const isActive = pathname === item.hrefPath || (item.hrefPath !== '/dashboard' && pathname.startsWith(item.hrefPath || ''));
            return (
              <Link
                key={item.id}
                href={item.hrefPath || '/'}
                className={`
                  w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 group font-medium
                  ${isActive 
                    ? 'bg-amber-500/10 text-amber-500 shadow-sm border border-amber-500/20' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}
                `}
                onClick={() => setIsMenuOpen(false)}
              >
                <div className={`${isActive ? '' : 'group-hover:scale-110'} transition-transform opacity-80`}>
                  {item.icon}
                </div>
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    );
  };

  return (
    <>
      <aside className={`
        fixed lg:static inset-y-0 left-0 w-64 bg-slate-900 text-slate-300 
        flex flex-col shadow-2xl z-50 flex-shrink-0 transition-transform duration-300 ease-in-out
        ${isMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* LOGO & CLOSE BUTTON */}
        <div className="h-20 border-b border-slate-800/50 flex items-center justify-between px-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20 text-white">
              <Sun size={20} />
            </div>
            <span className="text-xl font-black text-white tracking-tight">
              Solar<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Vision</span>
            </span>
          </div>
          
          <button 
            onClick={() => setIsMenuOpen(false)}
            className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors"
            aria-label="Fechar menu"
          >
            <X size={20} />
          </button>
        </div>

      {/* NAVIGATION */}
      <div className="flex-1 py-6 overflow-y-auto px-4">
        {renderNavGroup('overview', 'Visão Geral')}
        {renderNavGroup('operational', "Operacional (Facilit'Air)")}
        {renderNavGroup('management', 'Gestão & Reporte')}
      </div>

      {/* FOOTER / TOGGLE */}
      <div className="p-6 border-t border-slate-800/50 bg-slate-900/50">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold text-slate-400">Visão Cliente</span>
          <button 
            onClick={toggleViewMode}
            className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${viewMode === 'client' ? 'bg-blue-500' : 'bg-slate-700'}`}
            aria-label="Alternar modo de visão"
          >
            <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-transform duration-300 ${viewMode === 'client' ? 'translate-x-5' : 'translate-x-1'}`}></div>
          </button>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
            <span className="text-xs font-bold text-slate-300">SV</span>
          </div>
          <div>
            <p className="text-xs font-semibold text-white">Solar Vision O&M</p>
            <p className="text-[10px] text-slate-500">{viewMode === 'operator' ? 'Administrador' : 'Visualização Externa'}</p>
          </div>
        </div>
      </div>
    </aside>
    </>
  );
};

export default Sidebar;
