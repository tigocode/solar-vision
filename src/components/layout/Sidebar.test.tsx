import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Sidebar from './Sidebar';
import { UIProvider } from '@/hooks/useUI';

// Mock do next/navigation e contextos
jest.mock('next/navigation', () => ({
  usePathname: () => '/dashboard',
}));

// Mock do BrandContext simples para evitar erro no brand.companyName
jest.mock('@/contexts/BrandContext', () => ({
  useBrand: () => ({
    brand: {
      companyName: 'Solar Vision',
      logoUrl: '',
      enableGradient: false,
    }
  })
}));

describe('Sidebar Restrictions (Client vs Operator)', () => {
  test('Um usuário OPERADOR deve enxergar as opções de Upload e Configurações', () => {
    // Nós encapsulamos a Sidebar no UIProvider, cujo estado inicial é mode='operator'
    render(
      <UIProvider>
        <Sidebar />
      </UIProvider>
    );
    
    // Operador tem acesso nativo:
    expect(screen.getByText('Upload de Dados')).toBeInTheDocument();
    expect(screen.getByText('Configurações')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  test('Um CLIENTE de visualização restrita NÃO DEVE enxergar menus gerenciais (TDD Regra 3)', () => {
    // Precisamos simular a mudança de estado para "client".
    // Vamos interagir com o botão de Toggle que está no componente nativamente.
    render(
      <UIProvider>
        <Sidebar />
      </UIProvider>
    );

    // Identificar e clicar no Toggle de "Visão Cliente"
    const toggleButton = screen.getByLabelText('Alternar modo de visão');
    fireEvent.click(toggleButton);

    // Agora, em visão cliente:
    expect(screen.getByText('Dashboard')).toBeInTheDocument(); // Permitido
    expect(screen.getByText('Histórico')).toBeInTheDocument(); // Permitido

    // RESTRIÇÕES:
    expect(screen.queryByText('Nova Inspeção')).not.toBeInTheDocument();
    expect(screen.queryByText('Upload de Dados')).not.toBeInTheDocument();
    expect(screen.queryByText('Configurações')).not.toBeInTheDocument();
  });
});
