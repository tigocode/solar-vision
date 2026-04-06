'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useBrand } from '@/contexts/BrandContext';
import { History, Search, MapPin, Activity, AlertTriangle, ShieldAlert, BadgeCheck, FileText } from 'lucide-react';
import Link from 'next/link';

interface HistoryRecord {
  id: string;
  date: string;
  unitName: string;
  healthScore: number;
  status: 'Concluída' | 'Em Processamento';
  criticalAnomalies: number;
  totalAnomalies: number;
}

// MOCKS GLOBAIS DE HISTÓRICO
const mockHistory: HistoryRecord[] = [
  {
    id: 'H-001',
    date: '15 de Março, 2026',
    unitName: 'UFV Alpha - Setor Norte',
    healthScore: 98.4,
    status: 'Concluída',
    criticalAnomalies: 2,
    totalAnomalies: 12
  },
  {
    id: 'H-002',
    date: '10 de Março, 2026',
    unitName: 'UFV Beta - Leste Central',
    healthScore: 71.5,
    status: 'Concluída',
    criticalAnomalies: 15,
    totalAnomalies: 45
  },
  {
    id: 'H-003',
    date: '05 de Março, 2026',
    unitName: 'UFV Gamma - Perímetro 1',
    healthScore: 42.0,
    status: 'Em Processamento',
    criticalAnomalies: 0,
    totalAnomalies: 0
  },
  {
    id: 'H-004',
    date: '28 de Fevereiro, 2026',
    unitName: 'UFV Alpha - Setor Sul',
    healthScore: 99.8,
    status: 'Concluída',
    criticalAnomalies: 0,
    totalAnomalies: 1
  }
];

export default function HistoricoPage() {
  const { brand } = useBrand();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Todas' | 'Concluída' | 'Em Processamento'>('Todas');

  // Lógica Reativa de Filtragem Combinada
  const filteredRecords = mockHistory.filter(record => {
    const matchSearch = record.unitName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'Todas' || record.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full space-y-8 animate-in fade-in duration-700 max-w-5xl mx-auto">
        
        {/* HEADER DA PÁGINA */}
        <div className="flex flex-col md:flex-row md:items-end justify-between space-y-4 md:space-y-0">
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center">
              <History className="mr-3 text-primary" size={32} />
              Histórico de Inspeções
            </h1>
            <p className="text-slate-500 font-medium italic">Rasterabilidade contínua de todo o portfólio da usina.</p>
          </div>
        </div>

        {/* BARRA DE FILTRAGEM COMPOSITA */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
          
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search size={18} className="text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar por unidade (ex: UFV Alpha)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
            />
          </div>

          <div className="w-full md:w-64">
             <select
               value={statusFilter}
               onChange={(e) => setStatusFilter(e.target.value as any)}
               className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium appearance-none cursor-pointer"
             >
               <option value="Todas">Status: Todas</option>
               <option value="Concluída">Status: Concluídas</option>
               <option value="Em Processamento">Status: Em Processamento</option>
             </select>
          </div>

        </div>

        {/* COMPONENTE MAKER DA TIMELINE */}
        <div className="pt-8">
          
          {filteredRecords.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-slate-100 border-dashed text-center animate-in zoom-in-95 duration-500">
               <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 text-slate-400">
                 <Search size={32} />
               </div>
               <h3 className="text-xl font-bold text-slate-700">Sem resultados!</h3>
               <p className="text-slate-500 mt-2">Nenhuma inspeção encontrada para este termo em '{statusFilter}'.</p>
               <button 
                 onClick={() => { setSearchTerm(''); setStatusFilter('Todas'); }}
                 className="mt-6 px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-colors text-sm uppercase tracking-wider"
               >
                 Limpar Filtros
               </button>
            </div>
          ) : (
            <div className="relative pl-8 md:pl-12 space-y-8 pb-12 before:absolute before:inset-0 before:ml-[5px] md:before:ml-[21px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-1 before:bg-gradient-to-b before:from-slate-200 before:to-transparent">
              
              {filteredRecords.map((record, index) => (
                <div key={record.id} className="relative flex items-center justify-center animate-in fade-in slide-in-from-bottom-8 duration-700" style={{ animationDelay: `${index * 150}ms`, fillMode: 'both' }}>
                  
                  {/* ANCORA DA TIMELINE (DOT CIRCULAR) */}
                  <div className="absolute left-[-31px] md:left-[-47px] mt-1.5 w-4 h-4 rounded-full border-4 border-white shadow-sm ring-2 ring-slate-200 bg-white"
                       style={{ backgroundColor: brand.primaryColor, borderColor: '#fff' }}
                  />

                  {/* CARD DA INSPEÇÃO */}
                  <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm w-full hover:shadow-lg transition-all hover:-translate-y-1 group">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                      
                      <div className="space-y-4 flex-1">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">{record.date}</p>
                          <h3 className="text-2xl font-black text-slate-800 flex items-center tracking-tight">
                            {record.unitName}
                          </h3>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                          <span className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 ${record.status === 'Concluída' ? 'bg-indigo-50 text-indigo-700' : 'bg-amber-50 text-amber-700'}`}>
                            {record.status === 'Concluída' ? <BadgeCheck size={14}/> : <Activity size={14} className="animate-pulse"/>}
                            {record.status}
                          </span>
                          
                          {record.status === 'Concluída' && (
                            <span className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 ${record.criticalAnomalies > 0 ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>
                              {record.criticalAnomalies > 0 ? <AlertTriangle size={14} /> : <ShieldAlert size={14} className="text-emerald-500" rotate={180}/>}
                              {record.criticalAnomalies > 0 ? `${record.criticalAnomalies} Falhas Críticas` : 'Nenhuma Falha Crítica, Zero Risco'}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* AREA DO SCORE E AÇÃO EXECUTIVA */}
                      <div className="flex flex-row md:flex-col items-center justify-between md:items-end gap-4 min-w-[160px] border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                         
                         {record.status === 'Concluída' ? (
                           <div className="text-center md:text-right">
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Índice Operacional</p>
                             <div className="flex items-baseline justify-center md:justify-end gap-1">
                                <span className={`text-3xl font-black tracking-tighter ${record.healthScore > 90 ? 'text-emerald-500' : record.healthScore > 70 ? 'text-amber-500' : 'text-red-500'}`}>
                                  {record.healthScore.toFixed(1)}
                                </span>
                                <span className="text-sm font-bold text-slate-400">%</span>
                             </div>
                             <p className="text-xs font-medium text-slate-500 mt-1">{record.totalAnomalies} Anomalias Totais</p>
                           </div>
                         ) : (
                           <div className="text-center md:text-right opacity-50">
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Processando Base</p>
                             <p className="text-xs font-medium italic text-slate-500">Métricas Indisponíveis</p>
                           </div>
                         )}

                         {record.status === 'Concluída' && (
                           <Link href="/dashboard/relatorios" className="w-full justify-center md:w-auto px-4 py-2 border-2 border-slate-200 hover:border-primary text-slate-600 hover:text-primary transition-colors rounded-xl text-xs font-bold uppercase tracking-widest flex items-center">
                             <FileText size={14} className="mr-2" />
                             Resumo
                           </Link>
                         )}

                      </div>

                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>

      </div>
    </DashboardLayout>
  );
}
