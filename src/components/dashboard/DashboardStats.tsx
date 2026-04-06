'use client';

import React, { useMemo } from 'react';
import { useBrand } from '@/contexts/BrandContext';
import { Anomaly } from '@/types/anomalies';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { AlertTriangle, CheckCircle2, Activity } from 'lucide-react';

interface DashboardStatsProps {
  anomalies: Anomaly[];
  totalModules: number;
}

export default function DashboardStats({ anomalies, totalModules }: DashboardStatsProps) {
  const { brand } = useBrand();

  const stats = useMemo(() => {
    const active = anomalies.filter(a => a.status === 'Pendente' || a.status === 'Em Análise');
    const resolved = anomalies.filter(a => a.status === 'Resolvido');
    
    // Cálculo de Saúde
    const healthIndex = totalModules > 0 
      ? Math.max(0, 100 - (active.length / totalModules) * 100).toFixed(1)
      : '0.0';

    // Agrupamento para gráfico de Barras (Tipos de Falhas)
    const byType = anomalies.reduce((acc, curr) => {
      acc[curr.type] = (acc[curr.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const barData = Object.entries(byType).map(([name, value]) => ({ name, Quantidade: value }));

    // Dados para a Rosca (Status)
    const pieData = [
      { name: 'Pendentes/Em Análise', value: active.length, color: '#f59e0b' },
      { name: 'Resolvidos/Falso Posit.', value: anomalies.length - active.length, color: '#10b981' }
    ];

    return { activeCount: active.length, resolvedCount: resolved.length, healthIndex, barData, pieData };
  }, [anomalies, totalModules]);

  return (
    <div className="space-y-6">
      
      {/* KPIs Principais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-sm" style={{ backgroundColor: brand.primaryColor }}>
            <Activity size={24} />
          </div>
          <div>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Saúde da Usina</p>
            <p className="text-3xl font-black text-slate-800">{stats.healthIndex}%</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center text-white shadow-sm">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Anomalias Ativas</p>
            <p className="text-3xl font-black text-slate-800" data-testid="active-anomalies-count">{stats.activeCount}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-sm">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Resolvidas</p>
            <p className="text-3xl font-black text-slate-800">{stats.resolvedCount}</p>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Gráfico de Barras */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <h3 className="text-sm font-bold text-slate-800 mb-6 flex items-center">
            Tipos de Falhas
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="Quantidade" fill={brand.primaryColor} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de Rosca (Pie Chart) */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <h3 className="text-sm font-bold text-slate-800 mb-6 flex items-center">
            Status das Inspeções
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {stats.pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
