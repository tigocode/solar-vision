'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useBrand } from '@/contexts/BrandContext';
import { Settings, Image as ImageIcon, Palette, Building2, Undo2, Sun } from 'lucide-react';

function ConfiguracoesContent() {
  const { brand, updateBrand, resetBrand } = useBrand();
  const [imgError, setImgError] = useState(false);

  // Reseta o erro ao mudar a url
  const handleChange = (field: keyof typeof brand, value: string) => {
    if (field === 'logoUrl') setImgError(false);
    updateBrand({ [field]: value });
  };

  return (
    <div className="flex flex-col h-full space-y-8 animate-in fade-in duration-700 max-w-4xl mx-auto w-full overflow-y-auto pb-20 px-2">
      
      {/* CABEÇALHO */}
      <div className="flex flex-col md:flex-row md:items-end justify-between space-y-4 md:space-y-0 pt-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center">
            <Settings className="mr-3 text-primary" size={32} />
            Configurações
          </h1>
          <p className="text-slate-500 font-medium italic">Gerencie a identidade visual e as preferências do seu software (White-label).</p>
        </div>
        
        <button 
          onClick={resetBrand}
          className="flex items-center px-4 py-2 bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800 rounded-xl text-sm font-bold shadow-sm transition-colors"
        >
          <Undo2 size={16} className="mr-2" /> Restaurar Padrões
        </button>
      </div>

      {/* PAINEL DE CONTROLE (WHITE-LABEL) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-lg font-black text-slate-800 uppercase tracking-widest flex items-center">
            <Palette className="mr-2 text-primary" size={20} /> Identidade Visual (White-label)
          </h2>
          <p className="text-xs text-slate-500 mt-1">As alterações feitas aqui refletem em tempo real no dashboard e nos relatórios exportados (Regra 7).</p>
        </div>
        
        <div className="p-8 space-y-8">
          
          {/* NOME DA EMPRESA */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-700 flex items-center">
              <Building2 className="mr-2 text-slate-400" size={16} /> Nome da Empresa (O&M)
            </label>
            <input
              type="text"
              value={brand.companyName}
              onChange={(e) => handleChange('companyName', e.target.value)}
              placeholder="Ex: Solar Vision O&M"
              className="w-full xl:w-2/3 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
            />
          </div>

          {/* COR PRIMÁRIA */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-700 flex items-center">
              <Palette className="mr-2 text-slate-400" size={16} /> Cor Primária
            </label>
            <div className="flex items-center space-x-4">
              <div className="relative w-14 h-14 rounded-2xl overflow-hidden border-4 border-white shadow-lg cursor-pointer group">
                <input
                  type="color"
                  value={brand.primaryColor}
                  onChange={(e) => handleChange('primaryColor', e.target.value)}
                  className="absolute -top-4 -left-4 w-24 h-24 cursor-pointer"
                />
              </div>
              <div>
                <p className="text-sm font-black text-slate-800 uppercase tracking-wider">{brand.primaryColor}</p>
                <p className="text-[10px] text-slate-500 font-medium">Usada em botões e destaques (Variável CSS).</p>
              </div>
            </div>
            
            {/* Swatches rápidos */}
            <div className="flex items-center space-x-3 mt-4">
               {['#4f46e5', '#16a34a', '#dc2626', '#d97706', '#0284c7', '#0f172a'].map((color) => (
                 <button
                   key={color}
                   onClick={() => handleChange('primaryColor', color)}
                   className={`w-8 h-8 rounded-full shadow-sm border-2 transition-transform hover:scale-110 ${brand.primaryColor.toLowerCase() === color ? 'border-slate-800 scale-110' : 'border-white'}`}
                   style={{ backgroundColor: color }}
                   aria-label={`Selecionar cor ${color}`}
                 />
               ))}
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* ESTILO TEXTUAL (NOVO CICLO = LOGO TYPOGRAPHY) */}
          <div className="space-y-4">
            <label className="text-sm font-bold text-slate-700 flex items-center">
               Estilo Textual da Empresa (Separação Silábica)
            </label>
            <p className="text-xs text-slate-500 mb-4">Caso possua mais de uma palavra no nome, você pode dar destaque à segunda parte.</p>
            
            <div className="flex flex-col md:flex-row gap-6">
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Palavra 1</span>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={brand.textWord1Color || '#ffffff'}
                    onChange={(e) => handleChange('textWord1Color', e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer border-0 p-0"
                  />
                  <span className="text-sm font-medium text-slate-700">{brand.textWord1Color || 'Padrão'}</span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Palavra 2+</span>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={brand.textWord2Color || brand.primaryColor}
                    onChange={(e) => handleChange('textWord2Color', e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer border-0 p-0"
                  />
                  <span className="text-sm font-medium text-slate-700">{brand.textWord2Color || 'Usa Primária'}</span>
                </div>
              </div>

              <div className="space-y-2 ml-0 md:ml-6 border-l-0 md:border-l border-slate-200 pl-0 md:pl-6">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Efeito Gradiente</span>
                <div className="flex items-center h-10">
                   <button 
                     onClick={() => handleChange('enableGradient', String(!brand.enableGradient))}
                     className={`w-12 h-6 rounded-full relative transition-colors duration-300 focus:outline-none ${brand.enableGradient ? 'bg-primary' : 'bg-slate-300'}`}
                   >
                     <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ${brand.enableGradient ? 'translate-x-6' : 'translate-x-0'}`} />
                   </button>
                   <span className="ml-3 text-sm font-medium text-slate-700">{brand.enableGradient ? 'Ativado' : 'Desativado'}</span>
                </div>
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* LOGOTIPO */}
          <div className="space-y-5">
            <label className="text-sm font-bold text-slate-700 flex items-center">
              <ImageIcon className="mr-2 text-slate-400" size={16} /> Logotipo da Empresa
            </label>
            
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              
              {/* Preview */}
              <div className="w-32 h-32 rounded-2xl bg-white border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-4 relative group overflow-hidden shrink-0">
                {(!brand.logoUrl || imgError) ? (
                   <div className="w-full h-full bg-primary flex items-center justify-center text-white rounded-xl">
                     <Sun size={32} />
                   </div>
                ) : (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img 
                    src={brand.logoUrl} 
                    alt="Logo Preview" 
                    className="w-full h-full object-contain transition-opacity group-hover:opacity-50" 
                    onError={() => setImgError(true)}
                  />
                )}
              </div>

              <div className="flex-1 space-y-3">
                <input
                  type="text"
                  value={brand.logoUrl}
                  onChange={(e) => handleChange('logoUrl', e.target.value)}
                  placeholder="Cole a URL da sua Logo aqui..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
                <p className="text-xs text-slate-500">
                  Para o desenvolvimento, insira uma URL de imagem (Ex: https://via.placeholder.com/150). No processo final será implementado o upload de arquivos.
                </p>
                <div className="pt-2">
                   <button className="px-5 py-2 bg-primary text-white text-xs font-black uppercase tracking-widest rounded-lg shadow-sm hover:opacity-90 transition-opacity">
                     Simular Upload
                   </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
      
    </div>
  );
}

export default function ConfiguracoesPage() {
  return (
    <DashboardLayout>
      <ConfiguracoesContent />
    </DashboardLayout>
  );
}
