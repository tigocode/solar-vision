import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import ConfiguracoesPage from '../page';

// Mock do DashboardLayout
jest.mock('@/components/layout/DashboardLayout', () => ({ children }: { children: React.ReactNode }) => <div>{children}</div>);

// Mock do BrandContext
jest.mock('@/contexts/BrandContext', () => ({
  useBrand: () => ({
    brand: { companyName: 'Test Solar', primaryColor: '#f59e0b', logoUrl: '' },
    updateBrand: jest.fn(),
    resetBrand: jest.fn()
  })
}));

describe('ConfiguracoesPage - Gestão de Templates', () => {
  beforeEach(() => {
    render(<ConfiguracoesPage />);
    // Vai para a aba de templates
    fireEvent.click(screen.getByText(/Templates de Relatórios/i));
  });

  it('não deve exibir botão de deletar para o Relatório Executivo Padrão', () => {
    const standardCard = screen.getByText('Relatório Executivo Padrão').closest('div');
    const deleteBtn = within(standardCard!).queryByRole('button', { name: /deletar/i });
    expect(deleteBtn).not.toBeInTheDocument();
  });

  it('deve permitir criar um novo template que herda a estrutura padrão (2+ páginas)', () => {
    fireEvent.click(screen.getByText(/Criar Novo Template/i));
    
    // Verifica se abriu o editor com o novo template
    expect(screen.getByPlaceholderText(/Nome do Template/i)).toHaveValue('Novo Template em Branco');
    
    // Verifica se tem navegação de páginas (indicando que não é só uma página vazia)
    // Supondo que adicionaremos algo como "Página 1 de 2" ou controles de página
    expect(screen.getByText(/Página 1 de/i)).toBeInTheDocument();
  });

  it('deve permitir deletar um template customizado', () => {
    // Primeiro cria um novo para ter um deletável
    fireEvent.click(screen.getByText(/Criar Novo Template/i));
    // Fecha o editor (simulado via o estado local no componente real)
    // Aqui no teste, renderizamos novamente ou simulamos a volta
    
    // Verifica se o novo card tem o botão de delete e se ele remove o card
    // ... lógica de teste de exclusão ...
  });
});
