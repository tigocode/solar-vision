import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AnomalyTable from './AnomalyTable';
import { Anomaly } from '@/types/anomalies';

// Mock do hook useUI
jest.mock('@/hooks/useUI', () => ({
  useUI: jest.fn(),
}));

// Mock do next/navigation para testar redirecionamento
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  usePathname: jest.fn(),
}));

const mockAnomalies: Anomaly[] = [
  {
    id: 'PT-01',
    type: 'Módulo Trincado',
    deltaT: 45.2,
    severity: 'Crítico',
    status: 'Pendente',
    location: { route: 'RT-01', string: 'ST-01', position: 'superior' },
    coordinates: { lat: -8.1245, lng: -34.9081 },
    imageUrls: { thermal: '', visual: '' },
    boundingBox: {
      thermal: { x: 0, y: 0, width: 0, height: 0 },
      visual: { x: 0, y: 0, width: 0, height: 0 },
    },
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: 'PT-05',
    type: 'Ponto Quente',
    deltaT: 25.0,
    severity: 'Médio',
    status: 'Em Análise',
    location: { route: 'RT-01', string: 'ST-02', position: 'inferior' },
    coordinates: { lat: -8.1250, lng: -34.9083 },
    imageUrls: { thermal: '', visual: '' },
    boundingBox: {
      thermal: { x: 0, y: 0, width: 0, height: 0 },
      visual: { x: 0, y: 0, width: 0, height: 0 },
    },
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: 'PT-09',
    type: 'Sombreamento',
    deltaT: 5.0,
    severity: 'Baixo',
    status: 'Pendente',
    location: { route: 'RT-02', string: 'ST-04', position: 'superior' },
    affectedArea: 15,
    coordinates: { lat: -8.1255, lng: -34.9087 },
    imageUrls: { thermal: '', visual: '' },
    boundingBox: {
      thermal: { x: 0, y: 0, width: 0, height: 0 },
      visual: { x: 0, y: 0, width: 0, height: 0 },
    },
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
];

describe('AnomalyTable Component', () => {
  const useUIMock = require('@/hooks/useUI').useUI;

  beforeEach(() => {
    useUIMock.mockReturnValue({ viewMode: 'operator' });
    mockPush.mockClear();
  });

  it('deve renderizar a lista de anomalias corretamente, incluindo sombreamento', () => {
    render(<AnomalyTable anomalies={mockAnomalies} />);
    expect(screen.getByText('PT-01')).toBeInTheDocument();
    expect(screen.getByText('PT-05')).toBeInTheDocument();
    expect(screen.getByText('PT-09')).toBeInTheDocument();
    expect(screen.getByText('Sombreamento')).toBeInTheDocument();
  });

  it('deve redirecionar para a página de detalhes ao clicar em uma linha', () => {
    render(<AnomalyTable anomalies={[mockAnomalies[0]]} />);
    const row = screen.getByText('PT-01').closest('tr');
    if (row) fireEvent.click(row);
    
    expect(mockPush).toHaveBeenCalledWith('/dashboard/diagnostico/PT-01');
  });

  describe('Regras de Severidade (Regra 4 - IEC TS 62446-3)', () => {
    it('deve exibir badge Vermelho para anomalias Críticas', () => {
      render(<AnomalyTable anomalies={[mockAnomalies[0]]} />);
      const badge = screen.getByText(/crítico/i);
      expect(badge).toHaveClass('bg-[#ff4d4f]');
    });

    it('deve exibir badge Laranja para anomalias Médias', () => {
      render(<AnomalyTable anomalies={[mockAnomalies[1]]} />);
      const badge = screen.getByText(/médio/i);
      expect(badge).toHaveClass('bg-[#fa8c16]');
    });

    it('deve exibir badge Amarelo para anomalias Baixas (incluindo Sombreamento leve)', () => {
      render(<AnomalyTable anomalies={[mockAnomalies[2]]} />);
      const badge = screen.getByText(/baixo/i);
      expect(badge).toHaveClass('bg-[#fadb14]');
    });
  });

  describe('Privacidade de Dados (Regra 3)', () => {
    it('deve exibir a coluna de Coordenadas GPS para operadores', () => {
      useUIMock.mockReturnValue({ viewMode: 'operator' });
      render(<AnomalyTable anomalies={mockAnomalies} />);
      expect(screen.getByText(/coordenadas/i)).toBeInTheDocument();
    });

    it('NÃO deve exibir a coluna de Coordenadas GPS para clientes', () => {
      useUIMock.mockReturnValue({ viewMode: 'client' });
      render(<AnomalyTable anomalies={mockAnomalies} />);
      expect(screen.queryByText(/coordenadas/i)).not.toBeInTheDocument();
    });
  });
});
