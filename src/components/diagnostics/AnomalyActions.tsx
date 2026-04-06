'use client';

import React, { useState } from 'react';
import { useUI } from '@/hooks/useUI';
import { AnomalyStatus } from '@/types/anomalies';
import { 
  Clock, 
  Search, 
  AlertTriangle, 
  CheckCircle, 
  Save,
  Check
} from 'lucide-react';

interface AnomalyActionsProps {
  status: AnomalyStatus;
  onStatusChange: (status: AnomalyStatus) => void;
  onCommentChange?: (comment: string) => void;
}

const statusOptions: { value: AnomalyStatus; label: string; icon: any; color: string; bg: string }[] = [
  { value: 'Pendente', label: 'Pendente', icon: Clock, color: 'text-slate-500', bg: 'bg-slate-50' },
  { value: 'Em Análise', label: 'Análise', icon: Search, color: 'text-blue-500', bg: 'bg-blue-50' },
  { value: 'Falso Positivo', label: 'Falso Pos.', icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50' },
  { value: 'Resolvido', label: 'Resolvido', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
];

const AnomalyActions: React.FC<AnomalyActionsProps> = ({ status, onStatusChange, onCommentChange }) => {
  const { viewMode } = useUI();
  const [comment, setComment] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Regra 3: Inivisível para clientes
  if (viewMode === 'client') return null;

  const handleSave = () => {
    setIsSaving(true);
    // Simulação de salvamento
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 8000);
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setComment(val);
    onCommentChange?.(val);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6 animate-in slide-in-from-right-4 duration-500">
      <div className="flex justify-between items-center">
        <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center">
          <Save size={14} className="mr-2 text-indigo-500" /> Ações e Decisão Técnica
        </h3>
        {showSuccess && (
          <div className="flex items-center text-green-600 text-[10px] font-black uppercase animate-in fade-in duration-300">
            <Check size={12} className="mr-1" /> Salvo com Sucesso
          </div>
        )}
      </div>

      {/* Grid de Status */}
      <div className="grid grid-cols-2 gap-2">
        {statusOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onStatusChange(opt.value)}
            className={`
              flex items-center p-3 rounded-xl border-2 transition-all duration-200
              ${status === opt.value 
                ? 'border-indigo-500 bg-indigo-50/30' 
                : 'border-transparent hover:bg-slate-50'}
            `}
          >
            <opt.icon size={16} className={`mr-2 ${opt.color}`} />
            <span className={`text-[10px] font-bold uppercase ${status === opt.value ? 'text-indigo-700' : 'text-slate-600'}`}>
              {opt.label}
            </span>
          </button>
        ))}
      </div>

      {/* Justificativa */}
      <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
          Justificativa / Comentário Técnico
        </label>
        <textarea
          value={comment}
          onChange={handleCommentChange}
          placeholder="Descreva o motivo da alteração de status..."
          className="w-full h-24 p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none"
        />
      </div>

      <button
        onClick={handleSave}
        disabled={isSaving}
        className={`
          w-full py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg
          ${isSaving 
            ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
            : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[0.98]'}
        `}
      >
        {isSaving ? 'Salvando Decisão...' : 'Registrar Decisão'}
      </button>

      <p className="text-[9px] text-center text-slate-400 font-medium italic">
        Ações logadas com carimbo de tempo padrão ISO-8601
      </p>
    </div>
  );
};

export default AnomalyActions;
