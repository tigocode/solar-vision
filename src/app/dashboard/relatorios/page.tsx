'use client';

import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ReportSummaryCards from '@/components/reports/ReportSummaryCards';
import ValidatedAnomaliesTable from '@/components/reports/ValidatedAnomaliesTable';
import ExportAction from '@/components/reports/ExportAction';
import { Anomaly } from '@/types/anomalies';
import { FileBarChart, PieChart, ShieldCheck } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';

import PrintableReport from '@/components/reports/PrintableReport';

// Mocks consolidados para o Painel de Relatórios (Ciclo 7)
const reportAnomalies: Anomaly[] = [
  {
    id: 'VAL-01',
    type: 'Módulo Trincado',
    deltaT: 45.2,
    severity: 'Crítico',
    status: 'Resolvido',
    location: { route: 'RT-01', string: 'ST-01', position: 'superior' },
    irUrl: '', rgbUrl: '',
    boundingBox: { x: 0, y: 0, width: 0, height: 0 },
    createdAt: '2024-01-01', updatedAt: '2024-04-01 10:30'
  },
  {
    id: 'VAL-02',
    type: 'Ponto Quente',
    deltaT: 25.0,
    severity: 'Médio',
    status: 'Em Análise',
    location: { route: 'RT-01', string: 'ST-02', position: 'inferior' },
    irUrl: '', rgbUrl: '',
    boundingBox: { x: 0, y: 0, width: 0, height: 0 },
    createdAt: '2024-01-01', updatedAt: '2024-04-02 09:15'
  },
  {
    id: 'PEN-01', // DEve ser filtrado pela página ou componente (Regra 10)
    type: 'Sujeira',
    deltaT: 5.2,
    severity: 'Baixo',
    status: 'Pendente',
    location: { route: 'RT-01', string: 'ST-03', position: 'superior' },
    irUrl: '', rgbUrl: '',
    boundingBox: { x: 0, y: 0, width: 0, height: 0 },
    createdAt: '2024-01-01', updatedAt: '2024-04-03 08:30'
  },
  {
    id: 'VAL-03',
    type: 'Diodo Bypass Aberto',
    deltaT: 58.4,
    severity: 'Crítico',
    status: 'Resolvido',
    location: { route: 'RT-02', string: 'ST-05', position: 'superior' },
    irUrl: '', rgbUrl: '',
    boundingBox: { x: 0, y: 0, width: 0, height: 0 },
    createdAt: '2024-01-01', updatedAt: '2024-04-03 14:20'
  }
];

function ReportsContent() {
  const componentRef = React.useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Relatorio_SolarVision_${new Date().toISOString().split('T')[0]}`,
  });

  return (
    <>
      <div className="flex flex-col h-full space-y-8 animate-in fade-in duration-700 print:hidden">
        
        {/* HEADER EXECUTIVO DA TELA */}
        <div className="flex flex-col md:flex-row md:items-end justify-between space-y-4 md:space-y-0">
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center">
              <FileBarChart className="mr-3 text-indigo-600" size={32} />
              Painel de Relatórios
            </h1>
            <p className="text-slate-500 font-medium italic">Síntese executiva de diagnósticos validados para o investidor.</p>
          </div>
          
          <div className="flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-2xl border border-green-100">
            <ShieldCheck size={18} className="text-green-600" />
            <span className="text-[10px] font-black text-green-700 uppercase tracking-widest">Snapshot Certificado</span>
          </div>
        </div>

        {/* CARDS DE RESUMO DA TELA */}
        <ReportSummaryCards anomalies={reportAnomalies} />

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          {/* LISTAGEM PRINCIPAL DA TELA */}
          <div className="xl:col-span-8">
             <ValidatedAnomaliesTable anomalies={reportAnomalies} />
          </div>

          {/* COLUNA LATERAL DE AÇÕES */}
          <div className="xl:col-span-4 space-y-8">
            <ExportAction onExportClick={() => handlePrint()} />
            
            {/* GAUGE DE SAÚDE DA USINA DA TELA */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center">
                <PieChart size={14} className="mr-2 text-indigo-500" /> Índice de Integridade
              </h3>
              
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Saúde Operacional</span>
                  <span className="text-lg font-black text-slate-800 tracking-tighter italic">98.4%</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-500 to-indigo-600 w-[98.4%] rounded-full shadow-[0_0_10px_rgba(79,70,229,0.3)]"></div>
                </div>
                <p className="text-[9px] text-slate-500 font-medium italic">Baseado em 2.450 módulos inspecionados.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* COMPONENTE DEVE ESTAR NO DOM PARA IMPRESSÃO MAS ESCONDIDO DA TELA NORMAL */}
      <div className="hidden print:block">
        <PrintableReport ref={componentRef} anomalies={reportAnomalies} />
      </div>
    </>
  );
}

export default function ReportsPage() {
  return (
    <DashboardLayout>
      <ReportsContent />
    </DashboardLayout>
  );
}
