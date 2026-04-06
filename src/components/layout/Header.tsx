'use client';

import React from 'react';
import { Search, Bell, ChevronRight, Menu } from 'lucide-react';
import { useUI } from '@/hooks/useUI';
import { usePathname } from 'next/navigation';

const Header = () => {
  const { viewMode, toggleMenu } = useUI();
  const pathname = usePathname();

  const getBreadcrumbs = () => {
    if (!pathname) return ['Dashboard'];
    
    const routeMap: Record<string, string> = {
      'dashboard': 'Dashboard',
      'configuracoes': 'Configurações',
      'historico': 'Histórico',
      'relatorios': 'Relatórios',
      'diagnostico': 'Diagnóstico Técnico',
      'plantas': 'Projetos',
      'novo': 'Novo Cadastro',
      'upload': 'Upload de Dados',
      'nova-inspecao': 'Nova Inspeção',
    };

    const segments = pathname.split('/').filter(Boolean);
    
    if (segments.length === 1 && segments[0] === 'dashboard') {
      return ['Dashboard'];
    }

    // Exclui o root 'dashboard' quando há sub-rotas para manter limpo
    const crumbs = [];
    for (let i = 1; i < segments.length; i++) {
      crumbs.push(routeMap[segments[i]] || segments[i]);
    }
    
    return crumbs.length > 0 ? crumbs : ['Dashboard'];
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="h-20 bg-white border-b border-slate-200 px-4 md:px-8 flex items-center justify-between flex-shrink-0 sticky top-0 z-40">
      {/* LEFT AREA: MENU + BREADCRUMBS */}
      <div className="flex items-center">
        <button 
          onClick={toggleMenu}
          className="lg:hidden p-2 mr-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="Abrir menu"
        >
          <Menu size={24} />
        </button>

        <div className="hidden sm:flex items-center text-sm font-medium text-slate-500">
          {breadcrumbs.map((crumb, idx) => (
             <React.Fragment key={idx}>
                {idx > 0 && <ChevronRight size={14} className="mx-2" />}
                <span className={idx === breadcrumbs.length - 1 ? "text-slate-800 font-bold" : "hover:text-slate-800 cursor-pointer"}>
                  {crumb}
                </span>
             </React.Fragment>
          ))}
        </div>
      </div>

      {/* TOP ACTIONS */}
      <div className="flex items-center space-x-6">
        {/* VIEW MODE INDICATOR */}
        <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center border ${
          viewMode === 'client' 
            ? 'bg-blue-50 text-blue-700 border-blue-200' 
            : 'bg-slate-100 text-slate-600 border-slate-200'
        }`}>
          {viewMode === 'client' ? 'A visualizar como Cliente' : 'Modo Operador'}
        </div>
        
        {/* ICONS */}
        <div className="flex space-x-4 text-slate-400">
          <button className="hover:text-slate-600 transition-colors" aria-label="Pesquisar">
            <Search size={20} />
          </button>
          <button className="hover:text-slate-600 transition-colors relative" aria-label="Notificações">
            <Bell size={20} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>
        </div>

        {/* USER PROFILE MOCK */}
        <div className="w-8 h-8 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-700 font-bold text-xs uppercase cursor-pointer hover:bg-amber-200 transition-all">
          JD
        </div>
      </div>
    </header>
  );
};

export default Header;
