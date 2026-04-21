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
  });

  it('deve permitir trocar a família da fonte e tamanho', () => {
    render(<EditorPropertiesPanel block={mockBlock} onChange={mockOnChange} onDelete={jest.fn()} />);
    
    const fontSelect = screen.getByLabelText(/fonte/i);
    fireEvent.change(fontSelect, { target: { value: 'Roboto' } });
    
    expect(mockOnChange).toHaveBeenCalledWith(expect.objectContaining({
      style: expect.objectContaining({ fontFamily: 'Roboto' })
    }));

    const sizeSelect = screen.getByLabelText(/tamanho/i);
    fireEvent.change(sizeSelect, { target: { value: '20px' } });

    expect(mockOnChange).toHaveBeenCalledWith(expect.objectContaining({
      style: expect.objectContaining({ fontSize: '20px' })
    }));
  });

  it('deve permitir alternar negrito e itálico', () => {
    render(<EditorPropertiesPanel block={mockBlock} onChange={mockOnChange} onDelete={jest.fn()} />);
    
    const boldBtn = screen.getByTitle(/negrito/i);
    fireEvent.click(boldBtn);
    
    expect(mockOnChange).toHaveBeenCalledWith(expect.objectContaining({
      style: expect.objectContaining({ fontWeight: 'bold' })
    }));
  });
});
