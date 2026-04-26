'use client';

import React from 'react';
import { X, AlignLeft, AlignCenter, AlignRight, Palette, Trash2, Settings, Type, Bold, Italic } from 'lucide-react';
import { EditorBlock } from '@/types/templates';

interface EditorPropertiesPanelProps {
  block: EditorBlock;
  onChange: (updatedBlock: EditorBlock) => void;
  onDelete: (id: string) => void;
  onClose?: () => void;
}

export default function EditorPropertiesPanel({ block, onChange, onDelete, onClose }: EditorPropertiesPanelProps) {
  
  const handleStyleChange = (updates: Partial<NonNullable<EditorBlock['style']>>) => {
    onChange({
      ...block,
      style: {
        ...(block.style || {}),
        ...updates,
      },
    });
  };

  const handleContentChange = (content: string) => {
    onChange({ ...block, content });
  };

  const handleConfigChange = (updates: Partial<NonNullable<EditorBlock['config']>>) => {
    onChange({
      ...block,
      config: {
        ...(block.config || {}),
        ...updates,
      },
    });
  };

  return (
    <div className="w-72 bg-white border-l border-slate-200 flex flex-col z-10 shadow-lg h-full animate-in slide-in-from-right duration-200">
      <div className="p-4 border-b border-slate-100 bg-amber-50/50 flex justify-between items-center">
        <div>
          <h4 className="font-bold text-slate-800 text-sm italic tracking-tight">Propriedades</h4>
          <p className="text-[10px] text-amber-600 font-black mt-0.5 uppercase tracking-widest">Elemento Selecionado</p>
        </div>
        <button 
          onClick={onClose}
          className="p-1 hover:bg-amber-100/50 rounded-md text-slate-400 hover:text-amber-600 transition-colors"
          title="Fechar Propriedades"
        >
          <X size={16} />
        </button>
      </div>

      <div className="p-4 flex-1 overflow-y-auto space-y-6 scrollbar-thin scrollbar-thumb-slate-200">
        
        {/* EDITAR CONTEÚDO (Para blocos de texto) */}
        {block.type === 'text' && (
          <div className="animate-in fade-in slide-in-from-top-2">
            <label htmlFor="content-editor" className="text-[10px] font-black text-slate-400 mb-2 block uppercase tracking-widest flex items-center">
              <Type size={10} className="mr-1.5" /> Conteúdo do Texto
            </label>
            <textarea
              id="content-editor"
              value={block.content || ''}
              onChange={(e) => handleContentChange(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 min-h-[80px] focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all resize-none mb-4"
              placeholder="Digite o texto aqui..."
              aria-label="Conteúdo"
            />

            {/* Typography Controls */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="font-family" className="text-[10px] font-black text-slate-400 mb-1.5 block uppercase tracking-tighter">Fonte</label>
                <select 
                  id="font-family"
                  value={block.style?.fontFamily || 'Inter'}
                  onChange={(e) => handleStyleChange({ fontFamily: e.target.value })}
                  className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs font-bold bg-slate-50 focus:outline-none focus:border-amber-500 transition-all text-slate-700 overflow-hidden"
                >
                  <optgroup label="Solar Vision">
                    <option value="Inter">Inter</option>
                    <option value="Roboto">Roboto</option>
                  </optgroup>
                  <optgroup label="Sistemas">
                    <option value="sans-serif">Sans-Serif</option>
                    <option value="serif">Serif</option>
                    <option value="monospace">Monospace</option>
                  </optgroup>
                </select>
              </div>
              <div>
                <label htmlFor="font-size" className="text-[10px] font-black text-slate-400 mb-1.5 block uppercase tracking-tighter">Tamanho</label>
                <select 
                  id="font-size"
                  value={block.style?.fontSize || '12px'}
                  onChange={(e) => handleStyleChange({ fontSize: e.target.value })}
                  className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs font-bold bg-slate-50 focus:outline-none focus:border-amber-500 transition-all text-slate-700"
                >
                  {['8px', '9px', '10px', '12px', '14px', '16px', '20px', '24px', '32px', '48px'].map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex space-x-2 mt-3">
               <button 
                 onClick={() => handleStyleChange({ fontWeight: block.style?.fontWeight === 'bold' ? 'normal' : 'bold' })}
                 className={`flex-1 py-1.5 flex justify-center rounded-lg border transition-all ${block.style?.fontWeight === 'bold' ? 'bg-amber-500 border-amber-600 text-white' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                 title="Negrito"
               >
                 <Bold size={14} />
               </button>
               <button 
                 onClick={() => handleStyleChange({ italic: !block.style?.italic })}
                 className={`flex-1 py-1.5 flex justify-center rounded-lg border transition-all ${block.style?.italic ? 'bg-amber-500 border-amber-600 text-white' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                 title="Itálico"
               >
                 <Italic size={14} />
               </button>
            </div>
          </div>
        )}

        {/* Alinhamento */}
        <div>
          <label id="alignment-label" className="text-[10px] font-black text-slate-400 mb-2 block uppercase tracking-widest">Alinhamento</label>
          <div className="flex bg-slate-100 p-1 rounded-xl" aria-labelledby="alignment-label">
            <button 
              onClick={() => handleStyleChange({ textAlign: 'left' })}
              className={`flex-1 py-1.5 flex justify-center rounded-lg transition-all ${block.style?.textAlign === 'left' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:bg-white/50'}`}
              aria-label="Alinhar à esquerda"
            >
              <AlignLeft size={16} />
            </button>
            <button 
              onClick={() => handleStyleChange({ textAlign: 'center' })}
              className={`flex-1 py-1.5 flex justify-center rounded-lg transition-all ${block.style?.textAlign === 'center' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:bg-white/50'}`}
              aria-label="Alinhar ao centro"
            >
              <AlignCenter size={16} />
            </button>
            <button 
              onClick={() => handleStyleChange({ textAlign: 'right' })}
              className={`flex-1 py-1.5 flex justify-center rounded-lg transition-all ${block.style?.textAlign === 'right' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:bg-white/50'}`}
              aria-label="Alinhar à direita"
            >
              <AlignRight size={16} />
            </button>
          </div>
        </div>

        {/* Cores */}
        <div>
          <label className="text-[10px] font-black text-slate-400 mb-2 block uppercase tracking-widest">Cor do Tema</label>
          <div className="flex space-x-3">
            {['#0f172a', '#f59e0b', '#2563eb', '#ef4444'].map((color) => (
              <button 
                key={color}
                onClick={() => handleStyleChange({ color })}
                className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${block.style?.color === color ? 'border-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.3)] scale-110' : 'border-white shadow-sm'}`}
                style={{ backgroundColor: color }}
                aria-label={`Cor ${color}`}
              />
            ))}
            <button 
              className="w-8 h-8 rounded-full flex items-center justify-center border border-slate-300 text-slate-400 hover:bg-slate-50 transition-colors shadow-sm"
              title="Cores Personalizadas"
            >
              <Palette size={14} />
            </button>
          </div>
        </div>

        {/* Configurações específicas : Tabelas */}
        {block.type === 'table' && (
          <div className="pt-4 border-t border-slate-100 animate-in fade-in space-y-4">
            <div>
              <label htmlFor="table-style" className="text-[10px] font-black text-slate-400 mb-2 block uppercase tracking-widest flex items-center">
                <Settings size={10} className="mr-1.5" /> Estilo da Tabela
              </label>
              <select 
                id="table-style"
                value={block.style?.tableStyle || 'Listras Alternadas'}
                onChange={(e) => handleStyleChange({ tableStyle: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold bg-slate-50 focus:outline-none focus:border-amber-500 transition-all text-slate-700 h-10"
              >
                <option value="Listras Alternadas">Listras Alternadas</option>
                <option value="Bordas Simples">Bordas Simples</option>
                <option value="Minimalista">Minimalista</option>
                <option value="Dark Mode">Dark Mode Industrial</option>
              </select>
            </div>

            <div>
              <label htmlFor="severity-filter" className="text-[10px] font-black text-slate-400 mb-2 block uppercase tracking-widest">
                Filtrar por Severidade
              </label>
              <select 
                id="severity-filter"
                value={(block.config?.severityFilter as string) || 'Todos'}
                onChange={(e) => handleConfigChange({ severityFilter: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold bg-slate-50 focus:outline-none focus:border-amber-500 transition-all text-slate-700 h-10"
              >
                <option value="Todos">Todos (Sem filtro)</option>
                <option value="Crítico">Crítico</option>
                <option value="Médio">Médio</option>
                <option value="Baixo">Baixo</option>
              </select>
            </div>

            <div className="flex items-center justify-between bg-amber-50/50 p-3 rounded-2xl border border-amber-100">
               <label htmlFor="auto-height" className="text-[10px] font-black text-amber-800 uppercase tracking-widest cursor-pointer">
                 Ajustar altura ao conteúdo
               </label>
               <input 
                 id="auto-height"
                 type="checkbox"
                 checked={(block.config?.autoHeight as boolean) || false}
                 onChange={(e) => handleConfigChange({ autoHeight: e.target.checked })}
                 className="w-4 h-4 accent-amber-500 cursor-pointer"
               />
            </div>
          </div>
        )}

        {/* Botão de Exclusão */}
        <div className="pt-6 border-t border-slate-100 mt-auto">
          <button 
            onClick={() => onDelete(block.id)}
            className="w-full py-3 flex items-center justify-center space-x-2 text-red-500 hover:bg-red-50 rounded-2xl text-xs font-black uppercase tracking-widest transition-all group"
          >
            <Trash2 size={16} className="group-hover:scale-110 transition-transform" /> 
            <span>Remover Elemento</span>
          </button>
        </div>
      </div>
    </div>
  );
}
