import DashboardLayout from '@/components/layout/DashboardLayout';
import DashboardStats from '@/components/dashboard/DashboardStats';
import { Anomaly } from '@/types/anomalies';

const mockAnomalies: Anomaly[] = [
  { id: 'PT-01', type: 'Módulo Trincado', severity: 'Crítico', status: 'Pendente', location: { route: 'R1', string: 'S1', position: 'superior' }, createdAt: '2024-03-20', updatedAt: '2024-03-20', irUrl: '/DJI_0001_IR.jpg', rgbUrl: '/imagem.example.jpeg', deltaT: 45.2, boundingBox: { x: 10, y: 10, width: 20, height: 20 } },
  { id: 'PT-02', type: 'Ponto Quente', severity: 'Médio', status: 'Em Análise', location: { route: 'R1', string: 'S2', position: 'inferior' }, createdAt: '2024-03-20', updatedAt: '2024-03-20', irUrl: '', rgbUrl: '', deltaT: 28.5, boundingBox: { x: 30, y: 30, width: 10, height: 10 } },
  { id: 'PT-03', type: 'Sujeira', severity: 'Baixo', status: 'Pendente', location: { route: 'R2', string: 'S1', position: 'superior' }, createdAt: '2024-03-20', updatedAt: '2024-03-20', irUrl: '', rgbUrl: '', deltaT: 5.1, boundingBox: { x: 5, y: 5, width: 5, height: 5 } },
  { id: 'PT-04', type: 'Sombreamento', severity: 'Baixo', status: 'Falso Positivo', location: { route: 'R2', string: 'S1', position: 'inferior' }, createdAt: '2024-03-20', updatedAt: '2024-03-20', irUrl: '', rgbUrl: '', deltaT: 3.2, boundingBox: { x: 50, y: 50, width: 20, height: 20 } },
  { id: 'PT-05', type: 'Diodo Bypass Aberto', severity: 'Crítico', status: 'Pendente', location: { route: 'R3', string: 'S5', position: 'superior' }, createdAt: '2024-03-20', updatedAt: '2024-03-20', irUrl: '', rgbUrl: '', deltaT: 55.4, boundingBox: { x: 80, y: 20, width: 15, height: 15 } },
  { id: 'PT-06', type: 'PID Incipiente', severity: 'Médio', status: 'Em Análise', location: { route: 'R3', string: 'S6', position: 'inferior' }, createdAt: '2024-03-20', updatedAt: '2024-03-20', irUrl: '', rgbUrl: '', deltaT: 12.8, boundingBox: { x: 0, y: 0, width: 100, height: 100 } },
  { id: 'PT-07', type: 'String Inativa', severity: 'Crítico', status: 'Resolvido', location: { route: 'R4', string: 'S1', position: 'superior' }, createdAt: '2024-03-20', updatedAt: '2024-03-21', irUrl: '', rgbUrl: '', deltaT: 62.1, boundingBox: { x: 40, y: 40, width: 10, height: 50 } },
];

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-6xl mx-auto w-full">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Painel de Operações</h1>
          <p className="text-slate-500 font-medium">Visão executiva e status da frota de inspeções termográficas.</p>
        </div>

        {/* Integração dos Gráficos em Recharts consumindo os Mocks e o BrandContext */}
        <DashboardStats anomalies={mockAnomalies} totalModules={12000} />
      </div>
    </DashboardLayout>
  );
}
