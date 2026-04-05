'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import AnomalyTable from '@/components/diagnostics/AnomalyTable';
import { Anomaly } from '@/types/anomalies';
import { useUI } from '@/hooks/useUI';
import { FileText, Copy } from 'lucide-react';

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
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: 'PT-05',
    type: 'Ponto Quente',
    deltaT: 18.5,
    severity: 'Médio',
    status: 'Em Análise',
    location: { route: 'RT-01', string: 'ST-02', position: 'inferior' },
    coordinates: { lat: -8.1250, lng: -34.9083 },
    imageUrls: { thermal: '', visual: '' },
    boundingBox: {
      thermal: { x: 0.5, y: 0.5, width: 0.1, height: 0.1 },
      visual: { x: 0.5, y: 0.5, width: 0.1, height: 0.1 },
    },
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: 'PT-07',
    type: 'Sujeira',
    deltaT: 8.1,
    severity: 'Baixo',
    status: 'Resolvido',
    location: { route: 'RT-02', string: 'ST-04', position: 'superior' },
    coordinates: { lat: -8.1252, lng: -34.9085 },
    imageUrls: { thermal: '', visual: '' },
    boundingBox: {
      thermal: { x: 0.2, y: 0.2, width: 0.1, height: 0.1 },
      visual: { x: 0.2, y: 0.2, width: 0.1, height: 0.1 },
    },
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
];

function DiagnosticoContent() {
  const [selectedAnomaly, setSelectedAnomaly] = useState<Anomaly>(mockAnomalies[0]);
  const { viewMode } = useUI();

  return (
    <div className="animate-in fade-in duration-500 flex flex-col h-full">
      {/* Cabeçalho da Página */}
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Diagnóstico & Relatório Técnico</h1>
          {viewMode === 'operator' && (
            <p className="text-sm text-slate-500 mt-1">Inspeção padrão IEC TS 62446-3 concluída.</p>
          )}
        </div>
        
        <div className="flex space-x-3">
          <button className="flex items-center px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-bold shadow-sm hover:bg-slate-50 transition-colors">
            <Copy size={16} className="mr-2" /> Copiar Link
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-blue-700 transition-colors">
            <FileText size={16} className="mr-2" /> Gerar Relatório
          </button>
        </div>
      </div>

      {/* Layout Principal: Imagens (Placeholder) + Tabela */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        
        {/* LADO ESQUERDO: Visualizador (Futuro Ciclo 4) */}
        <div className="lg:col-span-7 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden min-h-[400px]">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <span className="text-sm font-bold text-slate-700">Visualizador Digital Twin</span>
            <span className="text-xs text-slate-500">ID Selecionado: {selectedAnomaly.id}</span>
          </div>
          <div className="flex-1 bg-slate-900 flex items-center justify-center text-slate-500 text-sm italic">
            O visualizador de imagens sincronizadas será implementado no Ciclo 4.
          </div>
        </div>

        {/* LADO DIREITO: Tabela de Anomalias */}
        <div className="lg:col-span-5 min-h-0">
          <AnomalyTable 
            anomalies={mockAnomalies} 
            selectedId={selectedAnomaly.id}
            onSelect={setSelectedAnomaly}
          />
        </div>
      </div>
    </div>
  );
}

export default function DiagnosticoPage() {
  return (
    <DashboardLayout>
      <DiagnosticoContent />
    </DashboardLayout>
  );
}
