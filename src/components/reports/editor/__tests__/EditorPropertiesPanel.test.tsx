import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import EditorPropertiesPanel from '../EditorPropertiesPanel';
import { EditorBlock } from '@/types/templates';

const mockBlock: EditorBlock = {
  id: 'block-1',
  type: 'text',
  x: 50,
  y: 50,
  width: 100,
  height: 50,
  content: 'Texto de Exemplo',
  style: {
    color: '#000000',
    textAlign: 'left',
    fontSize: '16px'
  }
};

describe('EditorPropertiesPanel', () => {
  const mockOnChange = jest.fn();

  it('deve exibir as propriedades do bloco selecionado', () => {
    render(<EditorPropertiesPanel block={mockBlock} onChange={mockOnChange} />);
    
    expect(screen.getByText(/propriedades/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/alinhamento/i)).toBeInTheDocument();
  });

  it('deve chamar onChange ao alterar o alinhamento', () => {
    render(<EditorPropertiesPanel block={mockBlock} onChange={mockOnChange} />);
    
    // Supondo botões de alinhamento [Esquerda, Centro, Direita]
    const centerAlignBtn = screen.getByLabelText(/alinhar ao centro/i);
    fireEvent.click(centerAlignBtn);
    
    expect(mockOnChange).toHaveBeenCalledWith(expect.objectContaining({
      style: expect.objectContaining({ textAlign: 'center' })
    }));
  });

  it('deve permitir a exclusão do elemento', () => {
    const mockOnDelete = jest.fn();
    render(<EditorPropertiesPanel block={mockBlock} onChange={mockOnChange} onDelete={mockOnDelete} />);
    
    const deleteBtn = screen.getByText(/remover elemento/i);
    fireEvent.click(deleteBtn);
    
    expect(mockOnDelete).toHaveBeenCalledWith('block-1');
  });
});
