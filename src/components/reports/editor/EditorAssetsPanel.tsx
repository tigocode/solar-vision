'use client';

import React from 'react';
import { Database, LayoutModule, Map as MapIcon, TableProperties, ImageIcon, Type } from 'lucide-react';
import { EditorBlock } from '@/types/templates';

interface EditorAssetsPanelProps {
  onAddBlock: (type: EditorBlock['type']) => void;
}

const DraggableVar = ({ label, desc, onClick }: { label: string; desc: string, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="w-full text-left p-3 border border-slate-200 rounded-xl bg-white hover:border-primary hover:bg-primary/5 transition-all group shadow-sm"
  >
    <p className="font-mono text-[10px] font-black text-primary group-hover:text-primary/80">{label}</p>
    <p className="text-[9px] text-slate-500 mt-1 font-medium italic">{desc}</p>
  </button>
);

const DraggableModule = ({ icon, label, onClick }: { icon: React.ReactNode; label: string, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="w-full p-3 bg-white border border-slate-200 rounded-xl hover:border-amber-400 flex items-center space-x-3 transition-all shadow-sm group"
  >
    <div className="p-1.5 bg-slate-50 rounded-lg text-slate-500 group-hover:bg-amber-50 group-hover:text-amber-600 transition-colors">{icon}</div>
    <span className="text-xs font-bold text-slate-700 group-hover:text-amber-700">{label}</span>
  </button>
);

export default function EditorAssetsPanel({ onAddBlock }: EditorAssetsPanelProps) {
  return (
    <div className="w-72 bg-white border-r border-slate-200 flex flex-col z-10 shadow-lg animate-in slide-in-from-left duration-300">
      <div className="p-4 border-b border-slate-100 bg-slate-50/50">
        <h4 className="font-bold text-slate-800 text-sm italic">Painel de Ativos</h4>
        <p className="text-[10px] text-slate-500 mt-1 font-medium">Clique nos elementos para adicioná-los ao relatório.</p>
      </div>
      
      <div className="p-4 flex-1 overflow-y-auto space-y-6 scrollbar-thin scrollbar-thumb-slate-200">
        {/* Adição direta de texto */}
        <div>
          <h5 className="text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest flex items-center">
             Elementos Básicos
          </h5>
          <button 
            onClick={() => onAddBlock('text')}
            className="w-full p-3 border border-dashed border-slate-300 rounded-xl bg-slate-50 hover:border-primary hover:bg-primary/5 transition-all flex items-center space-x-3 group"
          >
            <div className="p-1.5 bg-white rounded-lg shadow-sm group-hover:text-primary transition-colors"><Type size={16} /></div>
            <span className="text-xs font-bold text-slate-700">Caixa de Texto</span>
          </button>
        </div>

        <div>
          <h5 className="text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest flex items-center">
            <Database size={12} className="mr-1.5" /> Variáveis Dinâmicas
          </h5>
          <div className="space-y-2">
            <DraggableVar label="{{Nome_Usina}}" desc="Nome da Planta" onClick={() => onAddBlock('text')} />
            <DraggableVar label="{{Capacidade_MWp}}" desc="Potência instalada" onClick={() => onAddBlock('text')} />
            <DraggableVar label="{{Total_Anomalias}}" desc="Contagem de falhas" onClick={() => onAddBlock('text')} />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <h5 className="text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest flex items-center">
             Módulos Analíticos
          </h5>
          <div className="space-y-2">
            <DraggableModule icon={<MapIcon size={16} />} label="Mapa Térmico" onClick={() => onAddBlock('thermal_map')} />
            <DraggableModule icon={<TableProperties size={16} />} label="Tabela de Falhas" onClick={() => onAddBlock('table')} />
            <DraggableModule icon={<ImageIcon size={16} />} label="Lobby Cliente" onClick={() => onAddBlock('image')} />
          </div>
        </div>
      </div>
    </div>
  );
}
