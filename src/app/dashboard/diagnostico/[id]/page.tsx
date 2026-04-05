'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Anomaly } from '@/types/anomalies';
import SeverityBadge from '@/components/diagnostics/SeverityBadge';
import { 
  ChevronRight, 
  ArrowLeft, 
  MapPin, 
  Thermometer, 
  Box, 
  Maximize2, 
  Clock,
  Layers
} from 'lucide-react';
import Link from 'next/link';

// Mocks temporários (No Ciclo 5 buscaremos de uma API/Contexto)
const mockAnomalies: Anomaly[] = [
  {
    id: 'PT-01',
    type: 'Módulo Trincado',
    deltaT: 45.2,
    severity: 'Crítico',
    status: 'Pendente',
    location: { route: 'RT-01', string: 'ST-01', position: 'superior' },
    coordinates: { lat: -8.1245, lng: -34.9081 },
    imageUrls: { thermal: '', visual: '' },
    boundingBox: {
      thermal: { x: 0.4, y: 0.35, width: 0.15, height: 0.2 },
      visual: { x: 0.4, y: 0.35, width: 0.15, height: 0.2 },
    },
    createdAt: '2024-01-01 10:30',
    updatedAt: '2024-01-01 10:30',
  },
  {
    id: 'PT-09',
    type: 'Sombreamento',
    deltaT: 5.2,
    severity: 'Baixo',
    status: 'Em Análise',
    location: { route: 'RT-02', string: 'ST-04', position: 'superior' },
    affectedArea: 18.5,
    coordinates: { lat: -8.1255, lng: -34.9087 },
    imageUrls: { thermal: '', visual: '' },
    boundingBox: {
      thermal: { x: 0.2, y: 0.2, width: 0.1, height: 0.1 },
      visual: { x: 0.2, y: 0.2, width: 0.1, height: 0.1 },
    },
    createdAt: '2024-01-02 09:15',
    updatedAt: '2024-01-02 09:15',
  }
];

function AnomalyDetailContent() {
  const { id } = useParams();
  const router = useRouter();
  
  // Busca a anomalia pelo ID (ou usa a primeira como fallback para o demo)
  const anomaly = mockAnomalies.find(a => a.id === id) || mockAnomalies[0];

  return (
    <div className="animate-in slide-in-from-bottom-4 duration-500 flex flex-col h-full space-y-6">
      
      {/* NAVEGAÇÃO E BREADCRUMBS */}
      <div className="flex flex-col space-y-4">
        <nav className="flex items-center space-x-2 text-xs font-medium text-slate-400">
          <Link href="/dashboard" className="hover:text-amber-600 transition-colors">Projetos</Link>
          <ChevronRight size={12} />
          <Link href="/dashboard/diagnostico" className="hover:text-amber-600 transition-colors">Diagnóstico</Link>
          <ChevronRight size={12} />
          <span className="text-slate-800 font-bold">Detalhe {anomaly.id}</span>
        </nav>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => router.back()}
              className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight">Anomalia {anomaly.id}</h1>
              <p className="text-sm text-slate-500 font-medium">{anomaly.type}</p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ring-1 ring-inset ${
              anomaly.status === 'Resolvido' ? 'bg-green-50 text-green-700 ring-green-600/20' : 'bg-amber-50 text-amber-700 ring-amber-600/20'
            }`}>
              Status: {anomaly.status}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        
        {/* LADO ESQUERDO: Visualizador Digital Twin (Regra 5) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 aspect-video flex flex-col relative group">
            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 pointer-events-none">
              <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center animate-pulse border border-slate-700">
                <Maximize2 size={32} className="text-slate-500" />
              </div>
              <p className="text-slate-500 text-sm font-medium italic">Aguardando sincronização de imagens IR/RGB</p>
              <p className="text-[10px] text-slate-600 tracking-widest uppercase font-bold">Ciclo 5: Digital Twin Engine</p>
            </div>
            
            {/* Toolbar do Visualizador (Placeholder) */}
            <div className="mt-auto p-4 bg-slate-800/40 backdrop-blur-md border-t border-slate-700/50 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex space-x-2">
                <div className="px-3 py-1 bg-slate-700 rounded text-[10px] text-white font-bold">TÉRMICO (IR)</div>
                <div className="px-3 py-1 bg-slate-900/50 rounded text-[10px] text-slate-400 font-bold border border-slate-700">VISUAL (RGB)</div>
              </div>
              <div className="flex space-x-2 text-slate-400">
                <div className="w-6 h-6 rounded bg-slate-700 flex items-center justify-center cursor-pointer hover:bg-slate-600 transition-colors">1x</div>
                <div className="w-6 h-6 rounded bg-slate-700 flex items-center justify-center cursor-pointer hover:bg-slate-600 transition-colors opacity-50"><Layers size={14} /></div>
              </div>
            </div>
          </div>

          {/* Card de Detalhes Adicionais */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Detectado em</p>
              <div className="flex items-center text-slate-700 font-semibold text-sm">
                <Clock size={14} className="mr-2 text-slate-400" /> {anomaly.createdAt}
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Atualizado em</p>
              <p className="text-slate-700 font-semibold text-sm">{anomaly.updatedAt}</p>
            </div>
          </div>
        </div>

        {/* LADO DIREITO: Informações Técnicas e Localização */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Card de Severidade */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center">
              <Thermometer size={14} className="mr-2 text-amber-500" /> Diagnóstico de Temperatura
            </h3>
            
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Delta de Temperatura</p>
                <p className="text-2xl font-black text-slate-800">+{anomaly.deltaT.toFixed(1)}°C</p>
              </div>
              <SeverityBadge severity={anomaly.severity} />
            </div>

            {anomaly.type === 'Sombreamento' && anomaly.affectedArea && (
              <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 flex items-center space-x-3">
                <Box size={24} className="text-blue-500" />
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Área Afetada (Regra 8)</p>
                  <p className="text-sm font-black text-blue-800">{anomaly.affectedArea}% do módulo</p>
                </div>
              </div>
            )}
          </div>

          {/* Card de Localização Hierárquica (Regra 9) */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center">
              <MapPin size={14} className="mr-2 text-blue-500" /> Localização do Ativo
            </h3>
            
            <div className="divide-y divide-slate-100 italic-titles">
              <div className="py-3 flex justify-between items-center">
                <span className="text-xs text-slate-500 font-medium italic">Rota (Cluster)</span>
                <span className="text-sm font-bold text-slate-800 bg-slate-100 px-2 py-1 rounded text-mono">{anomaly.location.route}</span>
              </div>
              <div className="py-3 flex justify-between items-center">
                <span className="text-xs text-slate-500 font-medium italic">String</span>
                <span className="text-sm font-bold text-slate-800 bg-slate-100 px-2 py-1 rounded text-mono">{anomaly.location.string}</span>
              </div>
              <div className="py-3 flex justify-between items-center">
                <span className="text-xs text-slate-500 font-medium italic">Posição do Módulo</span>
                <span className={`text-[10px] font-black uppercase px-2 py-1 rounded ${
                  anomaly.location.position === 'superior' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-700'
                }`}>
                  {anomaly.location.position}
                </span>
              </div>
            </div>
            
            {anomaly.coordinates && (
              <div className="pt-4 border-t border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Coordenadas Reais (GPS)</p>
                <div className="p-3 bg-slate-50 rounded-lg text-[11px] font-mono text-slate-500 flex items-center justify-center border border-slate-100">
                  LAT: {anomaly.coordinates.lat.toFixed(6)} | LNG: {anomaly.coordinates.lng.toFixed(6)}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default function AnomalyDetailPage() {
  return (
    <DashboardLayout>
      <AnomalyDetailContent />
    </DashboardLayout>
  );
}
