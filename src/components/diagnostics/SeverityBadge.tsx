import React from 'react';
import { Severity } from '@/types/anomalies';

interface SeverityBadgeProps {
  severity: Severity;
}

const SeverityBadge: React.FC<SeverityBadgeProps> = ({ severity }) => {
  const getStyles = () => {
    switch (severity) {
      case 'Crítico':
        return 'bg-[#ff4d4f] text-white';
      case 'Médio':
        return 'bg-[#fa8c16] text-white';
      case 'Baixo':
        return 'bg-[#fadb14] text-slate-800';
      default:
        return 'bg-slate-200 text-slate-600';
    }
  };

  return (
    <span className={`
      px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider 
      inline-flex items-center justify-center w-20 shadow-sm
      ${getStyles()}
    `}>
      {severity}
    </span>
  );
};

export default SeverityBadge;
