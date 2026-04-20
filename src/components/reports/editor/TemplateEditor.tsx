'use client';

import React, { useState } from 'react';
import { Template, EditorBlock } from '@/types/templates';
import EditorTopbar from './EditorTopbar';
import EditorSidebar, { EditorTab } from './EditorSidebar';
import EditorAssetsPanel from './EditorAssetsPanel';
import EditorCanvas from './EditorCanvas';
import EditorPropertiesPanel from './EditorPropertiesPanel';
import { Eye, Edit3 } from 'lucide-react';

interface TemplateEditorProps {
  template: Template;
  onSave?: (template: Template) => void;
  onClose?: () => void;
  brandLogo?: string;
}

export default function TemplateEditor({ 
  template: initialTemplate, 
  onSave, 
  onClose,
  brandLogo 
}: TemplateEditorProps) {
  const [template, setTemplate] = useState<Template>(initialTemplate);
  const [zoom, setZoom] = useState(75);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<EditorTab>('design');
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // Seleciona o bloco na página ATIVA
  const selectedBlock = template.pages[currentPageIndex].blocks.find(b => b.id === selectedBlockId);

  const handleUpdateBlock = (updatedBlock: EditorBlock) => {
    setTemplate(prev => ({
      ...prev,
      pages: prev.pages.map((page, idx) => 
        idx === currentPageIndex 
          ? { ...page, blocks: page.blocks.map(b => b.id === updatedBlock.id ? updatedBlock : b) }
          : page
      )
    }));
  };

  const updateBlockGeometry = (id: string, data: { x?: number, y?: number, width?: number, height?: number }) => {
    setTemplate(prev => ({
      ...prev,
      pages: prev.pages.map((page, idx) => 
        idx === currentPageIndex 
          ? { 
              ...page, 
              blocks: page.blocks.map(b => b.id === id ? { ...b, ...data } : b) 
            }
          : page
      )
    }));
  };

  const addBlock = (type: EditorBlock['type'], content?: string) => {
    const newBlock: EditorBlock = {
      id: `block-${Date.now()}`,
      type,
      x: 50,
      y: 150,
      width: type === 'text' ? 400 : 300,
      height: type === 'text' ? 100 : 200,
      content: content || (type === 'text' ? 'Novo Bloco de Texto' : undefined),
      style: {
        textAlign: 'left',
        color: '#1e293b'
      }
    };

    setTemplate(prev => ({
      ...prev,
      pages: prev.pages.map((page, idx) => 
        idx === currentPageIndex ? { ...page, blocks: [...page.blocks, newBlock] } : page
      )
    }));
    setSelectedBlockId(newBlock.id);
  };

  const addPage = () => {
    const newPage = {
      id: `page-${template.pages.length + 1}`,
      blocks: [
        {
          id: `header-${Date.now()}`,
          type: 'header' as const,
          x: 32,
          y: 32,
          width: 730,
          height: 80,
        }
      ]
    };
    setTemplate(prev => ({
      ...prev,
      pages: [...prev.pages, newPage]
    }));
    setCurrentPageIndex(template.pages.length);
  };

  const handleDeleteBlock = (id: string) => {
    setTemplate(prev => ({
      ...prev,
      pages: prev.pages.map((page, idx) => 
        idx === currentPageIndex ? { ...page, blocks: page.blocks.filter(b => b.id !== id) } : page
      )
    }));
    setSelectedBlockId(null);
  };

  // Auto-save Effect
  React.useEffect(() => {
    if (template !== initialTemplate) {
      const timer = setTimeout(() => onSave?.(template), 1000);
      return () => clearTimeout(timer);
    }
  }, [template, onSave, initialTemplate]);

  const handleSave = (data: { name: string }) => {
    const updatedTemplate = { ...template, name: data.name };
    setTemplate(updatedTemplate);
    onSave?.(updatedTemplate);
  };

  return (
    <div className={`fixed inset-0 bg-slate-100 flex flex-col z-[100] animate-in zoom-in-95 duration-200 ${isPreviewMode ? 'overflow-hidden' : ''}`}>
      <EditorTopbar 
        initialName={template.name} 
        onSave={handleSave} 
        onClose={onClose} 
      />
      
      <div className="flex flex-1 overflow-hidden relative">
        {!isPreviewMode && (
          <>
            <EditorSidebar activeTab={activeTab} onTabChange={setActiveTab} />
            <EditorAssetsPanel activeTab={activeTab} onAddBlock={addBlock} />
          </>
        )}
        
        <EditorCanvas 
          template={template} 
          currentPageIndex={currentPageIndex}
          setCurrentPageIndex={setCurrentPageIndex}
          zoom={isPreviewMode ? 60 : zoom} 
          setZoom={setZoom}
          selectedBlockId={selectedBlockId}
          setSelectedBlockId={setSelectedBlockId}
          onUpdateBlockGeometry={updateBlockGeometry}
          onAddPage={addPage}
          brandLogo={brandLogo}
          isPreview={isPreviewMode}
        />

        {!isPreviewMode && selectedBlock && (
          <EditorPropertiesPanel 
            block={selectedBlock} 
            onChange={handleUpdateBlock}
            onDelete={handleDeleteBlock}
            onClose={() => setSelectedBlockId(null)}
          />
        )}

        {/* Toggle de Pré-visualização Lateral (Flutuante) */}
        <button 
          onClick={() => {
            setIsPreviewMode(!isPreviewMode);
            setSelectedBlockId(null);
          }}
          className={`absolute bottom-8 right-8 p-4 rounded-2xl shadow-2xl transition-all flex items-center space-x-3 font-black uppercase tracking-widest text-xs z-50 ${
            isPreviewMode 
              ? 'bg-amber-500 text-slate-900 hover:bg-amber-400' 
              : 'bg-slate-900 text-white hover:bg-slate-800'
          }`}
          aria-label={isPreviewMode ? 'Editar Relatório' : 'Pré-visualizar'}
        >
          {isPreviewMode ? <Edit3 size={20} /> : <Eye size={20} />}
          <span>{isPreviewMode ? 'Editar' : 'Pré-visualizar'}</span>
        </button>
      </div>
    </div>
  );
}
