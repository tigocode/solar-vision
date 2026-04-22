import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import HistoricoPage from './page';

jest.mock('@/contexts/BrandContext', () => ({
  useBrand: () => ({
    brand: { primaryColor: '#000', companyName: 'Solar Vision' }
  })
}));

// Mock do DashboardLayout nativo
jest.mock('@/components/layout/DashboardLayout', () => {
  return function MockDashboardLayout({ children }: { children: React.ReactNode }) {
    return <div data-testid="dashboard-layout">{children}</div>;
  };
});

describe('HistoricoPage Component - AI Analysis Worflow', () => {

  test('Renderiza o botão "Iniciar Análise das Imagens" em inspeções pendentes', async () => {
    render(<HistoricoPage />);
    
    // Vamos basear na busca de "Aguardando Análise" ou de botões de inicio
    // Como a UI será montada depois, definiremos o contrato como o texto exato do botão.
    expect(await screen.findByRole('button', { name: /Iniciar Análise/i })).toBeInTheDocument();
  });

  test('Simula o clique em Análise e verifica estado de processamento/validação', async () => {
    render(<HistoricoPage />);
    
    const analisarBtn = await screen.findByRole('button', { name: /Iniciar Análise/i });
    fireEvent.click(analisarBtn);
    
    // Ao clicar, o card entra no estado "Em Processamento..." mockado.
    expect(screen.getByText(/Em Processamento/i)).toBeInTheDocument();
    expect(screen.getByText(/Processando Base/i)).toBeInTheDocument();
    
    // Na nossa simulação na lógica da tela, após um tempo (ou mock manual), o status muda
    // Para simplificar no teste, o framework de testes avança a UI mockada para o fim.
    // Assim que concluir, o sistema deverá apresentar o botão para o Diagnóstico:
    await waitFor(() => {
       expect(screen.getByRole('button', { name: /Revisar no Diagnóstico Técnico/i })).toBeInTheDocument();
    }, { timeout: 3500 });
  });

});
