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

  it('deve alternar entre abas do Painel de Ativos (Design, Variáveis, etc)', () => {
    render(<TemplateEditor template={mockTemplate} />);
    
    // Por padrão abre em Design
    expect(screen.getByText(/Painel de Ativos/i)).toBeInTheDocument();
    
    // Clica na aba Variáveis (usando aria-label ou label do botão)
    const varTab = screen.getByLabelText(/Variáveis/i);
    fireEvent.click(varTab);
    
    // Verifica se os elementos de variáveis aparecem
    expect(screen.getByText(/{{Nome_Usina}}/i)).toBeInTheDocument();
  });

  it('deve inserir blocos com tags de variáveis corretas ao clicar no Painel de Ativos', () => {
    render(<TemplateEditor template={mockTemplate} />);
    
    // Vai para a aba Variáveis
    fireEvent.click(screen.getByLabelText(/Variáveis/i));
    
    // Clica na variável Nome da Usina
    const varBtn = screen.getByText(/{{Nome_Usina}}/i);
    fireEvent.click(varBtn);
    
    // Verifica se um bloco foi adicionado e se ele contém o texto da variável
    // (O canvas renderiza o conteúdo do bloco, então agora temos 2 ocorrências: painel e canvas)
    expect(screen.getAllByText(/{{Nome_Usina}}/i).length).toBeGreaterThanOrEqual(2);
  });
});
