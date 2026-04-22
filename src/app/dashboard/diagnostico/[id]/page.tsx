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
  Clock
} from 'lucide-react';
import Link from 'next/link';

import AnomalyVisualizer from '@/components/diagnostics/AnomalyVisualizer';
import AnomalyActions from '@/components/diagnostics/AnomalyActions';

// Mocks temporários (No Ciclo 5 buscaremos de uma API/Contexto)
const mockAnomalies: Anomaly[] = [
  {
    id: 'PT-01',
    type: 'Módulo Trincado',
    deltaT: 45.2,
    severity: 'Crítico',
    status: 'Pendente',
    location: { route: 'RT-01', string: 'ST-01', position: 'superior' },
    irUrl: '/imagem.example.jpeg',
    rgbUrl: '/imagem.example.jpeg',
    boundingBox: { x: 0.4, y: 0.35, width: 0.15, height: 0.2 },
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
    irUrl: '/imagem.example.jpeg',
    rgbUrl: '/imagem.example.jpeg',
    boundingBox: { x: 0.2, y: 0.2, width: 0.1, height: 0.1 },
    createdAt: '2024-01-02 09:15',
    updatedAt: '2024-01-02 09:15',
  }
];

function AnomalyDetailContent() {
  const { id } = useParams();
  const router = useRouter();

  // Busca a anomalia pelo ID (ou usa a primeira como fallback para o demo)
  const anomalyBase = mockAnomalies.find(a => a.id === id) || mockAnomalies[0];

  // Estado local para o demo para refletir mudanças de status na UI
  const [currentStatus, setCurrentStatus] = React.useState(anomalyBase.status);

  return (
    <div className="animate-in slide-in-from-bottom-4 duration-500 flex flex-col h-full space-y-6">

      {/* NAVEGAÇÃO E BREADCRUMBS */}
      <div className="flex flex-col space-y-4">
        <nav className="flex items-center space-x-2 text-xs font-medium text-slate-400">
          <Link href="/dashboard" className="hover:text-amber-600 transition-colors">Projetos</Link>
          <ChevronRight size={12} />
          <Link href="/dashboard/diagnostico" className="hover:text-amber-600 transition-colors">Diagnóstico</Link>
          <ChevronRight size={12} />
          <span className="text-slate-800 font-bold">Detalhe {anomalyBase.id}</span>
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
              <h1 className="text-2xl font-black text-slate-800 tracking-tight">Anomalia {anomalyBase.id}</h1>
              <p className="text-sm text-slate-500 font-medium">{anomalyBase.type}</p>
            </div>
          </div>

          <div className="flex space-x-3">
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ring-1 ring-inset ${currentStatus === 'Resolvido' ? 'bg-green-50 text-green-700 ring-green-600/20' :
                currentStatus === 'Falso Positivo' ? 'bg-amber-50 text-amber-700 ring-amber-600/20' :
                  'bg-blue-50 text-blue-700 ring-blue-600/20'
              }`}>
              Status: {currentStatus}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">

        {/* LADO ESQUERDO: Visualizador Digital Twin (Regra 5) */}
        <div className="lg:col-span-8 space-y-6 flex flex-col">
          <div className="flex-1 min-h-[500px]">
            <AnomalyVisualizer anomaly={anomalyBase} />
          </div>

          {/* Card de Detalhes Adicionais */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Detectado em</p>
              <div className="flex items-center text-slate-700 font-semibold text-sm">
                <Clock size={14} className="mr-2 text-slate-400" /> {anomalyBase.createdAt}
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Atualizado em</p>
              <p className="text-slate-700 font-semibold text-sm">{anomalyBase.updatedAt}</p>
            </div>
          </div>
        </div>

        {/* LADO DIREITO: Informações Técnicas e Localização */}
        <div className="lg:col-span-4 space-y-6">

          {/* PAINEL DE AÇÕES DO OPERADOR (Regra 3 / Ciclo 6) */}
          <AnomalyActions
            status={currentStatus}
            onStatusChange={setCurrentStatus}
          />

          {/* Card de Severidade */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center">
              <Thermometer size={14} className="mr-2 text-amber-500" /> Diagnóstico de Temperatura
            </h3>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Delta de Temperatura</p>
                <p className="text-2xl font-black text-slate-800">+{anomalyBase.deltaT.toFixed(1)}°C</p>
              </div>
              <SeverityBadge severity={anomalyBase.severity} />
            </div>

            {anomalyBase.type === 'Sombreamento' && anomalyBase.affectedArea && (
              <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 flex items-center space-x-3">
                <Box size={24} className="text-blue-500" />
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Área Afetada (Regra 8)</p>
                  <p className="text-sm font-black text-blue-800">{anomalyBase.affectedArea}% do módulo</p>
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
                <span className="text-sm font-bold text-slate-800 bg-slate-100 px-2 py-1 rounded text-mono">{anomalyBase.location.route}</span>
              </div>
              <div className="py-3 flex justify-between items-center">
                <span className="text-xs text-slate-500 font-medium italic">String</span>
                <span className="text-sm font-bold text-slate-800 bg-slate-100 px-2 py-1 rounded text-mono">{anomalyBase.location.string}</span>
              </div>
              <div className="py-3 flex justify-between items-center">
                <span className="text-xs text-slate-500 font-medium italic">Posição do Módulo</span>
                <span className={`text-[10px] font-black uppercase px-2 py-1 rounded ${anomalyBase.location.position === 'superior' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-700'
                  }`}>
                  {anomalyBase.location.position}
                </span>
              </div>
            </div>

            {anomalyBase.coordinates && (
              <div className="pt-4 border-t border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Coordenadas Reais (GPS)</p>
                <div className="p-3 bg-slate-50 rounded-lg text-[11px] font-mono text-slate-500 flex items-center justify-center border border-slate-100">
                  LAT: {anomalyBase.coordinates.lat.toFixed(6)} | LNG: {anomalyBase.coordinates.lng.toFixed(6)}
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
