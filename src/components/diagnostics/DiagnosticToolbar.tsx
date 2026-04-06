'use client';

import React from 'react';
import { Search, X, Filter } from 'lucide-react';
import { AnomalyStatus, Severity } from '@/types/anomalies';

interface DiagnosticToolbarProps {
  searchQuery: string;
  onSearch: (query: string) => void;
  activeFilters: {
    severity: Severity[];
    status: AnomalyStatus[];
  };
  onFilterChange: (type: 'severity' | 'status', value: string) => void;
  onClear: () => void;
}

const severityOptions: Severity[] = ['Crítico', 'Médio', 'Baixo'];
const statusOptions: AnomalyStatus[] = ['Pendente', 'Em Análise', 'Falso Positivo', 'Resolvido'];

const DiagnosticToolbar: React.FC<DiagnosticToolbarProps> = ({
  searchQuery,
  onSearch,
  activeFilters,
  onFilterChange,
  onClear
}) => {
  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4 mb-6 animate-in slide-in-from-top-2 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* BUSCA */}
        <div className="relative flex-1 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
          <input
            type="text"
            placeholder="Buscar por ID ou falha..."
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all"
          />
        </div>

        {/* FILTROS E AÇÕES */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* SEVERIDADE TOGGLES */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl space-x-1">
            {severityOptions.map((sev) => {
              const isActive = activeFilters.severity.includes(sev);
              return (
                <button
                  key={sev}
                  onClick={() => onFilterChange('severity', sev)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                    isActive 
                      ? 'bg-indigo-600 text-white shadow-sm scale-105' 
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {sev}
                </button>
              );
            })}
          </div>

          {/* STATUS SELECT */}
          <div className="relative min-w-[140px]">
             <select
               value={activeFilters.status[0] || ''}
               onChange={(e) => onFilterChange('status', e.target.value)}
               className="w-full pl-3 pr-8 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
             >
               <option value="">Status: Todos</option>
               {statusOptions.map(st => (
                 <option key={st} value={st}>{st}</option>
               ))}
             </select>
             <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={12} />
          </div>

          {/* BOTÃO LIMPAR */}
          {(searchQuery || activeFilters.severity.length > 0 || activeFilters.status.length > 0) && (
            <button
              onClick={onClear}
              className="flex items-center px-3 py-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors text-[10px] font-black uppercase tracking-widest"
              title="Limpar todos os filtros"
            >
              <X size={14} className="mr-1" /> Limpar
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default DiagnosticToolbar;
