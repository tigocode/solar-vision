import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from './Header';

// Mock do hook useUI
jest.mock('@/hooks/useUI', () => ({
  useUI: jest.fn(() => ({
    viewMode: 'operator',
    isMenuOpen: false,
    toggleMenu: jest.fn(),
  })),
}));

describe('Header Component', () => {
  const useUIMock = require('@/hooks/useUI').useUI;

  it('deve indicar "Modo Operador" quando viewMode for operator', () => {
    useUIMock.mockReturnValue({ viewMode: 'operator' });
    render(<Header />);
    expect(screen.getByText(/modo operador/i)).toBeInTheDocument();
  });

  it('deve indicar "Visão Cliente" quando viewMode for client', () => {
    useUIMock.mockReturnValue({ viewMode: 'client' });
    render(<Header />);
    expect(screen.getByText(/a visualizar como cliente/i)).toBeInTheDocument();
  });

  it('deve renderizar ícones de ação (Pesquisar/Notificações)', () => {
    useUIMock.mockReturnValue({ viewMode: 'operator' });
    render(<Header />);
    expect(screen.getByLabelText(/pesquisar/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/notificações/i)).toBeInTheDocument();
  });

  describe('Mobile Responsiveness', () => {
    it('deve renderizar o botão de menu hambúrguer apenas em dispositivos móveis', () => {
      render(<Header />);
      const menuButton = screen.getByLabelText(/abrir menu/i);
      expect(menuButton).toBeInTheDocument();
      expect(menuButton).toHaveClass('lg:hidden');
    });

    it('deve chamar toggleMenu ao clicar no botão de hambúrguer', () => {
      const toggleMenu = jest.fn();
      const useUIMock = require('@/hooks/useUI').useUI;
      useUIMock.mockReturnValue({ viewMode: 'operator', toggleMenu });
      
      render(<Header />);
      const menuButton = screen.getByLabelText(/abrir menu/i);
      menuButton.click();
      expect(toggleMenu).toHaveBeenCalled();
    });
  });
});
