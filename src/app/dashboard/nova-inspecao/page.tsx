'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useBrand } from '@/contexts/BrandContext';
import { UploadCloud, FileImage, FileJson, CheckCircle2, ChevronRight, Activity, Zap, ClipboardList } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ProjectStatus, AssetType, SolarPlant } from '@/types/plants';
import { saveInspection, InspectionRecord } from '@/utils/storage';
import { v4 as uuidv4 } from 'uuid';

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
  const router = useRouter();
  
  // Controle de Abas
  const [step, setStep] = useState<Step>('setup');
  
  // Dados do Formulário (Setup)
  const [selectedPlantId, setSelectedPlantId] = useState('');
  const [operationScope, setOperationScope] = useState(''); // 'ALL' ou o ID da subUnit
  const [inspector, setInspector] = useState('');
  const [date, setDate] = useState('');
  
  // Dados Técnicos (Novos Campos)
  const [envTemp, setEnvTemp] = useState('34');
  const [envWind, setEnvWind] = useState('2.1');
  const [envClouds, setEnvClouds] = useState('Céu Limpo');
  const [envIrradiance, setEnvIrradiance] = useState('950');

  const [cameraModel, setCameraModel] = useState('FLIR Vue Pro R 640');
  const [cameraResolution, setCameraResolution] = useState('640x512px');
  const [droneModel, setDroneModel] = useState('DJI Matrice 300 RTK');
  const [calibrationValidUntil, setCalibrationValidUntil] = useState('2024-12-20');
  const [emissivity, setEmissivity] = useState('0.95');
  const [reflectedTemp, setReflectedTemp] = useState('20');

  const [technique, setTechnique] = useState('Termografia Passiva');
  const [viewAngle, setViewAngle] = useState('90');
  const [standards, setStandards] = useState('ABNT NBR 15572 / ASTM E1213');

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
    if (!selectedPlantId || !inspector || !date) return;
    
    // REGISTRO NO LOCAL STORAGE
    const newInspection: InspectionRecord = {
      id: `H-NEW-${Math.floor(Math.random() * 1000)}`,
      unitId: selectedPlantId,
      unitName: selectedPlant?.name || 'Usina desconhecida',
      date: new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }),
      inspector: inspector,
      status: 'Aguardando Upload',
      timestamp: Date.now(),
      technicalData: {
        envTemp, envWind, envClouds, envIrradiance,
        cameraModel, cameraResolution, droneModel, calibrationValidUntil, emissivity, reflectedTemp,
        technique, viewAngle, standards
      }
    };
    
    saveInspection(newInspection);
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
          <p className="text-slate-500 font-medium italic">Preencha os dados técnicos da operação para o relatório normativo.</p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-8 md:p-12 min-h-[500px] flex flex-col justify-center">

          {/* FASE 1: CONFIGURAÇÃO E UPLOAD */}
          {step === 'setup' && (
            <form onSubmit={handleStartProcessing} className="space-y-10 animate-in fade-in zoom-in-95 duration-500">
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className={`space-y-2 ${isComplex ? 'lg:col-span-2' : 'lg:col-span-1'}`}>
                  <label htmlFor="plant-select" className="text-sm font-bold text-slate-700">Seleção de Ativo (Usina)</label>
                  <select 
                    id="plant-select"
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
                     <label htmlFor="operation-scope" className="text-sm font-bold text-slate-700">Escopo da Operação no Complexo</label>
                     <select 
                       id="operation-scope"
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
                  <label htmlFor="inspection-date" className="text-sm font-bold text-slate-700">Data da Inspeção</label>
                  <input 
                    id="inspection-date"
                    type="date" required 
                    value={date} onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                  />
                </div>
                <div className={`${isComplex ? 'lg:col-span-2' : 'lg:col-span-2'} space-y-2`}>
                  <label htmlFor="inspector-name" className="text-sm font-bold text-slate-700">Responsável Técnico</label>
                  <input 
                    id="inspector-name"
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

              {/* SEÇÕES TÉCNICAS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-4 border-t border-slate-100">
                
                {/* AMBIENTE */}
                <div className="space-y-6">
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center border-b border-slate-100 pb-2">
                    <Activity size={16} className="mr-2 text-primary" /> Condições Ambientais
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="env-temp" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Temperatura (°C)</label>
                      <input id="env-temp" type="number" required value={envTemp} onChange={(e) => setEnvTemp(e.target.value)} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="env-wind" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Vento (m/s)</label>
                      <input id="env-wind" type="text" required value={envWind} onChange={(e) => setEnvWind(e.target.value)} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="env-clouds" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nuvens (Céu)</label>
                      <input id="env-clouds" type="text" required value={envClouds} onChange={(e) => setEnvClouds(e.target.value)} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="env-irrad" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Irradiância (W/m²)</label>
                      <input id="env-irrad" type="number" value={envIrradiance} onChange={(e) => setEnvIrradiance(e.target.value)} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold" />
                    </div>
                  </div>
                </div>

                {/* EQUIPAMENTOS */}
                <div className="space-y-6">
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center border-b border-slate-100 pb-2">
                    <Zap size={16} className="mr-2 text-primary" /> Equipamentos Utilizados
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="drone-model" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Drone</label>
                        <input id="drone-model" type="text" required value={droneModel} onChange={(e) => setDroneModel(e.target.value)} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold" />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="camera-model" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Câmera</label>
                        <input id="camera-model" type="text" required value={cameraModel} onChange={(e) => setCameraModel(e.target.value)} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="cam-res" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Resolução</label>
                        <input id="cam-res" type="text" required value={cameraResolution} onChange={(e) => setCameraResolution(e.target.value)} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold" />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="calib-valid" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Validade Calibração</label>
                        <input id="calib-valid" type="date" required value={calibrationValidUntil} onChange={(e) => setCalibrationValidUntil(e.target.value)} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* PROCEDIMENTO */}
                <div className="md:col-span-2 space-y-6">
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center border-b border-slate-100 pb-2">
                    <ClipboardList size={16} className="mr-2 text-primary" /> Procedimento de Inspeção
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="proc-tech" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Técnica Aplicada</label>
                      <input id="proc-tech" type="text" required value={technique} onChange={(e) => setTechnique(e.target.value)} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="view-angle" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ângulo de Visão</label>
                      <input id="view-angle" type="text" required value={viewAngle} onChange={(e) => setViewAngle(e.target.value)} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="applied-norms" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Normas Aplicadas</label>
                      <input id="applied-norms" type="text" required value={standards} onChange={(e) => setStandards(e.target.value)} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-8 flex justify-end border-t border-slate-100">
                <button
                  type="submit"
                  disabled={!selectedPlantId || !inspector || !date || !envTemp || !envWind || !envClouds || !cameraModel || !droneModel || !technique}
                  className="px-8 py-4 bg-primary text-white text-sm font-black uppercase tracking-widest rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:opacity-90 transition-all disabled:opacity-50 disabled:shadow-none flex items-center"
                >
                  Registrar Inspeção <ChevronRight className="ml-2" size={18} />
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

               <div className="pt-8 flex gap-4">
                 <Link 
                   href="/dashboard/upload"
                   className="px-8 py-4 bg-slate-900 text-white text-sm font-black uppercase tracking-widest rounded-xl shadow-lg hover:bg-slate-800 transition-all inline-flex items-center"
                 >
                   Fazer Upload das Imagens <ChevronRight className="ml-2" size={18} />
                 </Link>
                 <Link 
                   href="/dashboard/diagnostico"
                   className="px-8 py-4 text-white text-sm font-black uppercase tracking-widest rounded-xl shadow-lg hover:opacity-90 transition-all inline-flex items-center"
                   style={{ backgroundColor: brand.primaryColor, boxShadow: `0 10px 15px -3px ${brand.primaryColor}40` }}
                 >
                   Ir para Diagnóstico <ChevronRight className="ml-2" size={18} />
                 </Link>
               </div>
            </div>
          )}

        </div>
      </div>
    </DashboardLayout>
  );
}
