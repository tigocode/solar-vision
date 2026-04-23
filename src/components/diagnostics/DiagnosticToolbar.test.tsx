import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DiagnosticToolbar from './DiagnosticToolbar';
import { Severity, AnomalyStatus } from '@/types/anomalies';

describe('DiagnosticToolbar Component', () => {
  const mockOnSearch = jest.fn();
  const mockOnFilterChange = jest.fn();
  const mockOnClear = jest.fn();

  const defaultProps = {
    searchQuery: '',
    onSearch: mockOnSearch,
    activeFilters: {
      severity: [] as Severity[],
      status: [] as AnomalyStatus[]
    },
    onFilterChange: mockOnFilterChange,
    onClear: mockOnClear
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve chamar onSearch ao digitar no campo de busca', () => {
    render(<DiagnosticToolbar {...defaultProps} />);
    
    const searchInput = screen.getByPlaceholderText(/buscar por id ou falha/i);
    fireEvent.change(searchInput, { target: { value: 'PT-01' } });
    
    // O debounce pode ser testado se implementado, 
    // mas aqui validamos a intenção do componente de emitir a busca.
    expect(mockOnSearch).toHaveBeenCalledWith('PT-01');
  });

  it('deve chamar onFilterChange ao clicar em um filtro de severidade', () => {
    render(<DiagnosticToolbar {...defaultProps} />);
    
    const criticalBtn = screen.getByText('Crítico');
    fireEvent.click(criticalBtn);
    
    expect(mockOnFilterChange).toHaveBeenCalledWith('severity', 'Crítico');
  });

  it('deve chamar onFilterChange ao selecionar um status no dropdown', () => {
    render(<DiagnosticToolbar {...defaultProps} />);
    
    // Simulando a abertura e seleção do status se for um select padrão ou customizado
    const statusSelect = screen.getByRole('combobox');
    fireEvent.change(statusSelect, { target: { value: 'Resolvido' } });
    
    expect(mockOnFilterChange).toHaveBeenCalledWith('status', 'Resolvido');
  });

  it('deve chamar onClear ao clicar no botão de limpar filtros', () => {
    render(<DiagnosticToolbar {...defaultProps} />);
    
    const clearBtn = screen.getByText(/limpar/i);
    fireEvent.click(clearBtn);
    
    expect(mockOnClear).toHaveBeenCalled();
  });

  it('deve exibir os filtros ativos visualmente (estado de selecionado)', () => {
    const propsWithFilters = {
      ...defaultProps,
      activeFilters: {
        severity: ['Crítico'] as Severity[],
        status: ['Resolvido'] as AnomalyStatus[]
      }
    };
    
    render(<DiagnosticToolbar {...propsWithFilters} />);
    
    const criticalBtn = screen.getByText('Crítico');
    // Verificamos se possui uma classe de destaque (ex: bg-indigo-600)
    expect(criticalBtn.parentElement).toHaveClass('bg-indigo-600');
  });
});
