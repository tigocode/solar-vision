import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AnomalyActions from './AnomalyActions';
import { useUI } from '@/hooks/useUI';

// Mock do hook useUI
jest.mock('@/hooks/useUI');
const mockUseUI = useUI as jest.Mock;

describe('AnomalyActions Component', () => {
  const mockOnStatusChange = jest.fn();
  const mockOnCommentChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('NÃO deve renderizar nada se o viewMode for "client" (Regra 3)', () => {
    mockUseUI.mockReturnValue({ viewMode: 'client' });
    
    const { container } = render(
      <AnomalyActions 
        status="Pendente" 
        onStatusChange={mockOnStatusChange}
        onCommentChange={mockOnCommentChange}
      />
    );
    
    expect(container).toBeEmptyDOMElement();
  });

  it('deve renderizar botões de status e textarea se o viewMode for "operator"', () => {
    mockUseUI.mockReturnValue({ viewMode: 'operator' });
    
    render(
      <AnomalyActions 
        status="Pendente" 
        onStatusChange={mockOnStatusChange}
        onCommentChange={mockOnCommentChange}
      />
    );
    
    expect(screen.getByText(/Ações e Decisão Técnica/i)).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByText('Resolvido')).toBeInTheDocument();
    expect(screen.getByText('Falso Positivo')).toBeInTheDocument();
  });

  it('deve chamar onStatusChange ao clicar em um novo status', () => {
    mockUseUI.mockReturnValue({ viewMode: 'operator' });
    
    render(
      <AnomalyActions 
        status="Pendente" 
        onStatusChange={mockOnStatusChange}
        onCommentChange={mockOnCommentChange}
      />
    );
    
    const resolvedButton = screen.getByText('Resolvido');
    fireEvent.click(resolvedButton);
    
    expect(mockOnStatusChange).toHaveBeenCalledWith('Resolvido');
  });

  it('deve chamar onCommentChange ao digitar na justificativa', () => {
    mockUseUI.mockReturnValue({ viewMode: 'operator' });
    
    render(
      <AnomalyActions 
        status="Pendente" 
        onStatusChange={mockOnStatusChange}
        onCommentChange={mockOnCommentChange}
      />
    );
    
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'Justificativa de teste' } });
    
    expect(mockOnCommentChange).toHaveBeenCalledWith('Justificativa de teste');
  });
});
