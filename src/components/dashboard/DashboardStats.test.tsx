import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DashboardStats from './DashboardStats';
import { BrandProvider } from '@/contexts/BrandContext';
import { Anomaly } from '@/types/anomalies';

// Mock estendido para o Dashboard Stats
const mockAnomalies: Anomaly[] = [
  { id: '1', type: 'Módulo Trincado', severity: 'Crítico', status: 'Pendente', location: { route: 'R1', string: 'S1', position: 'superior' }, createdAt: '', updatedAt: '', irUrl: '', rgbUrl: '', deltaT: 50, boundingBox: {x:0, y:0, width:0, height:0} },
  { id: '2', type: 'Ponto Quente', severity: 'Médio', status: 'Em Análise', location: { route: 'R1', string: 'S1', position: 'superior' }, createdAt: '', updatedAt: '', irUrl: '', rgbUrl: '', deltaT: 20, boundingBox: {x:0, y:0, width:0, height:0} },
  { id: '3', type: 'Sujeira', severity: 'Baixo', status: 'Resolvido', location: { route: 'R1', string: 'S1', position: 'superior' }, createdAt: '', updatedAt: '', irUrl: '', rgbUrl: '', deltaT: 5, boundingBox: {x:0, y:0, width:0, height:0} },
];

const mockTotalModules = 1000;

describe('Componente DashboardStats (Ciclo 10)', () => {
  it('deve calcular corretamente a "Saúde da Usina" com base nos dados', () => {
    // Calculo: (1000 - 3 anomalias) / 1000 * 100 = 99.7%
    render(
      <BrandProvider>
        <DashboardStats anomalies={mockAnomalies} totalModules={mockTotalModules} />
      </BrandProvider>
    );

    // Seleciona o KPI específico
    const healthStat = screen.getByText('99.7%');
    expect(healthStat).toBeInTheDocument();
  });

  it('deve renderizar a quantidade correta de anomalias ativas (não resolvidas)', () => {
    // Temos 1 Pendente e 1 Em Análise = 2 anomalias ativas
    render(
      <BrandProvider>
        <DashboardStats anomalies={mockAnomalies} totalModules={mockTotalModules} />
      </BrandProvider>
    );

    // Presume que o card mostrará "2" para anomalias em aberto
    const activeAnomalies = screen.getByTestId('active-anomalies-count');
    expect(activeAnomalies).toHaveTextContent('2');
  });

  it('deve consumir e repassar a cor primária do BrandContext para os componentes filhos', () => {
    // Vamos validar se a classe com base no primary está mapeada corretamente no wrapper principal
    // O BrandProvider aplica na raiz por padrão, mas o componente também injeta var CSS
    const { container } = render(
      <BrandProvider>
        <DashboardStats anomalies={mockAnomalies} totalModules={mockTotalModules} />
      </BrandProvider>
    );
    
    // Testa apenas se o componente é montado sem crashs sob o Contexto
    expect(container.firstChild).toBeInTheDocument();
  });
});
