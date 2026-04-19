'use client';

import React, { useState } from 'react';
import { Save, Undo, Redo, X } from 'lucide-react';

interface EditorTopbarProps {
  initialName: string;
  onSave: (data: { name: string }) => void;
  onClose?: () => void;
}

export default function EditorTopbar({ initialName, onSave, onClose }: EditorTopbarProps) {
  const [name, setName] = useState(initialName);
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!name.trim()) {
      setError('Nome do template é obrigatório');
      return;
    }
    setError('');
    onSave({ name });
  };

  return (
    <div className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 shadow-sm z-20">
      <div className="flex items-center space-x-4">
        {onClose && (
          <button 
            onClick={onClose} 
            className="p-1.5 hover:bg-slate-100 rounded-md text-slate-500 transition-colors"
            aria-label="Fechar Editor"
          >
            <X size={20} />
          </button>
        )}
        <div className="h-5 w-px bg-slate-200"></div>
        <div className="flex flex-col">
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError('');
            }}
            placeholder="Nome do Template"
            className={`font-bold text-slate-700 text-sm outline-none border-b-2 transition-colors ${error ? 'border-red-500' : 'border-transparent focus:border-amber-500'}`}
          />
          {error && <span className="text-[10px] text-red-500 font-bold mt-0.5">{error}</span>}
        </div>
        <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded">Guardado</span>
      </div>

      <div className="flex items-center space-x-2">
        <button className="p-2 hover:bg-slate-100 rounded-md text-slate-500" aria-label="Desfazer"><Undo size={16} /></button>
        <button className="p-2 hover:bg-slate-100 rounded-md text-slate-500" aria-label="Refazer"><Redo size={16} /></button>
        <div className="h-5 w-px bg-slate-200 mx-2"></div>
        <button 
          onClick={handleSave}
          className="bg-amber-500 hover:bg-amber-600 text-slate-900 text-sm font-bold px-4 py-1.5 rounded-md flex items-center transition-colors shadow-sm"
        >
          <Save size={16} className="mr-2" /> Salvar Template
        </button>
      </div>
    </div>
  );
}
