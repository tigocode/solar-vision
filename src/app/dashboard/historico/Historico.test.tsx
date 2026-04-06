import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import HistoricoPage from '@/app/dashboard/historico/page';
import { BrandProvider } from '@/contexts/BrandContext';

describe('Página de Histórico da Timeline (Ciclo 13)', () => {
  it('deve renderizar a tela de histórico com a lista inicial de unidades', () => {
    render(
      <BrandProvider>
        <HistoricoPage />
      </BrandProvider>
    );

    // O título deve estar presente
    expect(screen.getByText(/Histórico de Inspeções/i)).toBeInTheDocument();

    // Uma de nossas usinas mockadas no plano precisa aparecer
    expect(screen.getByText(/UFV Alpha/i)).toBeInTheDocument();
  });

  it('deve filtrar unidades usando o campo de busca textual', () => {
    render(
      <BrandProvider>
        <HistoricoPage />
      </BrandProvider>
    );

    // Encontra o input de busca (Search bar)
    const searchInput = screen.getByPlaceholderText(/Buscar por unidade/i);

    // Simula digitando o alvo 'Beta' no input
    fireEvent.change(searchInput, { target: { value: 'Beta' } });

    // A usina Beta agora deve estar na tela
    expect(screen.getByText(/UFV Beta/i)).toBeInTheDocument();

    // A usina Alpha deve sumir da lista pois não match o search
    expect(screen.queryByText(/UFV Alpha/i)).not.toBeInTheDocument();
  });
});
