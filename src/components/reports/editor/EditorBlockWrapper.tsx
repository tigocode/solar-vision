'use client';

import React from 'react';
import { Rnd } from 'react-rnd';
import { GripHorizontal, Settings as SettingsIcon } from 'lucide-react';
import { EditorBlock } from '@/types/templates';

interface EditorBlockWrapperProps {
  block: EditorBlock;
  isSelected: boolean;
  onClick: () => void;
  onGeometryChange: (data: { x: number, y: number, width: number, height: number }) => void;
  scale: number;
  children: React.ReactNode;
  hideUI?: boolean;
}

export default function EditorBlockWrapper({
  block,
  isSelected,
  onClick,
  onGeometryChange,
  scale,
  children,
  hideUI = false
}: EditorBlockWrapperProps) {
  return (
    <Rnd
      size={{ width: block.width, height: block.height }}
      position={{ x: block.x, y: block.y }}
      onDragStop={(e, d) => {
        if (!hideUI) onGeometryChange({ x: d.x, y: d.y, width: block.width, height: block.height });
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        if (!hideUI) {
          onGeometryChange({
            x: position.x,
            y: position.y,
            width: parseInt(ref.style.width),
            height: parseInt(ref.style.height),
          });
        }
      }}
      scale={scale}
      bounds="parent"
      enableResizing={!hideUI && isSelected}
      disableDragging={hideUI || !isSelected}
      onClick={(e: React.MouseEvent) => {
        if (!hideUI) {
          e.stopPropagation();
          onClick(); // Esta é a função onClick que vem das props do seu componente
        }
      }}
      style={{
        zIndex: isSelected ? 50 : 10,
      }}
      dragHandleClassName="drag-handle"
      className={`group transition-all duration-200 ${!hideUI && isSelected
          ? 'ring-2 ring-amber-500 shadow-xl'
          : !hideUI ? 'hover:ring-2 hover:ring-amber-500/30' : ''
        }`}
    >
      <div className="w-full h-full relative" style={{ ...block.style }}>
        {children}

        {/* Floating Toolbar / Drag Handle - Hidden in Preview/HideUI */}
        {!hideUI && isSelected && (
          <div className="absolute -top-10 left-0 bg-slate-800 text-white rounded-md shadow-lg flex items-center p-1 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <button className="p-1.5 hover:bg-slate-700 rounded cursor-grab drag-handle" title="Mover">
              <GripHorizontal size={14} />
            </button>
            <div className="w-px h-4 bg-slate-600 mx-1"></div>
            <button className="p-1.5 hover:bg-slate-700 rounded" title="Configurar">
              <SettingsIcon size={14} />
            </button>
          </div>
        )}
      </div>
    </Rnd>
  );
}
