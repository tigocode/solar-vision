'use client';

import React from 'react';
import { Anomaly } from '@/types/anomalies';
import { useUI } from '@/hooks/useUI';
import SeverityBadge from './SeverityBadge';
import { Filter } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface AnomalyTableProps {
  anomalies: Anomaly[];
  selectedId?: string;
  onSelect?: (anomaly: Anomaly) => void;
}

const AnomalyTable: React.FC<AnomalyTableProps> = ({ anomalies, selectedId }) => {
  const { viewMode } = useUI();
  const router = useRouter();
  const isOperator = viewMode === 'operator';

  const handleRowClick = (anomaly: Anomaly) => {
    router.push(`/dashboard/diagnostico/${anomaly.id}`);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col h-full overflow-hidden">
      {/* Título e Filtros */}
      <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <h3 className="text-sm font-bold text-slate-800">Lista de Anomalias</h3>
        <div className="flex items-center space-x-2">
          <button className="text-slate-400 hover:text-slate-600 transition-colors">
            <Filter size={16} />
          </button>
          <span className="text-xs font-medium text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">
            {anomalies.length}
          </span>
        </div>
      </div>

      {/* Tabela */}
      <div className="overflow-y-auto flex-1 min-h-[400px]">
        <table className="w-full text-left text-sm border-separate border-spacing-0">
          <thead className="bg-white sticky top-0 z-10 shadow-sm">
            <tr className="text-slate-500 text-[10px] uppercase tracking-wider font-bold">
              <th className="p-4 border-b border-slate-200">ID</th>
              {isOperator && (
                <th className="p-4 border-b border-slate-200">Coordenadas GPS</th>
              )}
              <th className="p-4 border-b border-slate-200 text-center">ΔT (°C)</th>
              <th className="p-4 border-b border-slate-200">Tipo de Falha</th>
              <th className="p-4 border-b border-slate-200 text-center">Severidade</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {anomalies.map((anomaly) => (
              <tr
                key={anomaly.id}
                onClick={() => handleRowClick(anomaly)}
                className={`
                  cursor-pointer transition-all duration-200
                  ${selectedId === anomaly.id 
                    ? 'bg-amber-50/70 border-l-4 border-l-amber-500' 
                    : 'hover:bg-slate-50 border-l-4 border-l-transparent'}
                `}
              >
                <td className="p-4 font-bold text-slate-700">{anomaly.id}</td>
                
                {isOperator && (
                  <td className="p-4 text-slate-500 font-mono text-[10px]">
                    {anomaly.coordinates 
                      ? `${anomaly.coordinates.lat.toFixed(4)}, ${anomaly.coordinates.lng.toFixed(4)}`
                      : 'N/A'}
                  </td>
                )}

                <td className="p-4 text-center font-medium text-slate-600">
                  {anomaly.deltaT.toFixed(1)}°
                </td>

                <td className="p-4">
                  <div className="flex flex-col">
                    <span className="text-slate-700 text-xs font-semibold">{anomaly.type}</span>
                    {anomaly.type === 'Sombreamento' && anomaly.affectedArea && (
                      <span className="text-[10px] text-slate-400 mt-0.5">
                        {anomaly.affectedArea}% área afetada
                      </span>
                    )}
                  </div>
                </td>

                <td className="p-4 text-center">
                  <SeverityBadge severity={anomaly.severity} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AnomalyTable;
