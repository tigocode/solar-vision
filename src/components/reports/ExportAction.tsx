'use client';

import React from 'react';
import { FileDown, ShieldCheck } from 'lucide-react';

interface ExportActionProps {
  onExportClick?: () => void;
}

const ExportAction: React.FC<ExportActionProps> = ({ onExportClick }) => {
  const handleExport = () => {
    if (onExportClick) {
      onExportClick();
    } else {
      alert('Motor de PDF Executivo em fase de homologação (Pós-Ciclo 7).');
    }
  };

  return (
    <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden relative group print:hidden">
      <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
        <ShieldCheck size={120} className="text-white" />
      </div>
      
      <div className="relative z-10 space-y-4">
        <div className="space-y-1">
          <h3 className="text-xl font-black text-white tracking-tight italic uppercase">Exportação Executiva</h3>
          <p className="text-slate-400 text-sm font-medium">Gere o snapshot oficial da usina com certificação IEC TS 62446-3.</p>
        </div>

        <button 
          onClick={handleExport}
          className="flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-[0.98] font-black uppercase text-xs tracking-widest group-hover:px-8"
        >
          <FileDown size={18} className="mr-3" />
          Gerar PDF Executivo
        </button>
      </div>
    </div>
  );
};

export default ExportAction;
