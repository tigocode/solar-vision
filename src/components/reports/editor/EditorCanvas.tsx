'use client';

import React from 'react';
import { ZoomIn, ZoomOut, Sun, Map as MapIcon, TableProperties, ChevronLeft, ChevronRight, Plus, ShieldAlert, Camera } from 'lucide-react';
import { Template, EditorBlock } from '@/types/templates';
import EditorBlockWrapper from './EditorBlockWrapper';
import { replacePlaceholders, MOCK_REPORT_DATA, getFilteredAnomalies, IEC_BLOCK_MOCK } from '@/utils/reportData';

interface EditorCanvasProps {
  template: Template;
  currentPageIndex: number;
  setCurrentPageIndex: (idx: number) => void;
  zoom: number;
  setZoom: (zoom: number | ((z: number) => number)) => void;
  selectedBlockId: string | null;
  setSelectedBlockId: (id: string | null) => void;
  onUpdateBlockGeometry: (id: string, data: { x: number, y: number, width: number, height: number }) => void;
  onAddPage: () => void;
  brandLogo?: string;
  isPreview?: boolean;
  hideUI?: boolean;
  anomalies?: any[];
}

export default function EditorCanvas({ 
  template, 
  currentPageIndex,
  setCurrentPageIndex,
  zoom, 
  setZoom, 
  selectedBlockId, 
  setSelectedBlockId,
  onUpdateBlockGeometry,
  onAddPage,
  brandLogo,
  isPreview = false,
  hideUI = false,
  anomalies = []
}: EditorCanvasProps) {
  
  const handleCanvasClick = () => {
    if (!hideUI) setSelectedBlockId(null);
  };

  const renderBlockContent = (block: EditorBlock) => {
    switch (block.type) {
      case 'header':
        return (
          <div className="flex justify-between items-center border-b-2 border-amber-500 pb-4 h-full w-full bg-white select-none overflow-hidden">
            <div className="flex items-center space-x-3 text-slate-800">
              {brandLogo ? (
                <img 
                  src={brandLogo} 
                  alt="Logo" 
                  className="h-10 w-auto object-contain" 
                  {...(brandLogo.startsWith('http') ? { crossOrigin: 'anonymous' } : {})}
                  loading="eager"
                  decoding="sync"
                />
              ) : (
                <>
                  <Sun size={24} className="text-amber-500" />
                  <span className="font-black text-xl tracking-tight">Facilit'Air O&M</span>
                </>
              )}
            </div>
            <div className="text-right">
              <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight italic">Relatório Executivo</h2>
              <div className="bg-slate-50 text-slate-500 text-[9px] px-2 py-1 mt-1 font-mono inline-block rounded border border-slate-200 uppercase font-black">
                Solar Vision Platform
              </div>
            </div>
          </div>
        );
      case 'text':
        return (
          <div className="w-full h-full p-2 flex flex-col justify-center overflow-hidden whitespace-pre-wrap" style={{ 
            textAlign: block.style?.textAlign,
            fontSize: block.style?.fontSize || '12px',
            fontWeight: block.style?.fontWeight || 'normal',
            fontStyle: block.style?.italic ? 'italic' : 'normal',
            lineHeight: block.style?.lineHeight || '1.5'
          }}>
            <p className="text-slate-800">
              {isPreview || hideUI
                ? replacePlaceholders(block.content || '', MOCK_REPORT_DATA) 
                : (block.content || 'Digite seu texto...')}
            </p>
          </div>
        );
      case 'table':
        const filtered = getFilteredAnomalies(anomalies, block.config?.severityFilter);
        return (
          <div 
            data-testid={`table-block-${block.id}`}
            className="w-full h-full border border-slate-200 bg-white flex flex-col rounded-lg overflow-hidden relative shadow-sm"
          >
            <div className="bg-slate-900 p-2 border-b border-slate-800 text-white flex justify-between items-center">
              <span className="text-[10px] font-black uppercase italic tracking-widest">{block.content || 'Tabela de Dados'}</span>
              {block.config?.severityFilter && (
                <span className="bg-amber-500 text-slate-900 text-[8px] font-black px-1.5 py-0.5 rounded italic">
                  FILTRO: {block.config.severityFilter}
                </span>
              )}
            </div>
            <div className={`flex-1 ${block.config?.autoHeight ? '' : 'overflow-auto'}`}>
              <table className="w-full text-left text-[10px] border-collapse">
                <thead className="bg-slate-100 sticky top-0 font-black uppercase text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="p-2">ID</th>
                    <th className="p-2">Severidade</th>
                    <th className="p-2">ΔT</th>
                    <th className="p-2">Status</th>
                  </tr>
                </thead>
                <tbody className="font-medium text-slate-600">
                  {filtered.length > 0 ? filtered.slice(0, 8).map((a: any) => (
                    <tr key={a.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="p-2 font-black text-slate-800">{a.id}</td>
                      <td className="p-2">
                         <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase ${a.severity === 'Crítico' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
                           {a.severity}
                         </span>
                      </td>
                      <td className="p-2 font-black">+{a.deltaT}°C</td>
                      <td className="p-2 italic">{a.status}</td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={4} className="p-4 text-center text-slate-300 italic">Sem dados para este filtro</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'thermal_map':
        // Bloco seguindo a Norma IEC TS 62446-3
        return (
          <div className="w-full h-full bg-white border border-slate-200 rounded-2xl p-4 flex flex-col space-y-4 shadow-sm overflow-hidden">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-2">
               <ShieldAlert size={14} className="text-red-500" />
               <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Norma IEC TS 62446-3: Detalhamento de Anomalia</span>
            </div>
            
            <div className="grid grid-cols-2 gap-3 flex-1">
               <div className="relative rounded-xl overflow-hidden border border-slate-100 group">
                  <img 
                    src={IEC_BLOCK_MOCK.thermalUrl} 
                    alt="Thermal" 
                    className="w-full h-full object-cover transition-transform group-hover:scale-110" 
                    {...(IEC_BLOCK_MOCK.thermalUrl.startsWith('http') ? { crossOrigin: 'anonymous' } : {})}
                    loading="eager"
                    decoding="sync"
                  />
                  <div className="absolute top-2 left-2 bg-red-600/90 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest shadow-xl">Térmica</div>
               </div>
               <div className="relative rounded-xl overflow-hidden border border-slate-100 group">
                  <img 
                    src={IEC_BLOCK_MOCK.rgbUrl} 
                    alt="RGB" 
                    className="w-full h-full object-cover transition-transform group-hover:scale-110" 
                    {...(IEC_BLOCK_MOCK.rgbUrl.startsWith('http') ? { crossOrigin: 'anonymous' } : {})}
                    loading="eager"
                    decoding="sync"
                  />
                  <div className="absolute top-2 left-2 bg-blue-600/90 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest shadow-xl">Visual (RGB)</div>
               </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-auto">
               <div className="bg-slate-50 p-2 rounded-xl flex flex-col items-center justify-center border border-slate-100">
                  <span className="text-[7px] font-black text-slate-400 uppercase">Severidade</span>
                  <span className="text-xs font-black text-red-600">{IEC_BLOCK_MOCK.severity}</span>
               </div>
               <div className="bg-slate-50 p-2 rounded-xl flex flex-col items-center justify-center border border-slate-100">
                  <span className="text-[7px] font-black text-slate-400 uppercase">Delta T</span>
                  <span className="text-xs font-black text-slate-800">+{IEC_BLOCK_MOCK.deltaT}°C</span>
               </div>
               <div className="bg-slate-50 p-2 rounded-xl flex flex-col items-center justify-center border border-slate-100">
                  <span className="text-[7px] font-black text-slate-400 uppercase">Localização</span>
                  <span className="text-[9px] font-black text-slate-600 truncate w-full text-center">{IEC_BLOCK_MOCK.location}</span>
               </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="w-full h-full border border-dashed border-slate-200 flex items-center justify-center">
            <span className="text-[10px] text-slate-400 uppercase font-black">{block.type}</span>
          </div>
        );
    }
  };

  return (
    <div 
      className={`flex-1 bg-slate-100 overflow-auto flex flex-col items-center relative cursor-default scroll-smooth ${hideUI ? 'py-0 h-auto' : 'py-20'}`}
      style={{ 
        backgroundImage: hideUI ? 'none' : 'radial-gradient(#cbd5e1 1px, transparent 1px)', 
        backgroundSize: '30px 30px'
      }}
      onClick={handleCanvasClick}
    >
      {/* Dynamic Controls Overlay - Hidden in Print/HideUI mode */}
      {!hideUI && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center space-x-4 z-50">
          {/* Zoom Controls */}
          <div className="bg-slate-800 text-white rounded-full shadow-2xl flex items-center px-4 py-2 space-x-6 animate-in slide-in-from-bottom-4 duration-500">
            <button 
              onClick={(e) => { e.stopPropagation(); setZoom(z => Math.max(25, z - 10)); }} 
              className="hover:text-amber-400 transition-colors"
            >
              <ZoomOut size={18} />
            </button>
            <span className="text-xs font-black tracking-widest w-12 text-center">{zoom}%</span>
            <button 
              onClick={(e) => { e.stopPropagation(); setZoom(z => Math.min(150, z + 10)); }} 
              className="hover:text-amber-400 transition-colors"
            >
              <ZoomIn size={18} />
            </button>
          </div>

          {/* Page Navigation Controls */}
          <div className="bg-white border border-slate-200 rounded-full shadow-2xl flex items-center px-2 py-1 space-x-1 animate-in slide-in-from-bottom-4 duration-700">
            <button 
              disabled={currentPageIndex === 0}
              onClick={(e) => { e.stopPropagation(); setCurrentPageIndex(currentPageIndex - 1); }}
              className={`p-2 rounded-full transition-colors ${currentPageIndex === 0 ? 'text-slate-200' : 'text-slate-600 hover:bg-slate-100 hover:text-primary'}`}
              title="Página Anterior"
              aria-label="Página Anterior"
            >
              <ChevronLeft size={20} />
            </button>
            
            <div className="px-3 py-1 bg-slate-50 rounded-full border border-slate-100">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">
                Página {currentPageIndex + 1} de {template.pages.length}
              </span>
            </div>

            <button 
              disabled={currentPageIndex === template.pages.length - 1}
              onClick={(e) => { e.stopPropagation(); setCurrentPageIndex(currentPageIndex + 1); }}
              className={`p-2 rounded-full transition-colors ${currentPageIndex === template.pages.length - 1 ? 'text-slate-200' : 'text-slate-600 hover:bg-slate-100 hover:text-primary'}`}
              title="Próxima Página"
              aria-label="Próxima Página"
            >
              <ChevronRight size={20} />
            </button>

            <div className="w-px h-4 bg-slate-200 mx-1"></div>

            <button 
              onClick={(e) => { e.stopPropagation(); onAddPage(); }}
              className="p-2 rounded-full text-slate-600 hover:bg-primary/10 hover:text-primary transition-all group"
              title="Adicionar Página"
            >
              <Plus size={20} className="group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      )}

      {/* The Document Canvas - Fixed Proportion A4 (Portrait) */}
      <div
        data-testid="document-canvas"
        className={`bg-white relative transition-all duration-300 ease-out origin-top shrink-0 ${hideUI ? 'shadow-none border-none' : 'shadow-[0_30px_60px_rgba(0,0,0,0.15)] border border-slate-200'}`}
        style={{
          width: '794px',
          height: '1123px',
          transform: `scale(${zoom / 100})`,
          marginBottom: `${-1123 * (1 - zoom / 100)}px`
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Renderização dos Blocos da Página ATIVA */}
        {template.pages[currentPageIndex].blocks.map((block) => (
          <EditorBlockWrapper
            key={block.id}
            block={block}
            scale={zoom / 100}
            isSelected={!hideUI && selectedBlockId === block.id}
            onClick={() => !hideUI && setSelectedBlockId(block.id)}
            onGeometryChange={(data) => onUpdateBlockGeometry(block.id, data)}
            hideUI={hideUI}
          >
            {renderBlockContent(block)}
          </EditorBlockWrapper>
        ))}

        {/* Footer estático */}
        <div className="absolute bottom-10 left-10 right-10 border-t border-slate-100 pt-4 flex justify-between items-center text-[9px] text-slate-300 font-black uppercase tracking-[0.2em] pointer-events-none">
          <span>{template.name} • Solar Vision O&M</span>
          <span>Página {currentPageIndex + 1}</span>
        </div>
      </div>

      {!hideUI && <div className="h-40 shrink-0"></div>}
    </div>
  );
}
