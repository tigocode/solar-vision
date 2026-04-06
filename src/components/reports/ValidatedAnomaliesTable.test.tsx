import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ValidatedAnomaliesTable from './ValidatedAnomaliesTable';
import ReportSummaryCards from './ReportSummaryCards';
import { Anomaly } from '@/types/anomalies';

// Mock de dados para os testes (Regra 10)
const mockAnomalies: Anomaly[] = [
  {
    id: 'VAL-01',
    type: 'Módulo Trincado',
    deltaT: 45.2,
    severity: 'Crítico',
    status: 'Resolvido',
    location: { route: 'RT-01', string: 'ST-01', position: 'superior' },
    irUrl: '', rgbUrl: '',
    boundingBox: { x: 0, y: 0, width: 0, height: 0 },
    createdAt: '2024-01-01', updatedAt: '2024-01-01'
  },
  {
    id: 'VAL-02',
    type: 'Ponto Quente',
    deltaT: 25.0,
    severity: 'Médio',
    status: 'Em Análise',
    location: { route: 'RT-01', string: 'ST-02', position: 'inferior' },
    irUrl: '', rgbUrl: '',
    boundingBox: { x: 0, y: 0, width: 0, height: 0 },
    createdAt: '2024-01-01', updatedAt: '2024-01-01'
  },
  {
    id: 'PEN-01',
    type: 'Sujeira',
    deltaT: 5.2,
    severity: 'Baixo',
    status: 'Pendente', // DEVE SER FILTRADO (Regra 10)
    location: { route: 'RT-01', string: 'ST-03', position: 'superior' },
    irUrl: '', rgbUrl: '',
    boundingBox: { x: 0, y: 0, width: 0, height: 0 },
    createdAt: '2024-01-01', updatedAt: '2024-01-01'
  },
  {
    id: 'FAL-01',
    type: 'Sombreamento',
    deltaT: 1.2,
    severity: 'Baixo',
    status: 'Falso Positivo', // DEVE SER FILTRADO (Regra 10)
    location: { route: 'RT-01', string: 'ST-04', position: 'superior' },
    irUrl: '', rgbUrl: '',
    boundingBox: { x: 0, y: 0, width: 0, height: 0 },
    createdAt: '2024-01-01', updatedAt: '2024-01-01'
  }
];

describe('Painel de Relatórios: ValidatedAnomaliesTable (Regra 10)', () => {
  it('deve renderizar APENAS as anomalias validadas (Resolvido ou Em Análise)', () => {
    render(<ValidatedAnomaliesTable anomalies={mockAnomalies} />);
    
    // Devem estar presentes
    expect(screen.getByText('VAL-01')).toBeInTheDocument();
    expect(screen.getByText('VAL-02')).toBeInTheDocument();
    
    // NÃO devem estar presentes (Regra 10)
    expect(screen.queryByText('PEN-01')).not.toBeInTheDocument();
    expect(screen.queryByText('FAL-01')).not.toBeInTheDocument();
  });
});

describe('Painel de Relatórios: ReportSummaryCards (Matemática Executiva)', () => {
  it('deve calcular corretamente os totais apenas para anomalias validadas', () => {
    render(<ReportSummaryCards anomalies={mockAnomalies} />);
    
    // VAL-01 é Crítico. PEN-01 é Baixo mas está Pendente (deve ser ignorado).
    // Total Crítico: 1
    // Total Médio: 1
    // Total Baixo: 0 (porque o único Baixo é Falso Positivo ou Pendente)
    
    const criticalCard = screen.getByTestId('card-critico');
    const mediumCard = screen.getByTestId('card-medio');
    const lowCard = screen.getByTestId('card-baixo');

    expect(criticalCard).toHaveTextContent('1');
    expect(mediumCard).toHaveTextContent('1');
    expect(lowCard).toHaveTextContent('0');
  });
});
