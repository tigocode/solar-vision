'use client';

import React, { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useBrand } from '@/contexts/BrandContext';
import { useUI } from '@/hooks/useUI';
import {
  CheckCircle2, Clock, ChevronRight, ChevronLeft, Leaf, Activity,
  MapPin, Zap, Users, FileText, Package, Truck, BarChart3, Layers,
  Cpu, Award, UploadCloud, FileImage, Lock, Unlock,
  Download, Plus, Trash2, AlertCircle, CalendarDays, ArrowUpRight,
  Factory
} from 'lucide-react';
import { ProjectStatus, AssetType } from '@/types/plants';
import { getStoredProjects, saveProjectFlow, deleteProjectFlow, SolarProjectFlow } from '@/utils/storage';

function getFlowRoute(stepIndex: number, plantId: string): string | null {
  switch (stepIndex) {
    case 4:
    case 5: return `/dashboard/nova-inspecao?plantId=${plantId}`;
    case 6: return `/dashboard/diagnostico?plantId=${plantId}`;
    case 7: return `/dashboard/relatorios?plantId=${plantId}`;
    default: return null;
  }
}

const STAGES = [
  { status: ProjectStatus.RECEBIMENTO_DEMANDA, label: 'Registro da Planta', icon: <FileText size={14} />, group: 'Gestão', sublabel: 'Dados do ativo físico' },
  { status: ProjectStatus.PROJETO, label: 'Projeto', icon: <Layers size={14} />, group: 'Gestão', sublabel: 'Layout de strings e módulos' },
  { status: ProjectStatus.SUPRIMENTO_LOGISTICA, label: 'Suprimento e Logística', icon: <Package size={14} />, group: 'Financeiro', sublabel: 'Custo de equipamentos' },
  { status: ProjectStatus.FASE_PROPOSTA, label: 'Fase de Proposta', icon: <BarChart3 size={14} />, group: 'Financeiro', sublabel: 'Orçamento e proposta' },
  { status: ProjectStatus.FASE_PLANEJAMENTO, label: 'Planejamento de Execução', icon: <CalendarDays size={14} />, group: 'Operacional', sublabel: 'Agenda e equipe' },
  { status: ProjectStatus.FASE_EXECUCAO, label: 'Execução do Serviço', icon: <Truck size={14} />, group: 'Operacional', sublabel: 'Voo de drone e captura' },
  { status: ProjectStatus.FASE_ANALISE, label: 'Análise das Imagens', icon: <Cpu size={14} />, group: 'Análise', sublabel: 'Processamento IA' },
  { status: ProjectStatus.FASE_RELATORIO, label: 'Elaboração do Relatório', icon: <Award size={14} />, group: 'Análise', sublabel: 'Relatório executivo' },
  { status: ProjectStatus.ENTREGA, label: 'Entrega Final', icon: <CheckCircle2 size={14} />, group: 'Entrega', sublabel: 'Apresentação ao cliente' },
] as const;

const REPORT_UNLOCK_INDEX = 7;

interface SubUnit {
  id: string; 
  name: string; 
  capacity: string; 
  layoutUploaded?: boolean;
  moduleCount?: string;
  stringCount?: string;
  inverterModel?: string;
}

interface FormData {
  plantName: string; 
  assetType: AssetType; 
  subUnits: SubUnit[];
  layoutUploaded: boolean; 
  equipmentCost: string; 
  installationCost: string; 
  proposalValue: string; 
  proposalDate: string; 
  clientName: string;
  executionStartDate: string; 
  executionEndDate: string; 
  teamNotes: string;
  pilotName: string; 
  flightDate: string;
  processingStarted: boolean; 
  processingProgress: number; 
  processingDone: boolean; 
  reportNotes: string;
}

const INITIAL_FORM: FormData = {
  plantName: '', assetType: 'UFV', subUnits: [],
  layoutUploaded: false,
  equipmentCost: '', installationCost: '', proposalValue: '', proposalDate: '', clientName: '',
  executionStartDate: '', executionEndDate: '', teamNotes: '',
  pilotName: '', flightDate: '', processingStarted: false, processingProgress: 0, processingDone: false, reportNotes: '',
};

function canAdvanceFromStep(step: number, form: FormData): boolean {
  switch (step) {
    case 0: return form.plantName.trim().length > 0;
    case 1: 
      if (form.subUnits.length === 0) return false;
      return form.subUnits.every(u => u.name.trim().length > 0 && u.capacity.trim().length > 0 && (u.moduleCount || '').trim().length > 0 && (u.stringCount || '').trim().length > 0 && (u.inverterModel || '').trim().length > 0);
    case 2: return true;
    case 3: return true;
    case 4: return true;
    case 5: return true;
    case 6: return form.processingDone;
    case 7: return true;
    case 8: return true;
    default: return false;
  }
}

interface StepFormProps {
  stepIndex: number;
  form: FormData;
  setForm: React.Dispatch<React.SetStateAction<FormData>>;
  brand: { primaryColor: string };
  onStartProcessing: () => void;
  viewMode: string;
}

function StepFormContent({ stepIndex, form, setForm, brand, onStartProcessing, viewMode }: StepFormProps) {
  const field = useCallback(<K extends keyof FormData>(key: K, value: FormData[K]) => setForm(f => ({ ...f, [key]: value })), [setForm]);
  const inputCls = "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium text-sm placeholder:text-slate-400";
  const labelCls = "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2";

  if (viewMode === 'client' && stepIndex !== 1) {
     return (
       <div className="flex flex-col items-center justify-center p-12 text-center bg-slate-50 rounded-2xl border border-slate-100">
         <Lock size={32} className="text-slate-300 mb-4" />
         <h3 className="text-lg font-bold text-slate-700">Acesso Restrito</h3>
         <p className="text-sm text-slate-500 mt-2">Você possui restrição de visão administrativa para esta etapa de fluxo.</p>
       </div>
     );
  }

  if (stepIndex === 0) {
    return (
      <div className="space-y-6 max-w-2xl text-left">
        <div>
           <label className="text-sm font-bold text-slate-700 block mb-2">Classificação do Ativo</label>
           <div className="flex gap-4">
             <label className={`flex-1 flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${form.assetType === 'UFV' ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-200 hover:border-slate-300'}`}>
                <input type="radio" checked={form.assetType === 'UFV'} onChange={() => field('assetType', 'UFV')} className="hidden" />
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${form.assetType === 'UFV' ? 'border-indigo-600' : 'border-slate-300'}`}>
                   {form.assetType === 'UFV' && <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full" />}
                </div>
                <div>
                   <p className="font-bold text-slate-800">Planta Única (UFV)</p>
                   <p className="text-xs text-slate-500">Usina isolada</p>
                </div>
             </label>
             <label className={`flex-1 flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${form.assetType === 'COMPLEXO' ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-200 hover:border-slate-300'}`}>
                <input type="radio" checked={form.assetType === 'COMPLEXO'} onChange={() => field('assetType', 'COMPLEXO')} className="hidden" />
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${form.assetType === 'COMPLEXO' ? 'border-indigo-600' : 'border-slate-300'}`}>
                   {form.assetType === 'COMPLEXO' && <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full" />}
                </div>
                <div>
                   <p className="font-bold text-slate-800">Complexo Solar</p>
                   <p className="text-xs text-slate-500">Grupamento de UFVs</p>
                </div>
             </label>
           </div>
        </div>

        <div>
           <label className="text-sm font-bold text-slate-700 block mb-2">Nome do {form.assetType === 'COMPLEXO' ? 'Complexo' : 'Projeto'}</label>
           <input type="text" value={form.plantName} onChange={e => field('plantName', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" placeholder="Ex: Complexo Sol do Sertão" />
        </div>
      </div>
    );
  }

  if (stepIndex === 1) {
    return (
      <div className="space-y-6 text-left max-w-3xl">
        <div className="border-2 border-dashed border-slate-300 rounded-3xl p-10 flex flex-col items-center justify-center bg-slate-50 relative group transition-colors hover:border-indigo-400 hover:bg-indigo-50/30">
           <UploadCloud size={40} className="text-slate-400 mb-4 group-hover:text-indigo-500 transition-colors" />
           <p className="text-slate-600 font-bold mb-1">Upload Baseado em Arquivos de Layout</p>
           <p className="text-xs text-slate-400 mb-6 text-center max-w-sm">Para cada PDF/DWG enviado, o sistema derivará uma estrutura técnica (UFV) para leitura.</p>
           
           <button type="button" onClick={() => {
               const newUfv: SubUnit = {
                 id: `ufv-${Date.now()}`,
                 name: form.assetType === 'UFV' && form.subUnits.length === 0 ? form.plantName : `Nome da UFV ${form.subUnits.length + 1}`,
                 capacity: '',
                 moduleCount: '',
                 stringCount: '',
                 inverterModel: '',
                 layoutUploaded: true
               };
               setForm({ ...form, subUnits: [...form.subUnits, newUfv], layoutUploaded: true });
           }} className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl text-sm shadow-md hover:bg-indigo-700 flex items-center gap-2">
              <Plus size={16} /> Simular Envio de Layout
           </button>
        </div>

        <div className="space-y-4">
           {form.subUnits.map((u: SubUnit, i: number) => (
             <div key={u.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500" />
                <div className="flex items-center gap-3 mb-5">
                   <FileImage size={24} className="text-emerald-600" />
                   <div className="flex-1">
                      <h4 className="font-black text-slate-800">Layout #{i+1} Vinculado</h4>
                      <p className="text-xs text-slate-500">layout_arquitetura_ufv_{i+1}.pdf</p>
                   </div>
                   <button type="button" className="text-xs font-bold text-red-500 px-3 py-1.5 bg-red-50 hover:bg-red-100 rounded-lg flex items-center gap-1 transition-colors" onClick={() => {
                        const arr = form.subUnits.filter((_, idx) => idx !== i);
                        setForm({...form, subUnits: arr, layoutUploaded: arr.length > 0});
                   }}><Trash2 size={14}/> Remover</button>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                     <div className="flex-[3]">
                        <label htmlFor={`name-${i}`} className="text-[10px] font-black text-slate-400 mb-1 block uppercase tracking-wider">Nome da UFV</label>
                        <input id={`name-${i}`} value={u.name} onChange={e => {
                           const arr = [...form.subUnits];
                           arr[i].name = e.target.value;
                           setForm({...form, subUnits: arr});
                        }} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Nome da UFV" />
                     </div>
                     <div className="flex-1">
                        <label htmlFor={`cap-${i}`} className="text-[10px] font-black text-slate-400 mb-1 block uppercase tracking-wider">Potência (MWp)</label>
                        <input id={`cap-${i}`} value={u.capacity} onChange={e => {
                           const arr = [...form.subUnits];
                           arr[i].capacity = e.target.value;
                           setForm({...form, subUnits: arr});
                        }} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="MWp" />
                     </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                     <div>
                        <label htmlFor={`mod-${i}`} className="text-[10px] font-black text-slate-400 mb-1 block uppercase tracking-wider">QTD. MÓDULOS</label>
                        <input id={`mod-${i}`} value={u.moduleCount || ''} onChange={e => {
                           const arr = [...form.subUnits];
                           arr[i].moduleCount = e.target.value;
                           setForm({...form, subUnits: arr});
                        }} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Ex: 5040" />
                     </div>
                     <div>
                        <label htmlFor={`str-${i}`} className="text-[10px] font-black text-slate-400 mb-1 block uppercase tracking-wider">Nº STRINGS</label>
                        <input id={`str-${i}`} value={u.stringCount || ''} onChange={e => {
                           const arr = [...form.subUnits];
                           arr[i].stringCount = e.target.value;
                           setForm({...form, subUnits: arr});
                        }} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Ex: 120" />
                     </div>
                     <div>
                        <label htmlFor={`inv-${i}`} className="text-[10px] font-black text-slate-400 mb-1 block uppercase tracking-wider">INVERSOR</label>
                        <input id={`inv-${i}`} value={u.inverterModel || ''} onChange={e => {
                           const arr = [...form.subUnits];
                           arr[i].inverterModel = e.target.value;
                           setForm({...form, subUnits: arr});
                        }} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Ex: Sungrow 250k" />
                     </div>
                  </div>
                </div>
             </div>
           ))}
        </div>
      </div>
    );
  }

  // MOCK SIMPLIFIED THE REST OF THE STEPS FOR SIZE constraints
  if (stepIndex === 2) return <div><label className={labelCls}>Custo Equip.</label><input className={inputCls} value={form.equipmentCost} onChange={e => field('equipmentCost', e.target.value)} /></div>;
  if (stepIndex === 3) return <div><label className={labelCls}>Proposta Valor</label><input className={inputCls} value={form.proposalValue} onChange={e => field('proposalValue', e.target.value)} /></div>;
  if (stepIndex === 4) return <div><label className={labelCls}>Data Início</label><input className={inputCls} value={form.executionStartDate} onChange={e => field('executionStartDate', e.target.value)} /></div>;
  if (stepIndex === 5) return <div><label className={labelCls}>Nome Piloto</label><input className={inputCls} value={form.pilotName} onChange={e => field('pilotName', e.target.value)} /></div>;
  if (stepIndex === 6) return <div className="text-center py-6"><button onClick={onStartProcessing} className="px-5 py-3 rounded bg-blue-600 text-white font-bold">Iniciar IA</button></div>;
  if (stepIndex === 7) return <div><label className={labelCls}>Notas do Relatório</label><textarea className={inputCls} value={form.reportNotes} onChange={e => field('reportNotes', e.target.value)} /></div>;
  
  return <div className="text-center py-6 font-bold text-lg text-emerald-600">Concluído!</div>;
}

function NewPlantPageContent() {
  const { brand } = useBrand();
  const { viewMode } = useUI();
  
  const [projects, setProjects] = useState<SolarProjectFlow[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [form, setForm] = useState<FormData>(INITIAL_FORM);

  useEffect(() => {
    setProjects(getStoredProjects());
  }, []);

  const openProject = (id: string | null) => {
     if (id) {
       const proj = projects.find(p => p.id === id);
       if (proj) {
         setForm(proj.formData);
         setCurrentStep(proj.currentStep);
         const newCompleted = new Set<number>();
         for (let i = 0; i < proj.currentStep; i++) newCompleted.add(i);
         setCompletedSteps(newCompleted);
         setActiveProjectId(id);
       }
     } else {
       setForm(INITIAL_FORM);
       setCurrentStep(0);
       setCompletedSteps(new Set());
       setActiveProjectId('new');
     }
  };

  const isReportUnlocked = currentStep >= REPORT_UNLOCK_INDEX || completedSteps.has(REPORT_UNLOCK_INDEX);
  const canAdvance = canAdvanceFromStep(currentStep, form);
  const progressPct = Math.round((currentStep / (STAGES.length - 1)) * 100);

  const saveToStorage = (step: number, formData: FormData) => {
     const isNew = !activeProjectId || activeProjectId === 'new';
     const projId = isNew ? `P-${Date.now()}` : activeProjectId;
     const newProject: SolarProjectFlow = {
        id: projId,
        name: formData.plantName || 'Novo Projeto',
        assetType: formData.assetType,
        currentStep: step,
        lastUpdated: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        formData: formData
     };
     saveProjectFlow(newProject);
     setProjects(getStoredProjects());
     if (isNew) setActiveProjectId(projId);
  };

  const handleNext = () => {
    if (!canAdvance) return;
    setCompletedSteps(prev => new Set(prev).add(currentStep));
    const nextStep = Math.min(currentStep + 1, STAGES.length - 1);
    setCurrentStep(nextStep);
    saveToStorage(nextStep, form);
  };

  const handleBack = () => setCurrentStep(s => Math.max(s - 1, 0));

  const handleStartProcessing = () => {
     // Mock simplification
     setForm(f => ({ ...f, processingStarted: true, processingDone: true, processingProgress: 100 }));
  };

  const groups = ['Gestão', 'Financeiro', 'Operacional', 'Análise', 'Entrega'];

  return (
      <div className="max-w-[1400px] mx-auto w-full space-y-6">
        {/* HEADER CONTROLS */}
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
              <Factory style={{ color: brand.primaryColor }} size={28} />
              Projetos Ativos
            </h1>
            <p className="text-slate-400 font-medium mt-0.5 text-sm">Gerencie o ciclo de vida completo de cada infraestrutura.</p>
          </div>
          <button onClick={() => openProject(null)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold text-sm">
             <Plus size={16} /> Novo Projeto
          </button>
        </div>

        {/* LISTING IF NO ACTIVE ID OR IN MASTER MODE */}
        {!activeProjectId && (
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {projects.length === 0 ? (
                 <div className="col-span-3 text-center py-12 text-slate-400">Nenhum projeto em vigor. Crie um novo.</div>
              ) : (
                 projects.map(p => (
                    <div key={p.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all cursor-pointer" onClick={() => openProject(p.id)}>
                       <h3 className="font-bold text-lg text-slate-800">{p.name}</h3>
                       <p className="text-xs text-slate-500 mt-1 uppercase font-bold">{p.assetType}</p>
                       <div className="mt-4 flex items-center justify-between">
                          <span className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-bold">Etapa {p.currentStep + 1}</span>
                       </div>
                    </div>
                 ))
              )}
           </div>
        )}

        {/* ACTIVE PROJECT WORKFLOW */}
        {activeProjectId && (
           <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start pb-8">
              <div className="xl:col-span-8 space-y-4">
                 <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 min-h-[420px] flex flex-col">
                    
                    <div className="mb-6 pb-5 border-b border-slate-100 flex justify-between">
                       <h2 className="text-xl font-black text-slate-800">{STAGES[currentStep].label}</h2>
                       <button onClick={() => setActiveProjectId(null)} className="text-xs font-bold text-slate-400 underline">Voltar para Projetos</button>
                    </div>

                    <div className="flex-1">
                       <StepFormContent stepIndex={currentStep} form={form} setForm={setForm} brand={brand} onStartProcessing={handleStartProcessing} viewMode={viewMode} />
                    </div>

                    {!(viewMode === 'client' && currentStep !== 1) && (
                       <div className="pt-6 mt-auto border-t border-slate-100 flex items-center justify-between">
                          <button type="button" onClick={handleBack} disabled={currentStep === 0} className="px-5 py-2.5 rounded-xl text-sm font-bold border border-slate-200 text-slate-500 flex items-center gap-2 hover:bg-slate-50 transition-all disabled:opacity-30">
                             <ChevronLeft size={15} /> Anterior
                          </button>
                          
                          <button type="button" onClick={handleNext} disabled={!canAdvance} className="px-7 py-3 rounded-xl text-white text-sm font-black uppercase tracking-widest flex items-center gap-2 hover:opacity-90 disabled:opacity-35" style={{ backgroundColor: brand.primaryColor }}>
                             {currentStep < STAGES.length - 1 ? <>Avançar <ChevronRight size={15} /></> : <><CheckCircle2 size={14} /> Finalizar</>}
                          </button>
                       </div>
                    )}
                 </div>
              </div>

              <div className="xl:col-span-4 bg-slate-900 rounded-3xl p-6 shadow-2xl">
                 <h3 className="text-base font-black text-white mb-4">Lifecycle do Projeto</h3>
                 <div className="space-y-2">
                    {STAGES.map((s, i) => (
                       <button key={i} disabled={viewMode === 'client'} onClick={() => currentStep > i && setCurrentStep(i)} className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left ${i === currentStep ? 'bg-white/10 text-white' : i < currentStep ? 'text-slate-300' : 'text-slate-600 opacity-50 cursor-not-allowed'}`}>
                          <div className={`w-3 h-3 rounded-full ${i <= currentStep ? 'bg-emerald-500' : 'bg-slate-700'}`} />
                          <span className="text-sm font-bold">{s.label}</span>
                       </button>
                    ))}
                 </div>
              </div>
           </div>
        )}

      </div>
  );
}

export default function NewPlantPage() {
  return (
    <DashboardLayout>
      <NewPlantPageContent />
    </DashboardLayout>
  );
}
