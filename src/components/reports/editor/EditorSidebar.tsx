'use client';

import React from 'react';
import { LayoutTemplate, Type, Database, Image as ImageIcon, TableProperties } from 'lucide-react';

interface ToolBtnProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

const ToolBtn = ({ icon, label, active }: ToolBtnProps) => (
  <button className={`w-16 h-16 flex flex-col items-center justify-center space-y-1 rounded-xl transition-all ${
    active 
      ? 'bg-slate-800 text-amber-400' 
      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
  }`}>
    {icon}
    <span className="text-[10px] font-bold uppercase tracking-tighter">{label}</span>
  </button>
);

export default function EditorSidebar() {
  return (
    <div className="w-20 bg-slate-900 flex flex-col items-center py-4 space-y-2 z-20 shadow-xl">
      <ToolBtn icon={<LayoutTemplate size={20} />} label="Design" active />
      <ToolBtn icon={<Type size={20} />} label="Texto" />
      <ToolBtn icon={<Database size={20} />} label="Variáveis" />
      <ToolBtn icon={<ImageIcon size={20} />} label="Imagens" />
      <ToolBtn icon={<TableProperties size={20} />} label="Tabelas" />
    </div>
  );
}
