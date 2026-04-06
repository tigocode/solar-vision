'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useBrand } from '@/contexts/BrandContext';
import { UploadCloud, FileImage, FileJson, CheckCircle2, ChevronRight, Activity, Zap } from 'lucide-react';
import Link from 'next/link';
import { ProjectStatus, AssetType, SolarPlant } from '@/types/plants';

type Step = 'setup' | 'processing' | 'success';

// mock de dados refletindo o novo Schema
const MOCK_PLANTS: SolarPlant[] = [
  { id: 'p1', name: 'UFV Alpha', type: 'UFV', capacityKWp: 5.2, location: '', status: ProjectStatus.OPERACAO_E_MANUTENCAO, createdAt: '', updatedAt: '' },
  { 
    id: 'p2', name: 'Complexo Pirapora', type: 'COMPLEXO', capacityKWp: 15.0, location: '', status: ProjectStatus.OPERACAO_E_MANUTENCAO, createdAt: '', updatedAt: '',
    subUnits: [
      { id: 'p2_sub1', name: 'UFV Pirapora I', capacityKWp: 5.0, type: 'UFV', location: '', status: ProjectStatus.OPERACAO_E_MANUTENCAO, createdAt: '', updatedAt: '' },
      { id: 'p2_sub2', name: 'UFV Pirapora II', capacityKWp: 10.0, type: 'UFV', location: '', status: ProjectStatus.OPERACAO_E_MANUTENCAO, createdAt: '', updatedAt: '' }
    ]
  }
];

export default function NovaInspecaoPage() {
  const { brand } = useBrand();
  
  // Controle de Abas
  const [step, setStep] = useState<Step>('setup');
  
  // Dados do Formulário (Setup)
  const [selectedPlantId, setSelectedPlantId] = useState('');
  const [operationScope, setOperationScope] = useState(''); // 'ALL' ou o ID da subUnit
  const [inspector, setInspector] = useState('');
  const [date, setDate] = useState('');
  const [hasFiles, setHasFiles] = useState(false); // Simulação de arquivos arrastados

  // Selected Plant Obj
  const selectedPlant = MOCK_PLANTS.find(p => p.id === selectedPlantId);
  const isComplex = selectedPlant?.type === 'COMPLEXO';

  // Controle do Upload Simulado
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('Inicializando...');

  // Effect para controlar o temporizador de processamento falso
  useEffect(() => {
    if (step === 'processing') {
      const interval = setInterval(() => {
        setProgress((old) => {
          const next = old + 1;
          if (next === 10) setStatusMessage('Lendo metadados...');
          else if (next === 30) setStatusMessage('Analisando matriz térmica...');
          else if (next === 60) setStatusMessage('Classificando anomalias via IA...');
          else if (next === 90) setStatusMessage('Gerando relatório final...');

          if (next >= 100) {
            clearInterval(interval);
            setTimeout(() => setStep('success'), 400); 
            return 100;
          }
          return next;
        });
      }, 40);

      return () => clearInterval(interval);
    }
  }, [step]);

  // Esvazia as dependencias cascata se mudar de "planta mãe"
  useEffect(() => {
     setOperationScope('ALL');
  }, [selectedPlantId]);

  const handleStartProcessing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlantId || !inspector || !date || !hasFiles) return;
    setStep('processing');
  };

  const getTargetCapacity = () => {
     if (!selectedPlant) return null;
     if (isComplex && operationScope !== 'ALL') {
        const sub = selectedPlant.subUnits?.find(s => s.id === operationScope);
        return sub ? sub.capacityKWp : 0;
     }
     return selectedPlant.capacityKWp;
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto w-full space-y-8 animate-in fade-in duration-700">
        
        {/* HEADER GENÉRICO */}
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center">
            <UploadCloud className="mr-3 text-primary" size={32} />
            Nova Inspeção Fotovoltaica
          </h1>
          <p className="text-slate-500 font-medium italic">Faça o upload do pacote de imagens do drone para diagnóstico IA.</p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-8 md:p-12 min-h-[500px] flex flex-col justify-center">

          {/* FASE 1: CONFIGURAÇÃO E UPLOAD */}
          {step === 'setup' && (
            <form onSubmit={handleStartProcessing} className="space-y-10 animate-in fade-in zoom-in-95 duration-500">
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className={`space-y-2 ${isComplex ? 'lg:col-span-2' : 'lg:col-span-1'}`}>
                  <label className="text-sm font-bold text-slate-700">Seleção de Ativo (Usina)</label>
                  <select 
                    required 
                    value={selectedPlantId} onChange={(e) => setSelectedPlantId(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium appearance-none cursor-pointer"
                  >
                    <option value="" disabled>Selecione um ativo da base...</option>
                    {MOCK_PLANTS.map(p => (
                       <option key={p.id} value={p.id}>{p.name} ({p.type})</option>
                    ))}
                  </select>
                </div>

                {/* Aparece atrelado apenas se a Usina for do tipo Complexo */}
                {isComplex && (
                  <div className="space-y-2 lg:col-span-2 animate-in fade-in slide-in-from-top-4 duration-300">
                     <label className="text-sm font-bold text-slate-700">Escopo da Operação no Complexo</label>
                     <select 
                       value={operationScope} onChange={(e) => setOperationScope(e.target.value)}
                       className="w-full px-4 py-3 bg-indigo-50/50 border border-indigo-100 rounded-xl text-indigo-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold appearance-none cursor-pointer"
                     >
                       <option value="ALL">Complexo Consolidado Inteiro</option>
                       {selectedPlant?.subUnits?.map(sub => (
                          <option key={sub.id} value={sub.id}>Inspecionar apenas {sub.name}</option>
                       ))}
                     </select>
                  </div>
                )}
                
                <div className={`${isComplex ? 'lg:col-span-2' : 'lg:col-span-1'} space-y-2`}>
                  <label className="text-sm font-bold text-slate-700">Data da Inspeção</label>
                  <input 
                    type="date" required 
                    value={date} onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                  />
                </div>
                <div className={`${isComplex ? 'lg:col-span-2' : 'lg:col-span-2'} space-y-2`}>
                  <label className="text-sm font-bold text-slate-700">Responsável Técnico</label>
                  <input 
                    type="text" required 
                    value={inspector} onChange={(e) => setInspector(e.target.value)}
                    placeholder="Nome do Piloto/Engenheiro"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                  />
                </div>
              </div>

              {/* BARRA DE METADADOS EXTRAIDA AUTOMATICAMENTE DA RELAÇÃO */}
              {selectedPlant && (
                 <div className="bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl flex items-center justify-between text-sm animate-in fade-in duration-300">
                   <span className="font-bold text-slate-500">Métricas Recuperadas:</span>
                   <div className="flex gap-4 font-black text-slate-800">
                      <span className="flex items-center"><Zap size={14} className="mr-1 text-slate-400" /> {getTargetCapacity()} MWp Vinculados</span>
                      <span className="text-slate-300">|</span>
                      <span>{operationScope === 'ALL' ? 'Workflow Geral' : 'Workflow Individual Restrito'}</span>
                   </div>
                 </div>
              )}

              {/* DROPZONE AREA */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-700">Pacote de Dados (RGB/IR + Metadados)</label>
                
                <button 
                  type="button"
                  data-testid="mock-dropzone-click"
                  onClick={() => setHasFiles(!hasFiles)}
                  className={`w-full h-64 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all bg-slate-50 group hover:border-primary hover:bg-primary/5
                    ${hasFiles ? 'border-primary bg-primary/5 ' : 'border-slate-300'}`
                  }
                >
                  <div className={`p-4 rounded-full mb-4 shadow-sm transition-transform group-hover:scale-110 ${hasFiles ? 'bg-primary text-white' : 'bg-white text-slate-400'}`}>
                     <UploadCloud size={32} />
                  </div>
                  
                  <h3 className={`font-black tracking-tight text-lg mb-1 ${hasFiles ? 'text-primary' : 'text-slate-600'}`}>
                    {hasFiles ? 'Pacote Anexado com Sucesso!' : 'Clique ou araste seus arquivos aqui'}
                  </h3>
                  
                  {!hasFiles ? (
                    <p className="text-slate-500 text-sm font-medium">Arquivos suportados: .jpg (Radiométricos), .tif, info.json, .csv</p>
                  ) : (
                    <div className="flex space-x-4 mt-4 text-emerald-600">
                      <span className="flex items-center text-xs font-bold bg-emerald-50 px-2 py-1 rounded"><FileImage size={14} className="mr-1" /> 1,420 Imagens</span>
                      <span className="flex items-center text-xs font-bold bg-emerald-50 px-2 py-1 rounded"><FileJson size={14} className="mr-1" /> Telemetria OK</span>
                    </div>
                  )}
                </button>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={!hasFiles || !selectedPlantId || !inspector || !date}
                  className="px-8 py-4 bg-primary text-white text-sm font-black uppercase tracking-widest rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:opacity-90 transition-all disabled:opacity-50 disabled:shadow-none flex items-center"
                >
                  Iniciar Processamento <ChevronRight className="ml-2" size={18} />
                </button>
              </div>
            </form>
          )}

          {/* FASE 2: PROCESSANDO (SIMULAÇÃO) */}
          {step === 'processing' && (
            <div className="flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-700 py-12">
              <div className="relative">
                {/* Loader Circular Simples */}
                <div className="w-24 h-24 border-4 border-slate-100 rounded-full flex items-center justify-center relative overflow-hidden">
                   <div 
                     className="absolute bottom-0 left-0 right-0 bg-primary/20 transition-all duration-100" 
                     style={{ height: `${progress}%` }} 
                   />
                   <Activity size={32} className="text-primary animate-pulse relative z-10" />
                </div>
              </div>

              <div className="text-center space-y-2 w-full max-w-sm">
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">Processando Dados</h2>
                <p className="text-slate-500 font-medium h-6 text-sm">{statusMessage}</p>
                
                {/* Linha de Progresso Contínua */}
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-4">
                  <div 
                    className="h-full bg-primary transition-all duration-75 ease-linear"
                    style={{ width: `${progress}%`, backgroundColor: brand.primaryColor }}
                  />
                </div>
                <p className="text-xs font-bold text-slate-400 mt-2 text-right">{progress}%</p>
              </div>
            </div>
          )}

          {/* FASE 3: SUCESSO */}
          {step === 'success' && (
            <div className="flex flex-col items-center justify-center space-y-6 text-center animate-in zoom-in-95 duration-500 py-12">
               <div className="w-24 h-24 rounded-full flex items-center justify-center mb-4 animate-bounce" style={{ backgroundColor: brand.primaryColor }}>
                 <CheckCircle2 size={48} className="text-white" />
               </div>
               
               <h2 className="text-3xl font-black text-slate-800 tracking-tight">Inspeção Concluída!</h2>
               <p className="text-slate-500 font-medium max-w-md">
                 O processamento da usina <strong className="text-slate-700">{selectedPlant?.name || 'Local'}</strong> foi finalizado com sucesso. Nossa inteligência artificial mapeou os módulos e classificou as anomalias detectadas.
               </p>

               <div className="pt-8">
                 <Link 
                   href="/dashboard/diagnostico"
                   className="px-8 py-4 text-white text-sm font-black uppercase tracking-widest rounded-xl shadow-lg hover:opacity-90 transition-all inline-flex items-center"
                   style={{ backgroundColor: brand.primaryColor, boxShadow: `0 10px 15px -3px ${brand.primaryColor}40` }}
                 >
                   Ver Diagnóstico da Usina <ChevronRight className="ml-2" size={18} />
                 </Link>
               </div>
            </div>
          )}

        </div>
      </div>
    </DashboardLayout>
  );
}
