import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Sidebar from './Sidebar';

// Mock do hook useUI
jest.mock('@/hooks/useUI', () => ({
  useUI: jest.fn(() => ({
    viewMode: 'operator',
    isMenuOpen: false,
    toggleMenu: jest.fn(),
    setIsMenuOpen: jest.fn(),
  })),
}));

describe('Sidebar Component', () => {
  const useUIMock = require('@/hooks/useUI').useUI;

  it('deve renderizar o logo da SolarVision', () => {
    useUIMock.mockReturnValue({ viewMode: 'operator', toggleViewMode: jest.fn() });
    render(<Sidebar />);
    expect(screen.getAllByText(/solar/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/vision/i).length).toBeGreaterThan(0);
  });

  it('deve exibir todos os itens de menu no modo operador', () => {
    useUIMock.mockReturnValue({ viewMode: 'operator', toggleViewMode: jest.fn() });
    render(<Sidebar />);
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/nova inspeção/i)).toBeInTheDocument();
    expect(screen.getByText(/upload de dados/i)).toBeInTheDocument();
  });

  it('NÃO deve exibir itens operacionais no modo cliente', () => {
    useUIMock.mockReturnValue({ viewMode: 'client', toggleViewMode: jest.fn() });
    render(<Sidebar />);
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    expect(screen.queryByText(/nova inspeção/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/upload de dados/i)).not.toBeInTheDocument();
  });

  describe('Mobile Responsiveness', () => {
    it('deve possuir a classe de escondido (-translate-x-full) quando isMenuOpen for false', () => {
      const useUIMock = require('@/hooks/useUI').useUI;
      useUIMock.mockReturnValue({ viewMode: 'operator', isMenuOpen: false });
      
      const { container } = render(<Sidebar />);
      const aside = container.querySelector('aside');
      expect(aside).toHaveClass('-translate-x-full');
    });

    it('deve possuir a classe de visível (translate-x-0) quando isMenuOpen for true', () => {
      const useUIMock = require('@/hooks/useUI').useUI;
      useUIMock.mockReturnValue({ viewMode: 'operator', isMenuOpen: true });
      
      const { container } = render(<Sidebar />);
      const aside = container.querySelector('aside');
      expect(aside).toHaveClass('translate-x-0');
    });

    it('deve renderizar o botão de fechar (X) apenas em mobile', () => {
      render(<Sidebar />);
      const closeButton = screen.getByLabelText(/fechar menu/i);
      expect(closeButton).toBeInTheDocument();
      // O botão deve ter a classe lg:hidden para não aparecer em desktop
      expect(closeButton).toHaveClass('lg:hidden');
    });
  });
});
