'use client';

import React from 'react';
import { Anomaly } from '@/types/anomalies';
import SeverityBadge from '@/components/diagnostics/SeverityBadge';
import { FileText, MapPin, Calendar } from 'lucide-react';

interface ValidatedAnomaliesTableProps {
  anomalies: Anomaly[];
}

const ValidatedAnomaliesTable: React.FC<ValidatedAnomaliesTableProps> = ({ anomalies }) => {
  // Regra 10: Filtro de Ouro
  const validated = anomalies.filter(
    a => a.status !== 'Pendente' && a.status !== 'Falso Positivo'
  );

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden animate-in slide-in-from-bottom-4 duration-500 delay-100">
      <div className="px-6 py-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
        <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center">
          <FileText size={16} className="mr-2 text-indigo-500" /> Diagnósticos Validados (Regra 10)
        </h3>
        <span className="text-[10px] font-bold text-slate-400 uppercase bg-white px-2 py-1 rounded-md border border-slate-100">
          {validated.length} Registros Auditados
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-wider">Identificador</th>
              <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-wider">Tipo / Falha</th>
              <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-wider">Localização</th>
              <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-wider">Severidade</th>
              <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-wider">Data Modif.</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {validated.length > 0 ? (
              validated.map((anomaly) => (
                <tr key={anomaly.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-xs font-black text-slate-800 font-mono tracking-tighter">
                      {anomaly.id}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-700">{anomaly.type}</p>
                    {anomaly.type === 'Sombreamento' && anomaly.affectedArea && (
                      <span className="text-[9px] text-blue-500 font-bold uppercase tracking-tighter">
                        {anomaly.affectedArea}% de Área Afetada
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-xs text-slate-500 font-medium italic">
                      <MapPin size={10} className="mr-1 text-slate-300" />
                      {anomaly.location.route} • {anomaly.location.string}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <SeverityBadge severity={anomaly.severity} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-[10px] text-slate-400 font-mono underline decoration-slate-100 decoration-2 underline-offset-4">
                      <Calendar size={10} className="mr-1" />
                      {anomaly.updatedAt}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 inline-block">
                    <p className="text-sm text-slate-400 font-medium">Nenhum diagnóstico validado para este relatório.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ValidatedAnomaliesTable;
