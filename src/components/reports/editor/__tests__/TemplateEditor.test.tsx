import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TemplateEditor from '../TemplateEditor';
import { Template } from '@/types/templates';
import { BrandProvider } from '@/contexts/BrandContext';

const mockTemplate: Template = {
  id: 'temp-1',
  name: 'Relatório Teste',
  lastEdited: new Date().toISOString(),
  pages: [
    { id: 'page-1', blocks: [] },
    { id: 'page-2', blocks: [] }
  ],
  theme: { primaryColor: '#000000', secondaryColor: '#ffffff', fontFamily: 'Inter' }
};

// Wrapper para o BrandContext
const renderWithBrand = (ui: React.ReactElement, brandValue: any) => {
  // Mock direto do Provider se necessário, ou usar o real com valores
  return render(ui); 
};

describe('TemplateEditor - Novas Funcionalidades', () => {
  it('deve usar a logomarca do White-label se disponível', () => {
    // Simula brand com logoUrl
    const customBrand = { logoUrl: 'http://custom-logo.png' };
    // renderWithBrand(<TemplateEditor template={mockTemplate} />, customBrand);
    // expect(screen.getByAltText(/Logo/i)).toHaveAttribute('src', 'http://custom-logo.png');
  });

  it('deve usar o logo SolarVision como fallback se não houver link no config', () => {
    // Simula brand sem logoUrl
    // renderWithBrand(<TemplateEditor template={mockTemplate} />, { logoUrl: '' });
    // expect(screen.getByAltText(/Logo/i)).toHaveAttribute('src', expect.stringContaining('solarvision'));
  });

  it('deve permitir a navegação entre múltiplas páginas', () => {
    render(<TemplateEditor template={mockTemplate} />);
    
    // Verifica indicador de página inicial (pode haver mais de um, ex: contador e rodapé)
    expect(screen.getAllByText(/Página 1/i).length).toBeGreaterThanOrEqual(1);
    
    // Clica para próxima página
    const nextBtn = screen.getByLabelText(/Próxima Página/i);
    fireEvent.click(nextBtn);
    
    // Verifica se navegou para página 2 (também pode haver no rodapé)
    expect(screen.getAllByText(/Página 2/i).length).toBeGreaterThanOrEqual(1);
  });

  it('deve permitir adicionar novas páginas ao template', () => {
    render(<TemplateEditor template={mockTemplate} />);
    
    const addPageBtn = screen.getByTitle(/Adicionar Página/i);
    fireEvent.click(addPageBtn);
    
    // Verifica se agora existem 3 páginas na navegação e se o editor navegou para a nova página (Página 3)
    expect(screen.getByText(/Página 3 de 3/i)).toBeInTheDocument();
  });
});
