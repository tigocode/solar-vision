import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ReportsPage from '../page';
import { mockTemplates } from '@/services/mocks/templates';

// Mock do DashboardLayout para evitar erros de contexto de navegação
jest.mock('@/components/layout/DashboardLayout', () => ({ children }: { children: React.ReactNode }) => <div>{children}</div>);

// Mock do react-to-print
jest.mock('react-to-print', () => ({
  useReactToPrint: () => jest.fn(),
}));

describe('ReportsPage - Integração de Templates e Preview', () => {
  it('deve renderizar o título da seção de configuração', () => {
    render(<ReportsPage />);
    const elements = screen.queryAllByText(/Configuração do Documento/i);
    expect(elements.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('deve listar todos os templates disponíveis no seletor', () => {
    render(<ReportsPage />);
    mockTemplates.forEach(template => {
      // Como o template name pode aparecer no seletor e no preview (se aberto), usamos getAll
      expect(screen.getAllByText(template.name).length).toBeGreaterThanOrEqual(1);
    });
  });

  it('deve permitir trocar o template selecionado', () => {
    render(<ReportsPage />);
    const select = screen.getByRole('combobox');
    
    if (mockTemplates.length > 1) {
      fireEvent.change(select, { target: { value: mockTemplates[1].id } });
      expect(select).toHaveValue(mockTemplates[1].id);
    }
  });

  it('deve abrir o modal de pré-visualização ao clicar em Pré-visualizar', () => {
    render(<ReportsPage />);
    const previewBtn = screen.getByText(/Pré-visualizar/i);
    fireEvent.click(previewBtn);
    expect(screen.getByText(/Pré-visualização do Relatório/i)).toBeInTheDocument();
  });

  it('deve manter o contêiner de impressão no DOM mas fora da tela (off-screen) para carregar imagens', () => {
    // Este teste garante que o navegador carregue as imagens preventivamente
    const { container } = render(<ReportsPage />);
    // Buscamos o contêiner que envolve o componente de impressão (EditorCanvas is inside)
    // Procuramos por classes que indiquem posicionamento absoluto negativo
    const offScreenDiv = container.querySelector('.absolute.-left-\\[9999px\\]');
    expect(offScreenDiv).toBeInTheDocument();
  });
});
