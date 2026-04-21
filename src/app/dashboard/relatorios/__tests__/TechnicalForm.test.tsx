import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import NovaInspecaoPage from '../../nova-inspecao/page';
import { getStoredInspections } from '@/utils/storage';

// Mock do DashboardLayout e Hooks
jest.mock('@/components/layout/DashboardLayout', () => ({ children }: { children: React.ReactNode }) => <div>{children}</div>);
jest.mock('@/contexts/BrandContext', () => ({
  useBrand: () => ({ brand: { primaryColor: '#4f46e5' } })
}));
jest.mock('next/navigation', () => ({
  useSearchParams: () => ({ get: jest.fn() }),
  useRouter: () => ({ push: jest.fn() })
}));

describe('Nova Inspeção - Formulário Técnico (TDD)', () => {
  
  beforeEach(() => {
    localStorage.clear();
  });

  it('deve registrar uma inspeção com os novos campos técnicos sem exigir arquivos', async () => {
    render(<NovaInspecaoPage />);
    
    // 1. Dados Gerais
    fireEvent.change(screen.getByLabelText(/seleção de ativo/i), { target: { value: 'p1' } });
    fireEvent.change(screen.getByLabelText(/data da inspeção/i), { target: { value: '2026-04-20' } });
    fireEvent.change(screen.getByLabelText(/responsável técnico/i), { target: { value: 'João Piloto' } });
    
    // 2. Condições Ambientais (Obrigatórios)
    fireEvent.change(screen.getByLabelText(/temperatura/i), { target: { value: '34' } });
    fireEvent.change(screen.getByLabelText(/vento/i), { target: { value: '2.1' } });
    fireEvent.change(screen.getByLabelText(/nuvem/i), { target: { value: 'Céu Limpo' } });

    // 3. Equipamentos (Possuem defaults, mas testamos a edição)
    fireEvent.change(screen.getByLabelText(/drone/i), { target: { value: 'DJI Matrice 300 RTK' } });
    fireEvent.change(screen.getByLabelText(/câmera/i), { target: { value: 'FLIR Vue Pro R 640' } });
    
    const submitBtn = screen.getByText(/registrar inspeção/i);
    expect(submitBtn).not.toBeDisabled();
    
    fireEvent.click(submitBtn);

    await waitFor(() => {
      const inspections = getStoredInspections();
      expect(inspections.length).toBe(1);
      expect(inspections[0].technicalData.envTemp).toBe('34');
      expect(inspections[0].technicalData.droneModel).toBe('DJI Matrice 300 RTK');
    });
  });

  it('deve manter o botão desabilitado se campos obrigatórios estiverem vazios', () => {
    render(<NovaInspecaoPage />);
    
    const submitBtn = screen.getByText(/registrar inspeção/i);
    // Limpando campo obrigatório (Ex: Responsável)
    fireEvent.change(screen.getByLabelText(/responsável técnico/i), { target: { value: '' } });
    
    expect(submitBtn).toBeDisabled();
  });
});
