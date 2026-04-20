import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import EditorCanvas from '../EditorCanvas';
import { Template } from '@/types/templates';

const mockTemplate: Template = {
  id: 'temp-1',
  name: 'Relatório Normativo',
  lastEdited: new Date().toISOString(),
  pages: [
    { 
      id: 'page-1', 
      blocks: [
        {
          id: 'table-1',
          type: 'table',
          x: 0, y: 0, width: 500, height: 300,
          config: { severityFilter: 'Crítico' }
        }
      ] 
    }
  ],
  theme: { primaryColor: '#000000', secondaryColor: '#ffffff', fontFamily: 'Inter' }
};

describe('EditorCanvas - Modo de Visualização e Filtros', () => {
  const mockSetZoom = jest.fn();
  const mockSetPageIndex = jest.fn();

  it('deve esconder os controles de zoom e navegação quando hideUI for verdadeiro', () => {
    render(
      <EditorCanvas 
        template={mockTemplate} 
        currentPageIndex={0} 
        setCurrentPageIndex={mockSetPageIndex}
        zoom={100}
        setZoom={mockSetZoom}
        selectedBlockId={null}
        setSelectedBlockId={jest.fn()}
        onUpdateBlockGeometry={jest.fn()}
        onAddPage={jest.fn()}
        hideUI={true}
      />
    );
    
    // O indicador de página (que faz parte da UI) não deve estar presente no modo limpo
    expect(screen.queryByText(/Página 1 de/i)).not.toBeInTheDocument();
  });

  it('deve renderizar o bloco seguindo a Norma IEC TS 62446-3 (Térmica + RGB)', () => {
    const iecTemplate: Template = {
      ...mockTemplate,
      pages: [{
        id: 'p1',
        blocks: [{
          id: 'iec-1',
          type: 'thermal_map',
          x: 0, y: 0, width: 400, height: 400
        }]
      }]
    };

    render(
      <EditorCanvas 
        template={iecTemplate} 
        currentPageIndex={0} 
        setCurrentPageIndex={mockSetPageIndex}
        zoom={100}
        setZoom={mockSetZoom}
        selectedBlockId={null}
        setSelectedBlockId={jest.fn()}
        onUpdateBlockGeometry={jest.fn()}
        onAddPage={jest.fn()}
        hideUI={true}
      />
    );

    expect(screen.getByText(/Visual \(RGB\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Térmica/i)).toBeInTheDocument();
  });

  it('deve aplicar o atributo crossOrigin="anonymous" em todas as imagens', () => {
    // Teste para garantir conformidade CORS no PDF
    const templateWithImages: Template = {
      ...mockTemplate,
      pages: [{
        id: 'p1',
        blocks: [
          { id: 'b1', type: 'thermal_map', x: 0, y: 0, width: 400, height: 400 }
        ]
      }]
    };

    render(
      <EditorCanvas 
        template={templateWithImages} 
        currentPageIndex={0} 
        setCurrentPageIndex={mockSetPageIndex}
        zoom={100}
        setZoom={mockSetZoom}
        selectedBlockId={null}
        setSelectedBlockId={jest.fn()}
        onUpdateBlockGeometry={jest.fn()}
        onAddPage={jest.fn()}
      />
    );
    
    // O thermal_map deve renderizar pelo menos 2 imagens (Térmica e RGB)
    const images = screen.getAllByRole('img');
    expect(images.length).toBeGreaterThanOrEqual(2);
    images.forEach(img => {
      expect(img).toHaveAttribute('crossOrigin', 'anonymous');
      expect(img).toHaveAttribute('loading', 'eager');
      expect(img).toHaveAttribute('decoding', 'sync');
    });
  });

  it('deve calcular corretamente o marginBottom baseado no zoom para evitar sobreposição de páginas', () => {
    // Verificamos se o estilo de margem inferior é aplicado proporcionalmente à escala
    const { getByTestId, rerender } = render(
      <EditorCanvas 
        template={mockTemplate} 
        currentPageIndex={0} 
        setCurrentPageIndex={mockSetPageIndex}
        zoom={50} // 50% de zoom
        setZoom={mockSetZoom}
        selectedBlockId={null}
        setSelectedBlockId={jest.fn()}
        onUpdateBlockGeometry={jest.fn()}
        onAddPage={jest.fn()}
        hideUI={true}
      />
    );

    const canvas = getByTestId('document-canvas');
    // Em 50% de zoom, a compensação deve ser de -561.5px (metade da altura de 1123px)
    // Usamos regex para ignorar espaços extras nas propriedades de estilo
    expect(canvas.style.marginBottom).toBe('-561.5px');
  });

  it('não deve aplicar o atributo crossOrigin em imagens locais ou caminhos relativos', () => {
    const templateWithLocalLogo: Template = {
      ...mockTemplate,
      pages: [{
        id: 'p1',
        blocks: [{ id: 'b1', type: 'header', x: 0, y: 0, width: 794, height: 100 }]
      }]
    };

    render(
      <EditorCanvas 
        template={templateWithLocalLogo} 
        currentPageIndex={0} 
        setCurrentPageIndex={jest.fn()}
        zoom={100}
        setZoom={jest.fn()}
        selectedBlockId={null}
        setSelectedBlockId={jest.fn()}
        onUpdateBlockGeometry={jest.fn()}
        onAddPage={jest.fn()}
        brandLogo="/local-logo.png" // Caminho relativo
      />
    );
    
    const logo = screen.getByRole('img');
    expect(logo).not.toHaveAttribute('crossOrigin');
  });

  it('deve renderizar a tabela sem overflow-auto quando o ajuste de altura ao conteúdo estiver ativo', () => {
    const autoHeightTemplate: Template = {
      ...mockTemplate,
      pages: [{
        id: 'p1',
        blocks: [{
          id: 't-1',
          type: 'table',
          x: 0, y: 0, width: 500, height: 300,
          config: { autoHeight: true }
        }]
      }]
    };

    const { container } = render(
      <EditorCanvas 
        template={autoHeightTemplate} 
        currentPageIndex={0} 
        setCurrentPageIndex={jest.fn()}
        zoom={100}
        setZoom={jest.fn()}
        selectedBlockId={null}
        setSelectedBlockId={jest.fn()}
        onUpdateBlockGeometry={jest.fn()}
        onAddPage={jest.fn()}
      />
    );
    
    // Buscamos o contêiner interno da tabela especificamente via testid
    const tableBlock = screen.getByTestId('table-block-t-1');
    const tableScrollContainer = tableBlock.querySelector('.overflow-auto');
    
    // Se autoHeight estiver ativo, o contêiner interno não deve ter overflow-auto para permitir crescimento
    expect(tableScrollContainer).not.toBeInTheDocument();
  });
});
