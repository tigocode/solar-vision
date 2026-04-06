'use client';

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useBrand } from '@/contexts/BrandContext';
import {
  CheckCircle2, Clock, ChevronRight, ChevronLeft, Leaf, Activity,
  MapPin, Zap, Users, FileText, Package, Truck, BarChart3, Layers,
  Cpu, Award, UploadCloud, FileImage, Lock, Unlock,
  Download, Plus, Trash2, AlertCircle, CalendarDays, ArrowUpRight
} from 'lucide-react';
import { ProjectStatus, AssetType } from '@/types/plants';

// =====================================================
// LÓGICA DE NAVEGAÇÃO DE FLUXO (espelha os testes)
// =====================================================
function getFlowRoute(stepIndex: number, plantId: string): string | null {
  switch (stepIndex) {
    case 4:
    case 5: return `/dashboard/nova-inspecao?plantId=${plantId}`;
    case 6: return `/dashboard/diagnostico?plantId=${plantId}`;
    case 7: return `/dashboard/relatorios?plantId=${plantId}`;
    default: return null;
  }
}

// =====================================================
// DEFINIÇÃO DAS 9 ETAPAS
// =====================================================
const STAGES = [
  {
    status: ProjectStatus.RECEBIMENTO_DEMANDA,
    label: 'Registro da Planta',
    icon: <FileText size={14} />,
    group: 'Gestão',
    sublabel: 'Dados do ativo físico',
  },
  {
    status: ProjectStatus.PROJETO,
    label: 'Projeto',
    icon: <Layers size={14} />,
    group: 'Gestão',
    sublabel: 'Layout de strings e módulos',
  },
  {
    status: ProjectStatus.SUPRIMENTO_LOGISTICA,
    label: 'Suprimento e Logística',
    icon: <Package size={14} />,
    group: 'Financeiro',
    sublabel: 'Custo de equipamentos',
  },
  {
    status: ProjectStatus.FASE_PROPOSTA,
    label: 'Fase de Proposta',
    icon: <BarChart3 size={14} />,
    group: 'Financeiro',
    sublabel: 'Orçamento e proposta',
  },
  {
    status: ProjectStatus.FASE_PLANEJAMENTO,
    label: 'Planejamento de Execução',
    icon: <CalendarDays size={14} />,
    group: 'Operacional',
    sublabel: 'Agenda e equipe',
  },
  {
    status: ProjectStatus.FASE_EXECUCAO,
    label: 'Execução do Serviço',
    icon: <Truck size={14} />,
    group: 'Operacional',
    sublabel: 'Voo de drone e captura',
  },
  {
    status: ProjectStatus.FASE_ANALISE,
    label: 'Análise das Imagens',
    icon: <Cpu size={14} />,
    group: 'Análise',
    sublabel: 'Processamento IA',
  },
  {
    status: ProjectStatus.FASE_RELATORIO,
    label: 'Elaboração do Relatório',
    icon: <Award size={14} />,
    group: 'Análise',
    sublabel: 'Relatório executivo',
  },
  {
    status: ProjectStatus.ENTREGA,
    label: 'Entrega Final',
    icon: <CheckCircle2 size={14} />,
    group: 'Entrega',
    sublabel: 'Apresentação ao cliente',
  },
] as const;

const REPORT_UNLOCK_INDEX = 7; // índice de FASE_RELATORIO

// =====================================================
// ESTADO DO FORMULÁRIO
// =====================================================
interface SubUnit {
  id: string;
  name: string;
  capacity: string;
}

interface FormData {
  // Etapa 1
  plantName: string;
  assetType: AssetType;
  capacity: string;
  subUnits: SubUnit[];
  // Etapa 2
  layoutUploaded: boolean;
  moduleCount: string;
  stringCount: string;
  inverterModel: string;
  // Etapa 3
  equipmentCost: string;
  installationCost: string;
  // Etapa 4
  proposalValue: string;
  proposalDate: string;
  clientName: string;
  // Etapa 5
  executionStartDate: string;
  executionEndDate: string;
  teamNotes: string;
  // Etapa 6
  pilotName: string;
  flightDate: string;
  // Etapa 7 — processamento IA
  processingStarted: boolean;
  processingProgress: number;
  processingDone: boolean;
  // Etapa 8
  reportNotes: string;
}

const INITIAL_FORM: FormData = {
  plantName: '', assetType: 'UFV', capacity: '', subUnits: [],
  layoutUploaded: false, moduleCount: '', stringCount: '', inverterModel: '',
  equipmentCost: '', installationCost: '',
  proposalValue: '', proposalDate: '', clientName: '',
  executionStartDate: '', executionEndDate: '', teamNotes: '',
  pilotName: '', flightDate: '',
  processingStarted: false, processingProgress: 0, processingDone: false,
  reportNotes: '',
};

// =====================================================
// VALIDAÇÃO (espelha os testes)
// =====================================================
function canAdvanceFromStep(stepIndex: number, form: FormData): boolean {
  switch (stepIndex) {
    case 0: return form.plantName.trim().length > 0;
    case 1: return form.layoutUploaded;
    case 2: return !!(form.equipmentCost && parseFloat(form.equipmentCost) > 0);
    case 3: return !!(form.proposalValue && parseFloat(form.proposalValue) > 0);
    case 4: return form.executionStartDate.trim().length > 0;
    case 5: return form.pilotName.trim().length > 0;
    default: return true;
  }
}

// =====================================================
// FORMULÁRIOS POR ETAPA
// =====================================================
interface StepFormProps {
  stepIndex: number;
  form: FormData;
  setForm: React.Dispatch<React.SetStateAction<FormData>>;
  brand: { primaryColor: string };
  onStartProcessing: () => void;
}

function StepFormContent({ stepIndex, form, setForm, brand, onStartProcessing }: StepFormProps) {
  const field = useCallback(
    <K extends keyof FormData>(key: K, value: FormData[K]) =>
      setForm(f => ({ ...f, [key]: value })),
    [setForm]
  );

  const inputCls = "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium text-sm placeholder:text-slate-400";
  const labelCls = "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2";

  const addSubUnit = () =>
    setForm(f => ({ ...f, subUnits: [...f.subUnits, { id: `su-${Date.now()}`, name: '', capacity: '' }] }));

  const removeSubUnit = (id: string) =>
    setForm(f => ({ ...f, subUnits: f.subUnits.filter(s => s.id !== id) }));

  const updateSubUnit = (id: string, key: 'name' | 'capacity', val: string) =>
    setForm(f => ({ ...f, subUnits: f.subUnits.map(s => s.id === id ? { ...s, [key]: val } : s) }));

  const totalSubCapacity = form.subUnits
    .reduce((acc, s) => acc + (parseFloat(s.capacity) || 0), 0)
    .toFixed(2);

  // ------- Etapa 1: Registro da Planta -------
  if (stepIndex === 0) return (
    <div className="space-y-5 animate-in slide-in-from-right-6 duration-400">
      <div>
        <label className={labelCls}>Tipo de Ativo</label>
        <div className="flex gap-3">
          {(['UFV', 'COMPLEXO'] as AssetType[]).map(t => (
            <label key={t}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 cursor-pointer transition-all font-bold text-sm"
              style={form.assetType === t
                ? { borderColor: brand.primaryColor, color: brand.primaryColor, backgroundColor: `${brand.primaryColor}10` }
                : { borderColor: '#e2e8f0', color: '#94a3b8' }}>
              <input type="radio" className="hidden" checked={form.assetType === t}
                onChange={() => field('assetType', t)} />
              {t === 'UFV' ? <Zap size={14} /> : <Users size={14} />}
              {t === 'UFV' ? 'Planta Única (UFV)' : 'Complexo Solar'}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className={labelCls}><MapPin size={11} className="inline mr-1" />
          Nome do {form.assetType === 'COMPLEXO' ? 'Complexo' : 'Projeto / UFV'}
        </label>
        <input className={inputCls} value={form.plantName}
          onChange={e => field('plantName', e.target.value)}
          placeholder={form.assetType === 'COMPLEXO' ? 'Ex: Complexo Pirapora' : 'Ex: UFV Sertão I'} />
      </div>

      {form.assetType === 'UFV' ? (
        <div>
          <label className={labelCls}><Zap size={11} className="inline mr-1" />Potência Instalada (MWp)</label>
          <input type="number" step="0.01" className={`${inputCls} w-48`}
            value={form.capacity} onChange={e => field('capacity', e.target.value)}
            placeholder="Ex: 12.5" />
        </div>
      ) : (
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <label className={labelCls + ' mb-0'}>Sub-Plantas Vinculadas</label>
            <button type="button" onClick={addSubUnit}
              className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-white border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors"
              style={{ color: brand.primaryColor }}>
              <Plus size={12} /> Adicionar UFV
            </button>
          </div>
          {form.subUnits.length === 0 ? (
            <p className="text-xs text-slate-400 italic text-center py-3">Nenhuma UFV adicionada.</p>
          ) : (
            <div className="space-y-2">
              {form.subUnits.map((su, idx) => (
                <div key={su.id} className="flex gap-2 items-center">
                  <input placeholder={`Nome UFV ${idx + 1}`} value={su.name}
                    onChange={e => updateSubUnit(su.id, 'name', e.target.value)}
                    className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white outline-none focus:ring-1 focus:ring-primary/30" />
                  <input type="number" step="0.01" placeholder="MWp" value={su.capacity}
                    onChange={e => updateSubUnit(su.id, 'capacity', e.target.value)}
                    className="w-20 px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white outline-none focus:ring-1 focus:ring-primary/30" />
                  <button type="button" onClick={() => removeSubUnit(su.id)}
                    className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
            <span className="text-xs text-slate-500 font-medium">Total Consolidado</span>
            <span className="font-black text-slate-800">{totalSubCapacity} MWp</span>
          </div>
        </div>
      )}
    </div>
  );

  // ------- Etapa 2: Projeto (Upload Layout) -------
  if (stepIndex === 1) return (
    <div className="space-y-5 animate-in slide-in-from-right-6 duration-400">
      <div>
        <label className={labelCls}>Layout de Strings / Diagrama Elétrico</label>
        <button type="button" onClick={() => field('layoutUploaded', !form.layoutUploaded)}
          className={`w-full h-44 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all group`}
          style={form.layoutUploaded
            ? { borderColor: brand.primaryColor, backgroundColor: `${brand.primaryColor}08` }
            : { borderColor: '#cbd5e1', backgroundColor: '#f8fafc' }}>
          <div className={`p-3 rounded-full mb-3 transition-all group-hover:scale-110`}
            style={form.layoutUploaded
              ? { backgroundColor: brand.primaryColor, color: '#fff' }
              : { backgroundColor: '#fff', color: '#94a3b8' }}>
            {form.layoutUploaded ? <FileImage size={24} /> : <UploadCloud size={24} />}
          </div>
          <p className="text-sm font-bold" style={form.layoutUploaded ? { color: brand.primaryColor } : { color: '#64748b' }}>
            {form.layoutUploaded ? '✓ Layout Elétrico Anexado' : 'Clique para anexar Layout (.dwg, .pdf, .png)'}
          </p>
          {!form.layoutUploaded && (
            <p className="text-xs text-slate-400 mt-1">Ou arraste o arquivo aqui</p>
          )}
        </button>

        {!form.layoutUploaded && (
          <p className="flex items-center gap-1.5 text-xs text-amber-600 font-medium mt-2">
            <AlertCircle size={12} /> O upload do layout é obrigatório para avançar.
          </p>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className={labelCls}>Qtd. de Módulos</label>
          <input type="number" className={inputCls} value={form.moduleCount}
            onChange={e => field('moduleCount', e.target.value)} placeholder="Ex: 240" />
        </div>
        <div>
          <label className={labelCls}>N° de Strings</label>
          <input type="number" className={inputCls} value={form.stringCount}
            onChange={e => field('stringCount', e.target.value)} placeholder="Ex: 16" />
        </div>
        <div>
          <label className={labelCls}>Modelo do Inversor</label>
          <input className={inputCls} value={form.inverterModel}
            onChange={e => field('inverterModel', e.target.value)} placeholder="Ex: Sungrow 50k" />
        </div>
      </div>
    </div>
  );

  // ------- Etapa 3: Suprimento e Logística -------
  if (stepIndex === 2) return (
    <div className="space-y-5 animate-in slide-in-from-right-6 duration-400">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}><Package size={11} className="inline mr-1" />Custo de Equipamentos (R$)</label>
          <input type="number" className={inputCls} value={form.equipmentCost}
            onChange={e => field('equipmentCost', e.target.value)} placeholder="Ex: 520.000" />
        </div>
        <div>
          <label className={labelCls}>Custo de Instalação (R$)</label>
          <input type="number" className={inputCls} value={form.installationCost}
            onChange={e => field('installationCost', e.target.value)} placeholder="Ex: 130.000" />
        </div>
      </div>
      {(parseFloat(form.equipmentCost) > 0 || parseFloat(form.installationCost) > 0) && (
        <div className="rounded-xl p-4 border" style={{ backgroundColor: `${brand.primaryColor}08`, borderColor: `${brand.primaryColor}25` }}>
          <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: `${brand.primaryColor}99` }}>Custo Total Estimado</p>
          <p className="text-2xl font-black text-slate-800">
            R$ {((parseFloat(form.equipmentCost) || 0) + (parseFloat(form.installationCost) || 0)).toLocaleString('pt-BR')}
          </p>
        </div>
      )}
    </div>
  );

  // ------- Etapa 4: Fase de Proposta -------
  if (stepIndex === 3) return (
    <div className="space-y-5 animate-in slide-in-from-right-6 duration-400">
      <div>
        <label className={labelCls}><Users size={11} className="inline mr-1" />Nome do Cliente</label>
        <input className={inputCls} value={form.clientName}
          onChange={e => field('clientName', e.target.value)}
          placeholder="Ex: Energia Renovável S.A." />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}><BarChart3 size={11} className="inline mr-1" />Valor da Proposta (R$)</label>
          <input type="number" className={inputCls} value={form.proposalValue}
            onChange={e => field('proposalValue', e.target.value)} placeholder="Ex: 850.000" />
        </div>
        <div>
          <label className={labelCls}>Validade da Proposta</label>
          <input type="date" className={inputCls} value={form.proposalDate}
            onChange={e => field('proposalDate', e.target.value)} />
        </div>
      </div>
      {parseFloat(form.equipmentCost) > 0 && parseFloat(form.proposalValue) > 0 && (
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Margem Estimada</p>
          <p className="text-xl font-black" style={{ color: brand.primaryColor }}>
            R$ {Math.max(0, parseFloat(form.proposalValue) - parseFloat(form.equipmentCost) - (parseFloat(form.installationCost) || 0)).toLocaleString('pt-BR')}
          </p>
          <p className="text-xs text-slate-400 mt-1">Proposta − (Equipamentos + Instalação)</p>
        </div>
      )}
    </div>
  );

  // ------- Etapa 5: Planejamento de Execução -------
  if (stepIndex === 4) return (
    <div className="space-y-5 animate-in slide-in-from-right-6 duration-400">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}><CalendarDays size={11} className="inline mr-1" />Data de Início</label>
          <input type="date" className={inputCls} value={form.executionStartDate}
            onChange={e => field('executionStartDate', e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Previsão de Término</label>
          <input type="date" className={inputCls} value={form.executionEndDate}
            onChange={e => field('executionEndDate', e.target.value)} />
        </div>
      </div>
      <div>
        <label className={labelCls}>Equipe e Observações</label>
        <textarea rows={4} className={`${inputCls} resize-none`} value={form.teamNotes}
          onChange={e => field('teamNotes', e.target.value)}
          placeholder="Descreva a equipe responsável, acesso ao local, requisitos de segurança..." />
      </div>
    </div>
  );

  // ------- Etapa 6: Execução do Serviço -------
  if (stepIndex === 5) return (
    <div className="space-y-5 animate-in slide-in-from-right-6 duration-400">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}><Truck size={11} className="inline mr-1" />Piloto Responsável</label>
          <input className={inputCls} value={form.pilotName}
            onChange={e => field('pilotName', e.target.value)}
            placeholder="Nome do piloto certificado" />
        </div>
        <div>
          <label className={labelCls}>Data do Voo</label>
          <input type="date" className={inputCls} value={form.flightDate}
            onChange={e => field('flightDate', e.target.value)} />
        </div>
      </div>
    </div>
  );

  // ------- Etapa 7: Análise das Imagens (IA) -------
  if (stepIndex === 6) return (
    <div className="space-y-5 animate-in slide-in-from-right-6 duration-400">
      {!form.processingStarted ? (
        <div className="flex flex-col items-center justify-center py-8 text-center space-y-5">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: `${brand.primaryColor}15` }}>
            <Cpu size={36} style={{ color: brand.primaryColor }} />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-800">Dados Prontos para Análise</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-sm">
              O pacote de imagens está integrado. Acione a IA para análise termográfica e classificação de anomalias.
            </p>
          </div>
          <button type="button" onClick={onStartProcessing}
            className="px-8 py-3.5 rounded-xl text-white text-sm font-black uppercase tracking-widest flex items-center gap-2 hover:opacity-90 transition-all shadow-lg"
            style={{ backgroundColor: brand.primaryColor, boxShadow: `0 10px 25px -5px ${brand.primaryColor}50` }}>
            <Cpu size={15} /> Iniciar Processamento IA
          </button>
        </div>
      ) : form.processingDone ? (
        <div className="flex flex-col items-center justify-center py-8 text-center space-y-5 animate-in zoom-in-95 duration-500">
          <div className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${brand.primaryColor}20` }}>
            <CheckCircle2 size={40} style={{ color: brand.primaryColor }} />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-800">Análise Concluída!</h3>
            <p className="text-sm text-slate-500 mt-1">Anomalias classificadas. Avance para gerar o Relatório.</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 space-y-6 animate-in fade-in duration-500">
          <div className="w-24 h-24 relative">
            <div className="w-full h-full rounded-full border-4 border-slate-100 flex items-center justify-center overflow-hidden relative">
              <div className="absolute bottom-0 left-0 right-0 transition-all duration-150"
                style={{ height: `${form.processingProgress}%`, backgroundColor: `${brand.primaryColor}20` }} />
              <Cpu size={30} className="relative z-10 animate-pulse" style={{ color: brand.primaryColor }} />
            </div>
          </div>
          <div className="w-full max-w-xs space-y-2">
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-100"
                style={{ width: `${form.processingProgress}%`, backgroundColor: brand.primaryColor }} />
            </div>
            <div className="flex justify-between text-xs font-bold text-slate-400">
              <span>Analisando termografia...</span>
              <span>{form.processingProgress}%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // ------- Etapa 8: Elaboração do Relatório -------
  if (stepIndex === 7) return (
    <div className="space-y-5 animate-in slide-in-from-right-6 duration-400">
      <div className="flex items-center gap-4 p-4 rounded-xl border"
        style={{ backgroundColor: `${brand.primaryColor}08`, borderColor: `${brand.primaryColor}30` }}>
        <Unlock size={18} style={{ color: brand.primaryColor }} />
        <div>
          <p className="text-sm font-bold" style={{ color: brand.primaryColor }}>Relatório Executivo Disponível</p>
          <p className="text-xs text-slate-500 mt-0.5">A análise de IA foi concluída. Você pode gerar e exportar o relatório.</p>
        </div>
      </div>
      <div>
        <label className={labelCls}>Observações do Relatório</label>
        <textarea rows={4} className={`${inputCls} resize-none`} value={form.reportNotes}
          onChange={e => field('reportNotes', e.target.value)}
          placeholder="Adicione notas técnicas ou contextuais para o relatório executivo..." />
      </div>
      <div className="flex gap-3">
        <button type="button"
          className="flex-1 px-5 py-3 rounded-xl text-white text-sm font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-md"
          style={{ backgroundColor: brand.primaryColor }}>
          <Download size={15} /> Baixar Relatório PDF
        </button>
        <button type="button"
          className="px-5 py-3 rounded-xl text-slate-600 text-sm font-bold border border-slate-200 flex items-center gap-2 hover:bg-slate-50 transition-all">
          <BarChart3 size={15} /> Ver Diagnóstico
        </button>
      </div>
    </div>
  );

  // ------- Etapa 9: Entrega Final -------
  return (
    <div className="flex flex-col items-center justify-center space-y-5 py-10 text-center animate-in zoom-in-95 duration-400">
      <div className="w-20 h-20 rounded-full flex items-center justify-center"
        style={{ backgroundColor: `${brand.primaryColor}15` }}>
        <CheckCircle2 size={40} style={{ color: brand.primaryColor }} />
      </div>
      <div>
        <h3 className="text-xl font-black text-slate-800">Projeto Concluído!</h3>
        <p className="text-slate-400 text-sm mt-1.5 max-w-xs">
          A usina <strong className="text-slate-700">{form.plantName || 'cadastrada'}</strong> passou por todas as etapas do workflow operacional.
        </p>
      </div>
    </div>
  );
}

// =====================================================
// PÁGINA PRINCIPAL
// =====================================================
export default function NewPlantPage() {
  const { brand } = useBrand();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [form, setForm] = useState<FormData>(INITIAL_FORM);

  const isReportUnlocked = currentStep >= REPORT_UNLOCK_INDEX || completedSteps.has(REPORT_UNLOCK_INDEX);
  const canAdvance = canAdvanceFromStep(currentStep, form);
  const progressPct = Math.round((currentStep / (STAGES.length - 1)) * 100);

  const handleNext = () => {
    if (!canAdvance) return;
    setCompletedSteps(prev => new Set(prev).add(currentStep));
    setCurrentStep(s => Math.min(s + 1, STAGES.length - 1));
  };

  const handleBack = () => setCurrentStep(s => Math.max(s - 1, 0));

  const handleStepClick = (idx: number) => {
    if (idx === currentStep || completedSteps.has(idx)) setCurrentStep(idx);
  };

  const handleStartProcessing = () => {
    setForm(f => ({ ...f, processingStarted: true, processingProgress: 0 }));
    const timer = setInterval(() => {
      setForm(f => {
        const next = f.processingProgress + 2;
        if (next >= 100) {
          clearInterval(timer);
          return { ...f, processingProgress: 100, processingDone: true };
        }
        return { ...f, processingProgress: next };
      });
    }, 60);
  };

  const groups = ['Gestão', 'Financeiro', 'Operacional', 'Análise', 'Entrega'];

  return (
    <DashboardLayout>
      <div className="max-w-[1400px] mx-auto w-full space-y-6 animate-in fade-in duration-700">

        {/* HEADER */}
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
              <Leaf style={{ color: brand.primaryColor }} size={28} />
              Cadastro Operacional
            </h1>
            <p className="text-slate-400 font-medium mt-0.5 text-sm">
              {form.plantName ? <><strong className="text-slate-700">{form.plantName}</strong> · </> : null}
              Etapa {currentStep + 1} de {STAGES.length} — {STAGES[currentStep].label}
            </p>
          </div>

          <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border transition-all duration-500
            ${isReportUnlocked ? '' : 'border-slate-200 text-slate-400 bg-slate-50'}`}
            style={isReportUnlocked ? {
              backgroundColor: `${brand.primaryColor}12`,
              color: brand.primaryColor,
              borderColor: `${brand.primaryColor}35`,
            } : {}}>
            {isReportUnlocked ? <Unlock size={12} /> : <Lock size={12} />}
            {isReportUnlocked ? 'Relatório Disponível' : 'Relatório na Etapa 8'}
          </div>
        </div>

        {/* GRID PRINCIPAL */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start pb-8">

          {/* ===== COLUNA ESQUERDA: FORMULÁRIO ===== */}
          <div className="xl:col-span-8 space-y-4">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 min-h-[420px] flex flex-col">

              {/* Cabeçalho da etapa */}
              <div className="mb-6 pb-5 border-b border-slate-100">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    {STAGES[currentStep].group} · {STAGES[currentStep].sublabel}
                  </span>
                  <div className="flex items-center gap-2">
                    {/* BOTÃO ACESSAR FLUXO — aparece apenas nas etapas com rota vinculada */}
                    {(() => {
                      const plantId = form.plantName
                        ? form.plantName.toLowerCase().replace(/\s+/g, '-')
                        : 'nova-planta';
                      const route = getFlowRoute(currentStep, plantId);
                      return route ? (
                        <Link
                          href={route}
                          className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-lg border transition-all hover:opacity-80 animate-in zoom-in-95 duration-300"
                          style={{
                            color: brand.primaryColor,
                            borderColor: `${brand.primaryColor}40`,
                            backgroundColor: `${brand.primaryColor}10`,
                          }}
                        >
                          Acessar Fluxo <ArrowUpRight size={11} />
                        </Link>
                      ) : null;
                    })()}
                    <span className="text-[10px] font-black text-slate-400">
                      {currentStep + 1} / {STAGES.length}
                    </span>
                  </div>
                </div>
                <h2 className="text-xl font-black text-slate-800">{STAGES[currentStep].label}</h2>
                <div className="mt-3 w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${progressPct}%`, backgroundColor: brand.primaryColor }} />
                </div>
              </div>

              {/* Formulário dinâmico */}
              <div className="flex-1">
                <StepFormContent
                  stepIndex={currentStep}
                  form={form}
                  setForm={setForm}
                  brand={brand}
                  onStartProcessing={handleStartProcessing}
                />
              </div>

              {/* Navegação inferior */}
              <div className="pt-6 mt-auto border-t border-slate-100 flex items-center justify-between">
                <button type="button" onClick={handleBack} disabled={currentStep === 0}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold border border-slate-200 text-slate-500 flex items-center gap-2 hover:bg-slate-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                  <ChevronLeft size={15} /> Anterior
                </button>

                {currentStep < STAGES.length - 1 ? (
                  <button type="button" onClick={handleNext} disabled={!canAdvance}
                    className="px-7 py-3 rounded-xl text-white text-sm font-black uppercase tracking-widest flex items-center gap-2 hover:opacity-90 transition-all disabled:opacity-35 disabled:cursor-not-allowed shadow-lg disabled:shadow-none"
                    style={canAdvance ? { backgroundColor: brand.primaryColor, boxShadow: `0 8px 20px -4px ${brand.primaryColor}45` } : { backgroundColor: '#94a3b8' }}>
                    {!canAdvance && <Lock size={13} />}
                    Avançar <ChevronRight size={15} />
                  </button>
                ) : (
                  <button type="button"
                    className="px-7 py-3 rounded-xl text-white text-sm font-black uppercase tracking-widest flex items-center gap-2 hover:opacity-90 transition-all shadow-lg"
                    style={{ backgroundColor: '#10b981', boxShadow: '0 8px 20px -4px #10b98145' }}>
                    <CheckCircle2 size={14} /> Finalizar & Ativar
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ===== COLUNA DIREITA: VERTICAL STEPPER ===== */}
          <div className="xl:col-span-4 bg-slate-900 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
            <div className="absolute bottom-0 right-0 opacity-[0.03] pointer-events-none">
              <Activity size={160} className="text-white" />
            </div>

            {/* Cabeçalho stepper */}
            <div className="mb-5 relative z-10">
              <h3 className="text-base font-black text-white">Lifecycle do Projeto</h3>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex-1 bg-slate-800 h-1 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${progressPct}%`, backgroundColor: brand.primaryColor }} />
                </div>
                <span className="text-[10px] font-black text-slate-500 shrink-0">{progressPct}%</span>
              </div>
            </div>

            {/* Etapas agrupadas */}
            <div className="relative z-10 no-scrollbar overflow-y-auto max-h-[520px] space-y-4 pr-1">
              {groups.map(grp => {
                const stagesInGroup = STAGES.map((s, i) => ({ ...s, i })).filter(s => s.group === grp);
                if (!stagesInGroup.length) return null;
                return (
                  <div key={grp}>
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-600 mb-1.5 px-1">{grp}</p>
                    <div className="relative">

                      {/* Trilha vertical — alinhada ao centro do ícone (w-7 = 28px, centro em 14px; padding-x-3 = 12px → left: 12+14 = 26 → mas usamos left-[25px]) */}
                      <div
                        className="absolute top-[14px] bottom-[14px] w-px z-0"
                        style={{ left: '25px', backgroundColor: `${brand.primaryColor}30` }}
                      />

                      <div className="space-y-0.5">
                        {stagesInGroup.map(({ status, label, i }) => {
                          const isDone = completedSteps.has(i);
                          const isActive = i === currentStep;
                          const isFuture = !isDone && !isActive;

                          return (
                            <button key={i} type="button"
                              onClick={() => handleStepClick(i)}
                              disabled={isFuture}
                              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-left relative z-10
                                ${isActive ? 'bg-white/10' : isDone ? 'hover:bg-white/5' : 'opacity-35 cursor-not-allowed'}`}>

                              {/* Indicador — w-7 h-7 centralizado na trilha */}
                              <div
                                className="w-7 h-7 shrink-0 flex items-center justify-center rounded-full transition-all duration-300 relative z-10"
                                style={isDone
                                  ? { backgroundColor: brand.primaryColor }
                                  : isActive
                                  ? { backgroundColor: brand.primaryColor, boxShadow: `0 0 0 4px ${brand.primaryColor}30` }
                                  : { backgroundColor: '#1e293b', border: '1px solid #2d3f55' }}
                              >
                                {isDone ? (
                                  <CheckCircle2 size={12} className="text-white" />
                                ) : isActive ? (
                                  <>
                                    <div className="w-2 h-2 rounded-full bg-white" />
                                    <div
                                      className="absolute inset-0 rounded-full animate-ping opacity-40"
                                      style={{ backgroundColor: brand.primaryColor }}
                                    />
                                  </>
                                ) : (
                                  <Clock size={11} className="text-slate-600" />
                                )}
                              </div>

                              {/* Label */}
                              <div className="flex-1 min-w-0">
                                <p className={`text-xs font-bold truncate ${
                                  isActive ? 'text-white' : isDone ? 'text-slate-300' : 'text-slate-600'
                                }`}>
                                  {label}
                                </p>
                                {isActive && (
                                  <p className="text-[9px] mt-0.5 font-medium" style={{ color: brand.primaryColor }}>
                                    Ativa
                                  </p>
                                )}
                              </div>

                              <span className="text-[9px] font-black shrink-0" style={{
                                color: isDone ? `${brand.primaryColor}99` : '#475569'
                              }}>
                                {String(i + 1).padStart(2, '0')}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
