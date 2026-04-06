'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import AnomalyTable from '@/components/diagnostics/AnomalyTable';
import DiagnosticToolbar from '@/components/diagnostics/DiagnosticToolbar';
import { Anomaly, Severity, AnomalyStatus } from '@/types/anomalies';
import { useUI } from '@/hooks/useUI';
import { FileText, Copy, BarChart3 } from 'lucide-react';

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
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: 'PT-02',
    type: 'Ponto Quente',
    deltaT: 28.5,
    severity: 'Médio',
    status: 'Em Análise',
    location: { route: 'RT-01', string: 'ST-02', position: 'inferior' },
    irUrl: '/imagem.example.jpeg',
    rgbUrl: '/imagem.example.jpeg',
    boundingBox: { x: 0.5, y: 0.5, width: 0.1, height: 0.1 },
    createdAt: '2024-01-02',
    updatedAt: '2024-01-02',
  },
  {
    id: 'PT-03',
    type: 'Sujeira',
    deltaT: 5.1,
    severity: 'Baixo',
    status: 'Resolvido',
    location: { route: 'RT-02', string: 'ST-04', position: 'superior' },
    irUrl: '/imagem.example.jpeg',
    rgbUrl: '/imagem.example.jpeg',
    boundingBox: { x: 0.2, y: 0.2, width: 0.1, height: 0.1 },
    createdAt: '2024-01-03',
    updatedAt: '2024-01-03',
  },
  {
    id: 'PT-04',
    type: 'Sombreamento',
    deltaT: 3.2,
    severity: 'Baixo',
    status: 'Falso Positivo',
    location: { route: 'RT-03', string: 'ST-01', position: 'superior' },
    affectedArea: 15.0,
    irUrl: '/imagem.example.jpeg',
    rgbUrl: '/imagem.example.jpeg',
    boundingBox: { x: 0.1, y: 0.1, width: 0.1, height: 0.1 },
    createdAt: '2024-01-04',
    updatedAt: '2024-01-04',
  },
  {
    id: 'PT-05',
    type: 'Diodo Bypass Aberto',
    deltaT: 55.4,
    severity: 'Crítico',
    status: 'Em Análise',
    location: { route: 'RT-01', string: 'ST-05', position: 'superior' },
    irUrl: '/imagem.example.jpeg',
    rgbUrl: '/imagem.example.jpeg',
    boundingBox: { x: 0.3, y: 0.3, width: 0.1, height: 0.1 },
    createdAt: '2024-01-05',
    updatedAt: '2024-01-05',
  },
  {
    id: 'PT-06',
    type: 'PID Incipiente',
    deltaT: 12.8,
    severity: 'Médio',
    status: 'Pendente',
    location: { route: 'RT-02', string: 'ST-01', position: 'inferior' },
    irUrl: '/imagem.example.jpeg',
    rgbUrl: '/imagem.example.jpeg',
    boundingBox: { x: 0.6, y: 0.6, width: 0.1, height: 0.1 },
    createdAt: '2024-01-06',
    updatedAt: '2024-01-06',
  },
  {
    id: 'PT-07',
    type: 'String Inativa',
    deltaT: 62.1,
    severity: 'Crítico',
    status: 'Resolvido',
    location: { route: 'RT-04', string: 'ST-02', position: 'superior' },
    irUrl: '/imagem.example.jpeg',
    rgbUrl: '/imagem.example.jpeg',
    boundingBox: { x: 0.7, y: 0.7, width: 0.1, height: 0.1 },
    createdAt: '2024-01-07',
    updatedAt: '2024-01-07',
  },
  {
    id: 'PT-08',
    type: 'Módulo em Curto',
    deltaT: 48.9,
    severity: 'Crítico',
    status: 'Falso Positivo',
    location: { route: 'RT-01', string: 'ST-08', position: 'inferior' },
    irUrl: '/imagem.example.jpeg',
    rgbUrl: '/imagem.example.jpeg',
    boundingBox: { x: 0.8, y: 0.8, width: 0.1, height: 0.1 },
    createdAt: '2024-01-08',
    updatedAt: '2024-01-08',
  },
  {
    id: 'PT-09',
    type: 'Sujeira Pesada',
    deltaT: 7.4,
    severity: 'Baixo',
    status: 'Em Análise',
    location: { route: 'RT-05', string: 'ST-01', position: 'superior' },
    irUrl: '/imagem.example.jpeg',
    rgbUrl: '/imagem.example.jpeg',
    boundingBox: { x: 0.9, y: 0.1, width: 0.1, height: 0.1 },
    createdAt: '2024-01-09',
    updatedAt: '2024-01-09',
  },
  {
    id: 'PT-10',
    type: 'Ponto Quente Múltiplo',
    deltaT: 32.6,
    severity: 'Médio',
    status: 'Resolvido',
    location: { route: 'RT-02', string: 'ST-09', position: 'superior' },
    irUrl: '/imagem.example.jpeg',
    rgbUrl: '/imagem.example.jpeg',
    boundingBox: { x: 0.1, y: 0.9, width: 0.1, height: 0.1 },
    createdAt: '2024-01-10',
    updatedAt: '2024-01-10',
  }
];

function DiagnosticoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { viewMode } = useUI();

  // Parâmetros da URL
  const query = searchParams.get('q') || '';
  const severityFilter = searchParams.getAll('severity') as Severity[];
  const statusFilter = searchParams.get('status') ? [searchParams.get('status') as AnomalyStatus] : [];

  // Filtra a lista baseada nos parâmetros da URL (A Lógica de Ouro - Ciclo 8)
  const filteredAnomalies = useMemo(() => {
    return mockAnomalies.filter(anomaly => {
      const matchesQuery = query === '' || 
        anomaly.id.toLowerCase().includes(query.toLowerCase()) ||
        anomaly.type.toLowerCase().includes(query.toLowerCase());
      
      const matchesSeverity = severityFilter.length === 0 || 
        severityFilter.includes(anomaly.severity);
      
      const matchesStatus = statusFilter.length === 0 || 
        statusFilter.includes(anomaly.status);

      return matchesQuery && matchesSeverity && matchesStatus;
    });
  }, [query, severityFilter, statusFilter]);

  // Gerenciamento de Seleção (Sincronizado com a lista filtrada)
  const [selectedAnomaly, setSelectedAnomaly] = useState<Anomaly>(mockAnomalies[0]);
  
  // Se a anomalia selecionada for filtrada, seleciona a primeira disponível na lista filtrada
  React.useEffect(() => {
    if (filteredAnomalies.length > 0 && !filteredAnomalies.some(a => a.id === selectedAnomaly.id)) {
      setSelectedAnomaly(filteredAnomalies[0]);
    }
  }, [filteredAnomalies, selectedAnomaly.id]);

  // Handlers para os filtros (Atualização da URL)
  const createQueryString = useCallback(
    (name: string, value: string, operation: 'add' | 'remove' | 'set' = 'set') => {
      const params = new URLSearchParams(searchParams.toString());
      
      if (operation === 'add') {
        params.append(name, value);
      } else if (operation === 'remove') {
        const existing = params.getAll(name).filter(v => v !== value);
        params.delete(name);
        existing.forEach(v => params.append(name, v));
      } else if (operation === 'set') {
        if (value) params.set(name, value);
        else params.delete(name);
      }
      
      return params.toString();
    },
    [searchParams]
  );

  const handleSearch = (q: string) => {
    const qs = createQueryString('q', q);
    router.push(`${pathname}?${qs}`);
  };

  const handleFilterChange = (type: 'severity' | 'status', value: string) => {
    let qs = '';
    if (type === 'severity') {
      const currentSeverities = searchParams.getAll('severity');
      if (currentSeverities.includes(value)) {
        qs = createQueryString('severity', value, 'remove');
      } else {
        qs = createQueryString('severity', value, 'add');
      }
    } else {
      qs = createQueryString('status', value);
    }
    router.push(`${pathname}?${qs}`);
  };

  const handleClear = () => {
    router.push(pathname);
  };

  return (
    <div className="animate-in fade-in duration-500 flex flex-col h-full">
      {/* Cabeçalho da Página */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center">
            <BarChart3 className="mr-3 text-indigo-600" size={24} />
            Diagnóstico & Relatório Técnico
          </h1>
          {viewMode === 'operator' && (
            <p className="text-sm text-slate-500 mt-1">
              <span className="font-bold text-slate-800">{mockAnomalies.length}</span> anomalias processadas pela IA. 
              {filteredAnomalies.length < mockAnomalies.length && (
                <span className="ml-1 text-indigo-600 font-bold italic">({filteredAnomalies.length} filtradas)</span>
              )}
            </p>
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

      {/* TOOLBAR DE FILTROS (Ciclo 8) */}
      <DiagnosticToolbar 
        searchQuery={query}
        onSearch={handleSearch}
        activeFilters={{
          severity: severityFilter,
          status: statusFilter
        }}
        onFilterChange={handleFilterChange}
        onClear={handleClear}
      />

      {/* Layout Principal: Imagens + Tabela */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        
        {/* LADO ESQUERDO: Visualizador Digital Twin */}
        <div className="lg:col-span-7 flex flex-col overflow-hidden min-h-[450px]">
           <div className="flex-1 bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-lg relative group">
              <div className="absolute top-4 left-4 z-10 px-2 py-0.5 bg-indigo-600 text-white text-[10px] font-black rounded uppercase">
                Foco: {selectedAnomaly.id}
              </div>
              
              <div className="flex items-center justify-center h-full text-slate-500 text-sm italic">
                {/* O Visualizador real do Ciclo 5 seria inserido aqui */}
                <p>Visualizador Sincronizado Digital Twin (Ref. {selectedAnomaly.id})</p>
              </div>
           </div>
        </div>

        {/* LADO DIREITO: Tabela de Anomalias */}
        <div className="lg:col-span-5 min-h-0">
          <AnomalyTable 
            anomalies={filteredAnomalies} 
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
