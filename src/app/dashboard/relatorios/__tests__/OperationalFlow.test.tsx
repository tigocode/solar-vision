import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import NovaInspecaoPage from '../../nova-inspecao/page';
import UploadPage from '../../upload/page';
import HistoricoPage from '../../historico/page';

// Mock do DashboardLayout e Hooks
jest.mock('@/components/layout/DashboardLayout', () => ({ children }: { children: React.ReactNode }) => <div>{children}</div>);
jest.mock('@/contexts/BrandContext', () => ({
  useBrand: () => ({
    brand: {
      primaryColor: '#4f46e5',
      logoUrl: '/logo.png'
    }
  })
}));
jest.mock('next/navigation', () => ({
  useSearchParams: () => ({ get: jest.fn() }),
  useRouter: () => ({ push: jest.fn() })
}));

describe('Fluxo Operacional de Inspeção (TDD)', () => {
  
  beforeEach(() => {
    localStorage.clear();
  });

  it('deve registrar uma nova inspeção e salvá-la no localStorage como aguardando download', async () => {
    render(<NovaInspecaoPage />);
    
    // Simula preenchimento do formulário
    fireEvent.change(screen.getByLabelText(/seleção de ativo/i), { target: { value: 'p1' } });
    fireEvent.change(screen.getByLabelText(/data da inspeção/i), { target: { value: '2026-04-20' } });
    fireEvent.change(screen.getByPlaceholderText(/nome do piloto/i), { target: { value: 'João Piloto' } });
    
    // Simula anexo de arquivos
    fireEvent.click(screen.getByTestId('mock-dropzone-click'));
    
    const submitBtn = screen.getByText(/iniciar processamento/i);
    fireEvent.click(submitBtn);

    await waitFor(() => {
      const inspections = JSON.parse(localStorage.getItem('solar_inspections') || '[]');
      expect(inspections.length).toBe(1);
      expect(inspections[0].status).toBe('Aguardando Upload');
    });
  });

  it('deve permitir selecionar uma inspeção pendente na página de Upload e mudar status para Em Processamento', () => {
    const mockPending = [{ id: 'insp-123', unitName: 'UFV Teste', status: 'Aguardando Upload' }];
    localStorage.setItem('solar_inspections', JSON.stringify(mockPending));

    render(<UploadPage />);
    
    const select = screen.getByLabelText(/selecionar inspeção/i);
    fireEvent.change(select, { target: { value: 'insp-123' } });
    
    // Simula cliques nos dropzones para ativar botões
    fireEvent.click(screen.getByTestId('thermal-upload'));
    fireEvent.click(screen.getByTestId('visual-upload'));
    const uploadBtn = screen.getByText(/concluir upload e processar/i);
    fireEvent.click(uploadBtn);

    const inspections = JSON.parse(localStorage.getItem('solar_inspections') || '[]');
    expect(inspections[0].status).toBe('Em Processamento');
  });

  it('deve exibir o status correto no Histórico vindo do localStorage', () => {
    const mockData = [
      { id: 'H-999', unitName: 'UFV Histórico', status: 'Em Processamento', date: '20 de Março, 2026' }
    ];
    localStorage.setItem('solar_inspections', JSON.stringify(mockData));

    render(<HistoricoPage />);
    
    expect(screen.getByText(/UFV Histórico/i)).toBeInTheDocument();
    const statusBadges = screen.getAllByText(/Em Processamento/i);
    expect(statusBadges.length).toBeGreaterThanOrEqual(1);
  });
});
