'use client';

import React from 'react';
import { ZoomIn, ZoomOut, Sun, Map as MapIcon, TableProperties, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Template, EditorBlock } from '@/types/templates';
import EditorBlockWrapper from './EditorBlockWrapper';

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
  brandLogo
}: EditorCanvasProps) {
  
  const handleCanvasClick = () => {
    setSelectedBlockId(null);
  };

  const renderBlockContent = (block: EditorBlock) => {
    switch (block.type) {
      case 'header':
        return (
          <div className="flex justify-between items-center border-b-2 border-amber-500 pb-4 h-full w-full bg-white select-none overflow-hidden">
            <div className="flex items-center space-x-3">
              {brandLogo ? (
                <img src={brandLogo} alt="Logo" className="h-10 w-auto object-contain" />
              ) : (
                <>
                  <Sun size={24} className="text-amber-500" />
                  <span className="font-black text-xl text-slate-800 tracking-tight">Facilit'Air O&M</span>
                </>
              )}
            </div>
            <div className="text-right">
              <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight">Relatório Executivo</h2>
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
            <p className="text-slate-800">{block.content || 'Digite seu texto...'}</p>
          </div>
        );
      case 'thermal_map':
        return (
          <div className="w-full h-full border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center rounded-lg relative overflow-hidden select-none">
            <MapIcon size={32} className="text-slate-300 mb-2" />
            <p className="text-[10px] font-black uppercase text-slate-400">Mapa Térmico Digital</p>
          </div>
        );
      case 'table':
        return (
          <div className="w-full h-full border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col rounded-lg overflow-hidden relative select-none">
            <div className="bg-slate-100 p-2 border-b border-slate-200">
              <span className="text-[10px] font-black text-slate-600 uppercase italic">{block.content || 'Tabela de Dados'}</span>
            </div>
            <div className="flex-1 p-2 opacity-20 space-y-2">
               {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-2 bg-slate-300 w-full rounded" />)}
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
      className="flex-1 bg-slate-100 overflow-auto flex flex-col items-center py-20 relative cursor-default scroll-smooth"
      style={{ 
        backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', 
        backgroundSize: '30px 30px'
      }}
      onClick={handleCanvasClick}
    >
      {/* Dynamic Controls Overlay */}
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

      {/* The Document Canvas - Fixed Proportion A4 (Portrait) */}
      <div
        data-testid="document-canvas"
        className="bg-white shadow-[0_30px_60px_rgba(0,0,0,0.15)] relative transition-all duration-300 ease-out origin-top shrink-0 border border-slate-200"
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
            isSelected={selectedBlockId === block.id}
            onClick={() => setSelectedBlockId(block.id)}
            onGeometryChange={(data) => onUpdateBlockGeometry(block.id, data)}
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

      <div className="h-40 shrink-0"></div>
    </div>
  );
}
