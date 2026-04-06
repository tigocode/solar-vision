import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AnomalyVisualizer from './AnomalyVisualizer';
import { Anomaly } from '@/types/anomalies';

// Mock das dependências externas
jest.mock('react-zoom-pan-pinch', () => ({
  TransformWrapper: ({ children }: any) => <div>{children({})}</div>,
  TransformComponent: ({ children }: any) => <div>{children}</div>,
}));

const mockAnomaly: Anomaly = {
  id: 'PT-01',
  type: 'Ponto Quente',
  deltaT: 25.5,
  severity: 'Médio',
  status: 'Pendente',
  location: { route: 'RT-01', string: 'ST-01', position: 'superior' },
  irUrl: '/assets/demo-thermal.jpg',
  rgbUrl: '/assets/demo-visual.jpg',
  boundingBox: { x: 0.4, y: 0.3, width: 0.2, height: 0.2 },
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
};

describe('AnomalyVisualizer Component', () => {
  it('deve renderizar ambas as imagens (IR e RGB) com os links corretos', () => {
    render(<AnomalyVisualizer anomaly={mockAnomaly} />);
    
    const images = screen.getAllByRole('img');
    const irImage = images.find(img => img.getAttribute('src') === mockAnomaly.irUrl);
    const rgbImage = images.find(img => img.getAttribute('src') === mockAnomaly.rgbUrl);
    
    expect(irImage).toBeInTheDocument();
    expect(rgbImage).toBeInTheDocument();
  });

  it('deve renderizar a Bounding Box sobre a imagem', () => {
    render(<AnomalyVisualizer anomaly={mockAnomaly} />);
    
    // Devem existir duas bounding boxes (uma para cada imagem sincronizada)
    const bboxes = screen.getAllByTestId('bounding-box');
    expect(bboxes).toHaveLength(2);
  });

  it('deve exibir as labels identificadoras de cada canal', () => {
    render(<AnomalyVisualizer anomaly={mockAnomaly} />);
    expect(screen.getByText(/térmico/i)).toBeInTheDocument();
    expect(screen.getByText(/visual/i)).toBeInTheDocument();
  });
});
