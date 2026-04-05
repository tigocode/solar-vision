import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-500 mt-1">Bem-vindo ao sistema de auditoria Solar Vision.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Usinas Ativas</h3>
            <p className="text-3xl font-black text-slate-800">12</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Potência Total</h3>
            <p className="text-3xl font-black text-slate-800">4.2 MWp</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Alertas Críticos</h3>
            <p className="text-3xl font-black text-red-600">3</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 h-[400px] flex items-center justify-center text-slate-400">
          Gráfico de Performance (Placeholder)
        </div>
      </div>
    </DashboardLayout>
  );
}
