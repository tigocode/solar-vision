import React, { forwardRef } from 'react';
import { Anomaly } from '@/types/anomalies';
import { useBrand } from '@/contexts/BrandContext';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Sun } from 'lucide-react';

interface PrintableReportProps {
  anomalies: Anomaly[];
}

const PrintableReport = forwardRef<HTMLDivElement, PrintableReportProps>(({ anomalies }, ref) => {
  const { brand } = useBrand();

  const parts = brand.companyName.trim().split(' ');
  const word1 = parts[0] || '';
  const word2 = parts.length > 1 ? parts.slice(1).join(' ') : '';

  const active = anomalies.filter(a => a.status === 'Pendente' || a.status === 'Em Análise');
  const total = anomalies.length;

  // Calculos simulados
  const healthIndex = 98.4; 

  const byType = anomalies.reduce((acc, curr) => {
    acc[curr.type] = (acc[curr.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const barData = Object.entries(byType).map(([name, value]) => ({ name, value }));

  const pieData = [
    { name: 'Em aberto', value: active.length, color: '#f59e0b' },
    { name: 'Resolvidos', value: total - active.length, color: '#10b981' }
  ];

  const currentDate = new Date().toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div ref={ref} className="bg-white text-slate-800 font-sans print:w-[210mm] print:mx-auto">
       <style type="text/css" media="print">
         {`
           @page { size: A4 portrait; margin: 15mm; }
           body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
         `}
       </style>

       {/* =======================
            CAPA DO RELATÓRIO
           ======================= */}
       <div className="flex flex-col h-[260mm] justify-between print:break-after-page mb-20 p-8 pt-32">
          
          <div className="flex flex-col items-center justify-center text-center space-y-8 flex-1">
             <Sun size={128} className="mb-8" color={brand.primaryColor} />

             <h1 className="text-5xl font-black tracking-tight flex gap-2 justify-center">
                <span style={{ color: 'var(--word1-color)' }}>{word1}</span>
                {word2 && (
                  <span style={brand.enableGradient ? {
                      backgroundImage: `linear-gradient(to right, var(--word1-color, #ffffff), var(--word2-color))`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    } : { color: 'var(--word2-color)' }}>
                    {word2}
                  </span>
                )}
             </h1>
             <div className="w-24 h-1 rounded-full mx-auto" style={{backgroundColor: brand.primaryColor}}></div>

             <div className="mt-16 space-y-3">
               <h2 className="text-4xl font-bold text-slate-800">Relatório Executivo Operacional</h2>
               <p className="text-2xl text-slate-500 font-medium">Análise Termográfica Aérea (IEC TS 62446-3)</p>
             </div>
          </div>

          <div className="flex justify-between items-end border-t-2 border-slate-200 pt-8 mt-12 w-full">
            <div>
              <p className="text-lg font-bold text-slate-800">Usina Alpha Fotovoltaica</p>
              <p className="text-sm font-medium text-slate-500">Unidade Geradora: UFV-01</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-slate-800">{currentDate}</p>
              <p className="text-sm font-medium text-slate-500">Documento Confidencial</p>
            </div>
          </div>
       </div>

       {/* =======================
            PÁGINA 2: SUMÁRIO
           ======================= */}
       <div className="page-content px-8 pt-8">
         <h2 className="text-2xl font-black text-slate-800 border-b border-slate-200 pb-2 mb-8" style={{borderColor: brand.primaryColor}}>
           1. Sumário Executivo
         </h2>

         <div className="grid grid-cols-3 gap-6 mb-12">
            <div className="border border-slate-200 rounded-2xl p-6 bg-slate-50">
              <p className="text-xs uppercase font-bold text-slate-500 mb-2">Saúde Operacional</p>
              <p className="text-4xl font-black" style={{color: brand.primaryColor}}>{healthIndex}%</p>
            </div>
            <div className="border border-slate-200 rounded-2xl p-6 bg-slate-50">
              <p className="text-xs uppercase font-bold text-slate-500 mb-2">Anomalias Ativas</p>
              <p className="text-4xl font-black text-amber-500">{active.length}</p>
            </div>
            <div className="border border-slate-200 rounded-2xl p-6 bg-slate-50">
              <p className="text-xs uppercase font-bold text-slate-500 mb-2">Módulos Afetados</p>
              <p className="text-4xl font-black text-slate-800">{total}</p>
            </div>
         </div>

         {/* GRÁFICOS */}
         <div className="grid grid-cols-2 gap-8 mb-16 print:break-inside-avoid">
            <div>
               <h3 className="text-sm font-bold text-slate-600 mb-4 text-center">Classificação de Falhas</h3>
               <div className="h-56 w-full">
                 <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={barData}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} />
                     <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                     <YAxis tick={{ fontSize: 10 }} />
                     <Bar dataKey="value" fill={brand.primaryColor} radius={[4, 4, 0, 0]} />
                   </BarChart>
                 </ResponsiveContainer>
               </div>
            </div>
            <div>
               <h3 className="text-sm font-bold text-slate-600 mb-4 text-center">Status de Resolução</h3>
               <div className="h-56 w-full">
                 <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                     <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} dataKey="value">
                       {pieData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                     </Pie>
                   </PieChart>
                 </ResponsiveContainer>
               </div>
            </div>
         </div>

         {/* =======================
              PÁGINA X: LISTAGEM 
             ======================= */}
         <h2 className="text-2xl font-black text-slate-800 border-b border-slate-200 pb-2 mb-8 mt-12 print:break-before-page" style={{borderColor: brand.primaryColor}}>
           2. Tabela de Detalhamento
         </h2>

         <table className="w-full text-left text-sm mt-4">
           <thead>
             <tr className="border-b-2 border-slate-800 text-slate-600">
               <th className="pb-3 font-bold">ID</th>
               <th className="pb-3 font-bold">Tipo</th>
               <th className="pb-3 font-bold">Severidade</th>
               <th className="pb-3 font-bold">Status</th>
               <th className="pb-3 font-bold">ΔT (°C)</th>
             </tr>
           </thead>
           <tbody>
             {anomalies.map((a, idx) => (
               <tr key={idx} className="border-b border-slate-200 print:break-inside-avoid">
                 <td className="py-4 font-medium text-slate-800">{a.id}</td>
                 <td className="py-4 text-slate-600">{a.type}</td>
                 <td className="py-4">
                   <span className={`px-2 py-1 rounded-md text-xs font-bold ${a.severity === 'Crítico' ? 'text-red-700 bg-red-50' : a.severity === 'Médio' ? 'text-amber-700 bg-amber-50' : 'text-blue-700 bg-blue-50'}`}>
                     {a.severity}
                   </span>
                 </td>
                 <td className="py-4 text-slate-600">{a.status}</td>
                 <td className="py-4 font-bold text-slate-800">+{a.deltaT}</td>
               </tr>
             ))}
           </tbody>
         </table>

       </div>

       {/* RODAPÉ GLOBAL ABSOLUTO */}
       {/* OBS: Impressão CSS native costuma forçar cabeçalho/rodape sozinho caso programado no browser, porem visualmente o fixamos no layout em A4. */}
       <div className="fixed bottom-4 left-0 w-full text-center print:block hidden">
         <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
           Gerado por Solar Vision - Inteligência Artificial
         </p>
       </div>
    </div>
  );
});

PrintableReport.displayName = 'PrintableReport';

export default PrintableReport;
