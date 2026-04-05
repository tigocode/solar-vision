import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginPage from './page';

// Mock do componente LoginForm para focar no teste da página
jest.mock('../../components/auth/LoginForm', () => {
  return function MockLoginForm() {
    return <div data-testid="login-form">Mock LoginForm</div>;
  };
});

describe('LoginPage', () => {
  it('deve renderizar o logo da Solar Vision e o formulário de login', () => {
    render(<LoginPage />);
    
    // Verifica a presença do logo (contendo Solar e Vision)
    expect(screen.getAllByText(/solar/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/vision/i).length).toBeGreaterThan(0);
    
    // Verifica se o formulário de login está presente
    expect(screen.getByTestId('login-form')).toBeInTheDocument();
  });

  it('deve ter o layout de fundo escuro (slate-900)', () => {
    const { container } = render(<LoginPage />);
    const mainWrapper = container.firstChild;
    
    // Verifica se a classe de fundo escuro do Tailwind está presente
    expect(mainWrapper).toHaveClass('bg-slate-900');
  });

  it('deve centralizar o card de login', () => {
    const { container } = render(<LoginPage />);
    const centeredContainer = container.querySelector('.flex.items-center.justify-center');
    
    expect(centeredContainer).toBeInTheDocument();
  });
});
