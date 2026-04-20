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

  it('deve permitir editar o conteúdo de blocos de texto via campo de texto', () => {
    render(<EditorPropertiesPanel block={mockBlock} onChange={mockOnChange} onDelete={jest.fn()} />);
    
    // Procura o campo de edição de conteúdo (textarea ou input)
    const contentInput = screen.getByLabelText(/conteúdo/i);
    fireEvent.change(contentInput, { target: { value: 'Texto Editado' } });
    
    expect(mockOnChange).toHaveBeenCalledWith(expect.objectContaining({
      content: 'Texto Editado'
    }));
  });

  it('deve exibir o seletor de severidade e ajuste de altura para blocos de tabela', () => {
    const tableBlock: EditorBlock = { ...mockBlock, type: 'table', config: { severityFilter: 'Todos' } };
    render(<EditorPropertiesPanel block={tableBlock} onChange={mockOnChange} onDelete={jest.fn()} />);
    
    expect(screen.getByLabelText(/filtrar por severidade/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/ajustar altura ao conteúdo/i)).toBeInTheDocument();
  });

  it('deve chamar onChange ao trocar o filtro de severidade', () => {
    const tableBlock: EditorBlock = { ...mockBlock, type: 'table', config: { severityFilter: 'Todos' } };
    render(<EditorPropertiesPanel block={tableBlock} onChange={mockOnChange} onDelete={jest.fn()} />);
    
    const select = screen.getByLabelText(/filtrar por severidade/i);
    fireEvent.change(select, { target: { value: 'Crítico' } });
    
    expect(mockOnChange).toHaveBeenCalledWith(expect.objectContaining({
      config: expect.objectContaining({ severityFilter: 'Crítico' })
    }));
  });
});
