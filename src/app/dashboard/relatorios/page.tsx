'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ReportSummaryCards from '@/components/reports/ReportSummaryCards';
import ValidatedAnomaliesTable from '@/components/reports/ValidatedAnomaliesTable';
import ExportAction from '@/components/reports/ExportAction';
import { Anomaly } from '@/types/anomalies';
import { FileBarChart, PieChart, ShieldCheck, LayoutTemplate, ChevronDown, Eye, X } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';

import { mockTemplates } from '@/services/mocks/templates';
import EditorCanvas from '@/components/reports/editor/EditorCanvas';

// Mocks consolidados para o Painel de Relatórios
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
  const [selectedTemplateId, setSelectedTemplateId] = useState(mockTemplates[0].id);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  const selectedTemplate = mockTemplates.find(t => t.id === selectedTemplateId) || mockTemplates[0];

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Relatorio_SolarVision_${new Date().toISOString().split('T')[0]}`,
    onBeforeGetContent: () => {
      return new Promise((resolve) => {
        // Verifica se todas as imagens no contêiner estão carregadas
        const images = componentRef.current?.querySelectorAll('img');
        if (!images || images.length === 0) {
          setTimeout(resolve, 300);
          return;
        }

        let loadedCount = 0;
        const totalImages = images.length;

        const checkImages = () => {
          loadedCount = 0;
          images.forEach(img => {
            if (img.complete && img.naturalWidth > 0) loadedCount++;
          });

          if (loadedCount === totalImages) {
            resolve();
          } else {
            setTimeout(checkImages, 100);
          }
        };

        checkImages();
        
        // Timeout de segurança para não travar a UI infinitamente
        setTimeout(resolve, 2000);
      });
    }
  });

  return (
    <>
      <div className="flex flex-col h-full space-y-8 animate-in fade-in duration-700 print:hidden pb-20">
        
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

        {/* SELETOR DE TEMPLATE / PREVIEW ACTION */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
             <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
                <LayoutTemplate size={24} />
             </div>
             <div>
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Configuração do Documento</h3>
                <p className="text-[10px] text-slate-500 font-medium italic">Escolha o modelo e verifique os dados antes de exportar.</p>
             </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-4 flex-1 max-w-2xl">
            <div className="relative flex-1 w-full">
              <select 
                value={selectedTemplateId}
                onChange={(e) => setSelectedTemplateId(e.target.value)}
                className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all cursor-pointer"
              >
                {mockTemplates.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>

            <button 
              onClick={() => setIsPreviewOpen(true)}
              className="flex items-center px-6 py-3 bg-slate-900 text-white hover:bg-slate-800 rounded-2xl text-sm font-black uppercase tracking-widest shadow-lg transition-all active:scale-95 shrink-0"
            >
              <Eye size={18} className="mr-2" /> Pré-visualizar
            </button>
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
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL DE PREVIEW */}
      {isPreviewOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-5xl h-[90vh] rounded-[40px] shadow-2xl flex flex-col overflow-hidden relative border border-white/20">
              <div className="p-6 bg-slate-900 flex justify-between items-center text-white">
                <div className="flex items-center space-x-3">
                  <LayoutTemplate className="text-amber-400" />
                  <div>
                    <h2 className="font-black text-lg uppercase tracking-tight italic">Pré-visualização do Relatório</h2>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Layout: {selectedTemplate.name}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsPreviewOpen(false)}
                  className="p-2 bg-slate-800 hover:bg-red-500 transition-colors rounded-xl text-white"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 bg-slate-200 overflow-y-auto p-12 flex flex-col items-center space-y-12">
                 {selectedTemplate.pages.map((_, idx) => (
                   <div key={idx} className="bg-white shadow-2xl origin-top rounded-sm overflow-hidden min-h-[730px]">
                      <EditorCanvas 
                        template={selectedTemplate}
                        currentPageIndex={idx}
                        setCurrentPageIndex={() => {}}
                        zoom={65} 
                        setZoom={() => {}}
                        selectedBlockId={null}
                        setSelectedBlockId={() => {}}
                        onUpdateBlockGeometry={() => {}}
                        onAddPage={() => {}}
                        isPreview={true}
                        hideUI={true}
                        anomalies={reportAnomalies}
                      />
                   </div>
                 ))}
              </div>

              <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end gap-4">
                 <button 
                   onClick={() => setIsPreviewOpen(false)}
                   className="px-6 py-2 bg-slate-200 text-slate-600 font-black rounded-xl uppercase text-xs tracking-widest hover:bg-slate-300 transition-all"
                 >
                   Fichar
                 </button>
                 <button 
                   onClick={() => { setIsPreviewOpen(false); handlePrint(); }}
                   className="px-8 py-2 bg-indigo-600 text-white font-black rounded-xl uppercase text-xs tracking-widest hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 transition-all active:scale-95"
                 >
                   Confirmar e Gerar PDF
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* COMPONENTE DEVE ESTAR NO DOM PARA IMPRESSÃO MAS ESCONDIDO DA TELA NORMAL (OFF-SCREEN) */}
      <div className="opacity-0 pointer-events-none absolute -left-[9999px] print:static print:opacity-100 print:overflow-visible overflow-visible h-auto">
        <div ref={componentRef}>
           <div className="flex flex-col space-y-0">
             <style type="text/css" media="print">
               {`
                 @page { size: A4 portrait; margin: 0; }
                 body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
                 .print-page { page-break-after: always; overflow: hidden; height: 1123px; width: 794px; position: relative; }
               `}
             </style>
             {selectedTemplate.pages.map((_, pageIdx) => (
               <div key={pageIdx} className="print-page">
                 <EditorCanvas 
                    template={selectedTemplate}
                    currentPageIndex={pageIdx}
                    setCurrentPageIndex={() => {}}
                    zoom={100}
                    setZoom={() => {}}
                    selectedBlockId={null}
                    setSelectedBlockId={() => {}}
                    onUpdateBlockGeometry={() => {}}
                    onAddPage={() => {}}
                    isPreview={true}
                    hideUI={true}
                    anomalies={reportAnomalies}
                 />
               </div>
             ))}
           </div>
        </div>
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
