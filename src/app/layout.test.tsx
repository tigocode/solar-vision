import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import RootLayout from './layout';

describe('RootLayout', () => {
  it('deve renderizar os elementos filhos corretamente', () => {
    render(
      <RootLayout>
        <div data-testid="child">Conteúdo de Teste</div>
      </RootLayout>
    );
    
    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByText('Conteúdo de Teste')).toBeInTheDocument();
  });

  // Nota: JSDOM não valida tags <html> e <body> da mesma forma que o Next.js no servidor,
  // mas podemos verificar se o componente renderiza o que é esperado.
});
