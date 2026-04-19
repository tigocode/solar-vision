import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import EditorTopbar from '../EditorTopbar';

describe('EditorTopbar', () => {
  const mockOnSave = jest.fn();

  it('deve exibir erro de validação ao tentar salvar um template sem nome', async () => {
    render(<EditorTopbar onSave={mockOnSave} initialName="" />);
    
    const saveButton = screen.getByText(/salvar/i);
    fireEvent.click(saveButton);
    
    // Deve exibir mensagem de erro para o campo obrigatório
    expect(await screen.findByText(/nome do template é obrigatório/i)).toBeInTheDocument();
    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it('deve chamar a função de salvamento quando o nome é válido', async () => {
    render(<EditorTopbar onSave={mockOnSave} initialName="Template Válido" />);
    
    const saveButton = screen.getByText(/salvar/i);
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith(expect.objectContaining({
        name: 'Template Válido'
      }));
    });
  });

  it('deve permitir a edição do nome do template diretamente na barra superior', () => {
    render(<EditorTopbar onSave={mockOnSave} initialName="Nome Antigo" />);
    
    const input = screen.getByDisplayValue('Nome Antigo');
    fireEvent.change(input, { target: { value: 'Novo Nome' } });
    
    expect(input).toHaveValue('Novo Nome');
  });
});
