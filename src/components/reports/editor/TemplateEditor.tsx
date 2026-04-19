'use client';

import React, { useState } from 'react';
import { Template, EditorBlock } from '@/types/templates';
import EditorTopbar from './EditorTopbar';
import EditorSidebar from './EditorSidebar';
import EditorAssetsPanel from './EditorAssetsPanel';
import EditorCanvas from './EditorCanvas';
import EditorPropertiesPanel from './EditorPropertiesPanel';

interface TemplateEditorProps {
  template: Template;
  onSave?: (template: Template) => void;
  onClose?: () => void;
}

export default function TemplateEditor({ 
  template: initialTemplate, 
  onSave, 
  onClose,
  brandLogo // Recebido opcionalmente ou via context
}: { 
  template: Template, 
  onSave?: (t: Template) => void, 
  onClose?: () => void,
  brandLogo?: string
}) {
  const [template, setTemplate] = useState<Template>(initialTemplate);
  const [zoom, setZoom] = useState(75);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

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

  const addBlock = (type: EditorBlock['type']) => {
    const newBlock: EditorBlock = {
      id: `block-${Date.now()}`,
      type,
      x: 50,
      y: 150,
      width: type === 'text' ? 400 : 300,
      height: type === 'text' ? 100 : 200,
      content: type === 'text' ? 'Novo Bloco de Texto' : undefined,
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

  // Auto-save Effect adaptado
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
    <div className="fixed inset-0 bg-slate-100 flex flex-col z-[100] animate-in zoom-in-95 duration-200">
      <EditorTopbar 
        initialName={template.name} 
        onSave={handleSave} 
        onClose={onClose} 
      />
      
      <div className="flex flex-1 overflow-hidden">
        <EditorSidebar />
        <EditorAssetsPanel onAddBlock={addBlock} />
        
        <EditorCanvas 
          template={template} 
          currentPageIndex={currentPageIndex}
          setCurrentPageIndex={setCurrentPageIndex}
          zoom={zoom} 
          setZoom={setZoom}
          selectedBlockId={selectedBlockId}
          setSelectedBlockId={setSelectedBlockId}
          onUpdateBlockGeometry={updateBlockGeometry}
          onAddPage={addPage}
          brandLogo={brandLogo}
        />

        {selectedBlock && (
          <EditorPropertiesPanel 
            block={selectedBlock} 
            onChange={handleUpdateBlock}
            onDelete={handleDeleteBlock}
          />
        )}
      </div>
    </div>
  );
}
