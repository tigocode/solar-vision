'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useBrand } from '@/contexts/BrandContext';
import { UploadCloud, FileImage, ClipboardList, CheckCircle2, ChevronRight, AlertCircle, Thermometer, Camera } from 'lucide-react';
import { getStoredInspections, updateInspectionStatus, InspectionRecord } from '@/utils/storage';
import Link from 'next/link';

export default function UploadPage() {
  const { brand } = useBrand();
  const [inspections, setInspections] = useState<InspectionRecord[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [hasThermal, setHasThermal] = useState(false);
  const [hasVisual, setHasVisual] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    // Carrega inspeções que aguardam upload
    const stored = getStoredInspections().filter(i => i.status === 'Aguardando Upload');
    setInspections(stored);
  }, []);

  const handleCompleteUpload = () => {
    if (!selectedId || !hasThermal || !hasVisual) return;
    
    // Atualiza para "Em Processamento" conforme solicitado
    updateInspectionStatus(selectedId, 'Em Processamento');
    setIsSuccess(true);
  };

  const selectedInspection = inspections.find(i => i.id === selectedId);

  if (isSuccess) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center space-y-6 text-center animate-in zoom-in-95 duration-500 py-20">
           <div className="w-24 h-24 rounded-full bg-emerald-500 flex items-center justify-center mb-4 animate-bounce shadow-lg shadow-emerald-200">
             <CheckCircle2 size={48} className="text-white" />
           </div>
           <h2 className="text-3xl font-black text-slate-800 tracking-tight">Upload Concluído!</h2>
           <p className="text-slate-500 font-medium max-w-md">
             As imagens foram enviadas com sucesso. A inspeção <strong className="text-slate-700">{selectedInspection?.unitName}</strong> agora está no status <strong>"Em Processamento"</strong> no histórico.
           </p>
           <div className="pt-8">
             <Link 
               href="/dashboard/historico"
               className="px-8 py-4 bg-slate-900 text-white text-sm font-black uppercase tracking-widest rounded-xl shadow-lg transition-all inline-flex items-center"
             >
               Ver Histórico <ChevronRight className="ml-2" size={18} />
             </Link>
           </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto w-full space-y-8 animate-in fade-in duration-700 pb-20">
        
        {/* HEADER */}
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center">
            <UploadCloud className="mr-3 text-primary" size={32} />
            Upload de Dados de Inspeção
          </h1>
          <p className="text-slate-500 font-medium italic">Vincule as imagens capturadas em campo à inspeção registrada.</p>
        </div>

        {/* SELETOR DE INSPEÇÃO */}
        <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center space-x-4 mb-2">
            <div className="p-3 bg-amber-50 rounded-2xl text-amber-600">
              <ClipboardList size={24} />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest leading-none">Vincular Demanda</h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Selecione uma inspeção registrada que aguarda dados</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-end">
            <div className="flex-1 w-full space-y-2">
              <label htmlFor="inspection-select" className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Inspeções Pendentes</label>
              <select 
                id="inspection-select"
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
                className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 font-black focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all cursor-pointer outline-none appearance-none"
                aria-label="Selecionar inspeção"
              >
                <option value="">Selecione uma inspeção...</option>
                {inspections.length > 0 ? (
                  inspections.map(i => (
                    <option key={i.id} value={i.id}>{i.unitName} - {i.date} ({i.inspector})</option>
                  ))
                ) : (
                  <option disabled>Nenhuma inspeção aguardando upload</option>
                )}
              </select>
            </div>

            {inspections.length === 0 && (
              <Link href="/dashboard/nova-inspecao" className="px-6 py-4 bg-amber-50 text-amber-700 text-xs font-black uppercase tracking-widest rounded-2xl border border-amber-100 hover:bg-amber-100 transition-all flex items-center">
                Registrar Nova <ChevronRight size={16} className="ml-2" />
              </Link>
            )}
          </div>
        </div>

        {/* DUAL UPLOAD AREA */}
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 transition-all ${!selectedId ? 'opacity-40 pointer-events-none grayscale' : ''}`}>
           {/* THERMAL */}
           <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm flex flex-col items-center text-center space-y-6 group">
              <div className="text-left w-full mb-2">
                <h3 className="text-lg font-black text-slate-800 tracking-tight flex items-center">
                  <Thermometer size={20} className="mr-2 text-red-500" /> Termográficas (IR)
                </h3>
              </div>
              
              <button 
                data-testid="thermal-upload"
                onClick={() => setHasThermal(!hasThermal)}
                className={`w-full h-64 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center transition-all bg-slate-50 relative overflow-hidden group-hover:border-red-400 ${hasThermal ? 'border-red-500 bg-red-50/30' : 'border-slate-200'}`}
              >
                 <div className={`p-4 rounded-full mb-4 ${hasThermal ? 'bg-red-500 text-white' : 'bg-white text-slate-300 shadow-sm'}`}>
                    <UploadCloud size={32} />
                 </div>
                 <span className={`text-sm font-black uppercase tracking-widest ${hasThermal ? 'text-red-600' : 'text-slate-400'}`}>
                   {hasThermal ? 'Pacote Térmico OK' : 'Arraste ficheiros R-JPEG'}
                 </span>
                 {hasThermal && (
                   <div className="mt-2 text-[10px] font-bold text-red-400">720 ARQUIVOS IDENTIFICADOS</div>
                 )}
              </button>
           </div>

           {/* VISUAL */}
           <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm flex flex-col items-center text-center space-y-6 group">
              <div className="text-left w-full mb-2">
                <h3 className="text-lg font-black text-slate-800 tracking-tight flex items-center">
                  <Camera size={20} className="mr-2 text-blue-500" /> Visuais (RGB)
                </h3>
              </div>
              
              <button 
                data-testid="visual-upload"
                onClick={() => setHasVisual(!hasVisual)}
                className={`w-full h-64 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center transition-all bg-slate-50 relative overflow-hidden group-hover:border-blue-400 ${hasVisual ? 'border-blue-500 bg-blue-50/30' : 'border-slate-200'}`}
              >
                 <div className={`p-4 rounded-full mb-4 ${hasVisual ? 'bg-blue-500 text-white' : 'bg-white text-slate-300 shadow-sm'}`}>
                    <UploadCloud size={32} />
                 </div>
                 <span className={`text-sm font-black uppercase tracking-widest ${hasVisual ? 'text-blue-600' : 'text-slate-400'}`}>
                   {hasVisual ? 'Pacote Visual OK' : 'Arraste ficheiros JPG'}
                 </span>
                 {hasVisual && (
                   <div className="mt-2 text-[10px] font-bold text-blue-400">720 ARQUIVOS IDENTIFICADOS</div>
                 )}
              </button>
           </div>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-center pt-8">
           <button 
             disabled={!selectedId || !hasThermal || !hasVisual}
             onClick={handleCompleteUpload}
             className="px-12 py-5 bg-primary text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30 disabled:grayscale disabled:scale-100 flex items-center space-x-3"
           >
             <span>Concluir Upload e Processar</span>
             <ChevronRight size={20} />
           </button>
        </div>

      </div>
    </DashboardLayout>
  );
}
