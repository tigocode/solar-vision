'use client';

import React from 'react';
import { X, AlignLeft, AlignCenter, AlignRight, Palette, Trash2, Settings } from 'lucide-react';
import { EditorBlock } from '@/types/templates';

interface EditorPropertiesPanelProps {
  block: EditorBlock;
  onChange: (updatedBlock: EditorBlock) => void;
  onDelete: (id: string) => void;
}

export default function EditorPropertiesPanel({ block, onChange, onDelete }: EditorPropertiesPanelProps) {
  const handleStyleChange = (updates: Partial<NonNullable<EditorBlock['style']>>) => {
    onChange({
      ...block,
      style: {
        ...(block.style || {}),
        ...updates,
      },
    });
  };

  return (
    <div className="w-72 bg-white border-l border-slate-200 flex flex-col z-10 shadow-lg h-full animate-in slide-in-from-right duration-200">
      <div className="p-4 border-b border-slate-100 bg-amber-50/50 flex justify-between items-center">
        <div>
          <h4 className="font-bold text-slate-800 text-sm">Propriedades</h4>
          <p className="text-[10px] text-amber-600 font-semibold mt-1 uppercase tracking-wider">Elemento Selecionado</p>
        </div>
        <button 
          onClick={() => {}} // This would be handled by a higher level "deselect"
          className="text-slate-400 hover:text-slate-600"
        >
          <X size={16} />
        </button>
      </div>

      <div className="p-4 flex-1 overflow-y-auto space-y-6">
        {/* Alinhamento */}
        <div>
          <label id="alignment-label" className="text-xs font-bold text-slate-600 mb-2 block uppercase tracking-wide">Alinhamento</label>
          <div className="flex bg-slate-100 p-1 rounded-lg" aria-labelledby="alignment-label">
            <button 
              onClick={() => handleStyleChange({ textAlign: 'left' })}
              className={`flex-1 py-1.5 flex justify-center rounded transition-all ${block.style?.textAlign === 'left' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:bg-white/50'}`}
              aria-label="Alinhar à esquerda"
            >
              <AlignLeft size={16} />
            </button>
            <button 
              onClick={() => handleStyleChange({ textAlign: 'center' })}
              className={`flex-1 py-1.5 flex justify-center rounded transition-all ${block.style?.textAlign === 'center' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:bg-white/50'}`}
              aria-label="Alinhar ao centro"
            >
              <AlignCenter size={16} />
            </button>
            <button 
              onClick={() => handleStyleChange({ textAlign: 'right' })}
              className={`flex-1 py-1.5 flex justify-center rounded transition-all ${block.style?.textAlign === 'right' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:bg-white/50'}`}
              aria-label="Alinhar à direita"
            >
              <AlignRight size={16} />
            </button>
          </div>
        </div>

        {/* Cores */}
        <div>
          <label className="text-xs font-bold text-slate-600 mb-2 block uppercase tracking-wide">Cor do Tema</label>
          <div className="flex space-x-2">
            {['#0f172a', '#f59e0b', '#2563eb'].map((color) => (
              <button 
                key={color}
                onClick={() => handleStyleChange({ color })}
                className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${block.style?.color === color ? 'border-amber-500 shadow-md scale-110' : 'border-white shadow-sm'}`}
                style={{ backgroundColor: color }}
              />
            ))}
            <button className="w-8 h-8 rounded-full flex items-center justify-center border border-slate-300 text-slate-400 hover:bg-slate-50 transition-colors">
              <Palette size={14} />
            </button>
          </div>
        </div>

        {/* Configurações específicas por tipo */}
        {block.type === 'table' && (
          <div className="pt-4 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-600 mb-2 block uppercase tracking-wide">Estilo da Tabela</label>
            <select className="w-full p-2 border border-slate-200 rounded text-sm bg-slate-50 focus:outline-none focus:border-amber-500 font-medium">
              <option>Listras Alternadas</option>
              <option>Bordas Simples</option>
              <option>Minimalista</option>
            </select>
          </div>
        )}

        {/* Botão de Exclusão */}
        <div className="pt-4 border-t border-slate-100 mt-auto">
          <button 
            onClick={() => onDelete(block.id)}
            className="w-full py-2.5 flex items-center justify-center space-x-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-bold transition-colors"
          >
            <Trash2 size={16} /> <span>Remover Elemento</span>
          </button>
        </div>
      </div>
    </div>
  );
}
