'use client';

import React from 'react';
import { Anomaly } from '@/types/anomalies';
import { AlertCircle, AlertTriangle, CheckCircle } from 'lucide-react';

interface ReportSummaryCardsProps {
  anomalies: Anomaly[];
}

const ReportSummaryCards: React.FC<ReportSummaryCardsProps> = ({ anomalies }) => {
  const filtered = anomalies.filter(a => a.status !== 'Pendente' && a.status !== 'Falso Positivo');
  
  const counts = {
    Crítico: filtered.filter(a => a.severity === 'Crítico').length,
    Médio: filtered.filter(a => a.severity === 'Médio').length,
    Baixo: filtered.filter(a => a.severity === 'Baixo').length,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-top-4 duration-500">
      {/* CARD CRÍTICO */}
      <div 
        data-testid="card-critico"
        className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4 transition-all hover:shadow-md"
      >
        <div className="p-3 bg-red-50 rounded-xl">
          <AlertCircle className="text-red-600" size={24} />
        </div>
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Anomalias Críticas</p>
          <p className="text-2xl font-black text-slate-800">{counts.Crítico}</p>
        </div>
      </div>

      {/* CARD MÉDIO */}
      <div 
        data-testid="card-medio"
        className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4 transition-all hover:shadow-md"
      >
        <div className="p-3 bg-amber-50 rounded-xl">
          <AlertTriangle className="text-amber-600" size={24} />
        </div>
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Severidade Média</p>
          <p className="text-2xl font-black text-slate-800">{counts.Médio}</p>
        </div>
      </div>

      {/* CARD BAIXO */}
      <div 
        data-testid="card-baixo"
        className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4 transition-all hover:shadow-md"
      >
        <div className="p-3 bg-green-50 rounded-xl">
          <CheckCircle className="text-green-600" size={24} />
        </div>
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Alertas Baixos</p>
          <p className="text-2xl font-black text-slate-800">{counts.Baixo}</p>
        </div>
      </div>
    </div>
  );
};

export default ReportSummaryCards;
