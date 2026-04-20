'use client';

import React from 'react';
import { LayoutTemplate, Type, Database, Image as ImageIcon, TableProperties } from 'lucide-react';

export type EditorTab = 'design' | 'text' | 'variables' | 'images' | 'tables';

interface ToolBtnProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
  ariaLabel?: string;
}

const ToolBtn = ({ icon, label, active, onClick, ariaLabel }: ToolBtnProps) => (
  <button 
    onClick={onClick}
    aria-label={ariaLabel || label}
    className={`w-16 h-16 flex flex-col items-center justify-center space-y-1 rounded-xl transition-all ${
    active 
      ? 'bg-slate-800 text-amber-400' 
      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
  }`}>
    {icon}
    <span className="text-[10px] font-bold uppercase tracking-tighter">{label}</span>
  </button>
);

interface EditorSidebarProps {
  activeTab: EditorTab;
  onTabChange: (tab: EditorTab) => void;
}

export default function EditorSidebar({ activeTab, onTabChange }: EditorSidebarProps) {
  return (
    <div className="w-20 bg-slate-900 flex flex-col items-center py-4 space-y-2 z-20 shadow-xl">
      <ToolBtn 
        icon={<LayoutTemplate size={20} />} 
        label="Design" 
        active={activeTab === 'design'} 
        onClick={() => onTabChange('design')} 
      />
      <ToolBtn 
        icon={<Type size={20} />} 
        label="Texto" 
        active={activeTab === 'text'} 
        onClick={() => onTabChange('text')} 
      />
      <ToolBtn 
        icon={<Database size={20} />} 
        label="Variáveis" 
        ariaLabel="Variáveis"
        active={activeTab === 'variables'} 
        onClick={() => onTabChange('variables')} 
      />
      <ToolBtn 
        icon={<ImageIcon size={20} />} 
        label="Imagens" 
        active={activeTab === 'images'} 
        onClick={() => onTabChange('images')} 
      />
      <ToolBtn 
        icon={<TableProperties size={20} />} 
        label="Tabelas" 
        active={activeTab === 'tables'} 
        onClick={() => onTabChange('tables')} 
      />
    </div>
  );
}
