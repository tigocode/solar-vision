'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useBrand } from '@/contexts/BrandContext';
import { Settings, Image as ImageIcon, Palette, Building2, Undo2, Sun, User, Shield, LayoutTemplate, PlusCircle, FileText, Trash2, Clock } from 'lucide-react';
import TemplateEditor from '@/components/reports/editor/TemplateEditor';
import { mockTemplates } from '@/services/mocks/templates';
import { Template } from '@/types/templates';

function ConfiguracoesContent() {
  const { brand, updateBrand, resetBrand } = useBrand();
  const [imgError, setImgError] = useState(false);
  const [configTab, setConfigTab] = useState<'perfil' | 'seguranca' | 'whitelabel'>('perfil');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState<Template | null>(null);
  const [templatesList, setTemplatesList] = useState<Template[]>(mockTemplates);

  // Reseta o erro ao mudar a url
  const handleChange = (field: keyof typeof brand, value: string) => {
    if (field === 'logoUrl') setImgError(false);
    updateBrand({ [field]: value });
  };

  const openEditor = (template: Template) => {
    setActiveTemplate(template);
    setIsEditorOpen(true);
  };

  const handleCreateNewTemplate = () => {
    // Busca a estrutura do template padrão para herdar as normas
    const standard = mockTemplates.find(t => t.id === 'temp-executivo-1');
    
    const newTemplate: Template = {
      id: `temp-${Date.now()}`,
      name: 'Novo Template em Branco',
      lastEdited: 'Agora',
      pages: standard?.pages ? JSON.parse(JSON.stringify(standard.pages)) : [
        {
          id: 'page-1',
          blocks: []
        }
      ],
      theme: {
        primaryColor: brand.primaryColor,
        secondaryColor: '#0f172a',
        fontFamily: 'Inter'
      }
    };
    setTemplatesList(prev => [newTemplate, ...prev]);
    openEditor(newTemplate);
  };

  const handleDeleteTemplate = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (id === 'temp-executivo-1') return;
    
    if (confirm('Tem certeza que deseja excluir este template? Esta ação não pode ser desfeita.')) {
      setTemplatesList(prev => prev.filter(t => t.id !== id));
    }
  };

  const handleSaveTemplate = (updatedTemplate: Template) => {
    setTemplatesList(prev => prev.map(t => t.id === updatedTemplate.id ? updatedTemplate : t));
    setActiveTemplate(updatedTemplate);
    // Nota: O editor DEVE continuar aberto no auto-save. 
    // Para fechar, o usuário usa o botão X do Topbar.
    console.log('Template Atualizado:', updatedTemplate.name);
  };

  return (
    <div className="flex flex-col h-full space-y-8 animate-in fade-in duration-700 max-w-6xl mx-auto w-full pb-20 px-4">
      
      {/* CABEÇALHO */}
      <div className="flex flex-col md:flex-row md:items-end justify-between space-y-4 md:space-y-0 pt-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center">
            <Settings className="mr-3 text-primary" size={32} />
            Configurações do Sistema
          </h1>
          <p className="text-slate-500 font-medium italic">Gerencie o seu perfil e as preferências de White-label.</p>
        </div>
        
        <button 
          onClick={resetBrand}
          className="flex items-center px-4 py-2 bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800 rounded-xl text-sm font-bold shadow-sm transition-colors"
        >
          <Undo2 size={16} className="mr-2" /> Restaurar Padrões
        </button>
      </div>

      {/* Tabbed Layout Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        
        {/* Sidebar Nav */}
        <div className="w-full md:w-64 bg-slate-50 border-r border-slate-200 p-4 space-y-1 shrink-0">
          <button 
            onClick={() => setConfigTab('perfil')}
            className={`w-full flex items-center space-x-3 p-3 rounded-xl font-bold text-sm transition-all ${configTab === 'perfil' ? 'bg-white shadow-sm text-slate-800 border-l-4 border-primary' : 'text-slate-500 hover:bg-slate-200/50'}`}
          >
            <User size={18} /> <span>Perfil & Identidade</span>
          </button>
          <button 
            onClick={() => setConfigTab('seguranca')}
            className={`w-full flex items-center space-x-3 p-3 rounded-xl font-bold text-sm transition-all ${configTab === 'seguranca' ? 'bg-white shadow-sm text-slate-800 border-l-4 border-transparent' : 'text-slate-500 hover:bg-slate-200/50'}`}
          >
            <Shield size={18} /> <span>Segurança</span>
          </button>
          <button 
            onClick={() => setConfigTab('whitelabel')}
            className={`w-full flex items-center space-x-3 p-3 rounded-xl font-bold text-sm transition-all ${configTab === 'whitelabel' ? 'bg-white shadow-sm text-slate-800 border-l-4 border-primary' : 'text-slate-500 hover:bg-slate-200/50'}`}
          >
            <LayoutTemplate size={18} /> <span>Templates de Relatórios</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-8">
          
          {/* TAB: PERFIL & IDENTIDADE VISUAL */}
          {configTab === 'perfil' && (
            <div className="animate-in fade-in duration-500 space-y-8">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-lg font-black text-slate-800 uppercase tracking-widest flex items-center">
                  <Palette className="mr-2 text-primary" size={20} /> Identidade Visual (White-label)
                </h2>
                <p className="text-xs text-slate-500 mt-1">Reflete em tempo real no dashboard e nos relatórios exportados.</p>
              </div>

              <div className="space-y-8">
                {/* NOME DA EMPRESA */}
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center">
                    <Building2 className="mr-2" size={14} /> Nome da Empresa (O&M)
                  </label>
                  <input
                    type="text"
                    value={brand.companyName}
                    onChange={(e) => handleChange('companyName', e.target.value)}
                    placeholder="Ex: Solar Vision O&M"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-primary transition-all font-medium"
                  />
                </div>

                {/* COR PRIMÁRIA */}
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center">
                    <Palette className="mr-2" size={14} /> Cor Primária
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="relative w-12 h-12 rounded-xl border-2 border-white shadow-md overflow-hidden cursor-pointer">
                      <input
                        type="color"
                        value={brand.primaryColor}
                        onChange={(e) => handleChange('primaryColor', e.target.value)}
                        className="absolute -top-4 -left-4 w-20 h-20 cursor-pointer"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-800 uppercase">{brand.primaryColor}</p>
                    </div>
                  </div>
                </div>

                {/* LOGOTIPO */}
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center">
                    <ImageIcon className="mr-2" size={14} /> Logotipo
                  </label>
                  <div className="flex gap-4 items-start">
                    <div className="w-24 h-24 rounded-xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center p-2 shrink-0">
                      {(!brand.logoUrl || imgError) ? <Sun size={24} className="text-slate-300" /> : 
                       <img src={brand.logoUrl} alt="Logo" className="max-h-full object-contain" onError={() => setImgError(true)} />}
                    </div>
                    <input
                      type="text"
                      value={brand.logoUrl}
                      onChange={(e) => handleChange('logoUrl', e.target.value)}
                      placeholder="URL do Logotipo..."
                      className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: TEMPLATES */}
          {configTab === 'whitelabel' && (
            <div className="animate-in fade-in duration-500 flex flex-col h-full">
              <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-lg font-black text-slate-800 uppercase tracking-widest flex items-center">
                    <LayoutTemplate className="mr-2 text-primary" size={20} /> Construtor de Relatórios
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">Crie documentos personalizados com a identidade visual do cliente.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {templatesList.map((template) => (
                  <div 
                    key={template.id}
                    onClick={() => openEditor(template)}
                    className="border border-slate-200 rounded-2xl p-4 hover:border-primary hover:shadow-xl transition-all cursor-pointer group bg-slate-50/50"
                  >
                    <div className="bg-white h-40 rounded-xl mb-4 flex items-center justify-center relative overflow-hidden border border-slate-100 shadow-inner">
                      <div className="w-20 h-28 bg-slate-50 shadow-md flex flex-col p-2 border border-slate-100">
                        <div className="h-2 bg-slate-200 w-1/3 mb-2 rounded" />
                        <div className="h-10 bg-slate-100 rounded mb-2" />
                        <div className="h-1 bg-slate-200 w-full mb-1 rounded" />
                        <div className="h-1 bg-slate-200 w-full mb-1 rounded" />
                      </div>
                      <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all backdrop-blur-[2px]">
                        <span className="bg-white text-slate-900 text-xs font-black px-4 py-2 rounded-xl shadow-xl flex items-center">
                           <LayoutTemplate size={14} className="mr-2" /> Editar Template
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-black text-slate-800 text-sm leading-tight">{template.name}</h4>
                      {template.id !== 'temp-executivo-1' && (
                        <button 
                          onClick={(e) => handleDeleteTemplate(e, template.id)}
                          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all shrink-0"
                          title="Excluir Template"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                    
                    <div className="flex items-center text-[10px] text-slate-400 space-x-3 font-bold uppercase tracking-wider">
                      <div className="flex items-center">
                        <Clock size={10} className="mr-1" /> {template.lastEdited}
                      </div>
                      <div className="flex items-center">
                        <FileText size={10} className="mr-1" /> {template.pages.length} {template.pages.length === 1 ? 'PÁG' : 'PÁGS'}
                      </div>
                    </div>
                  </div>
                ))}

                <button 
                  onClick={handleCreateNewTemplate}
                  className="border-2 border-dashed border-slate-200 rounded-2xl p-4 hover:border-primary hover:bg-primary/5 transition-all flex flex-col items-center justify-center h-full min-h-[240px] group"
                >
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all mb-3">
                    <PlusCircle size={24} />
                  </div>
                  <h4 className="font-black text-slate-700 text-sm">Criar Novo Template</h4>
                  <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Folha em branco</p>
                </button>
              </div>
            </div>
          )}

          {/* TAB: SEGURANÇA (Placeholder) */}
          {configTab === 'seguranca' && (
            <div className="text-center py-20 flex flex-col items-center animate-in fade-in">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-300 mb-4">
                <Shield size={32} />
              </div>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Módulo de Segurança</p>
              <p className="text-[10px] text-slate-400 mt-1">Em desenvolvimento...</p>
            </div>
          )}

        </div>
      </div>

      {/* RENDER EDITOR OVERLAY */}
      {isEditorOpen && activeTemplate && (
        <TemplateEditor 
          template={activeTemplate} 
          onClose={() => setIsEditorOpen(false)}
          onSave={handleSaveTemplate}
          brandLogo={brand.logoUrl}
        />
      )}
      
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
