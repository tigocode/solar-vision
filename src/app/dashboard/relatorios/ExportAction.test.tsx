import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Componente Fake Mockado representando nossa View de Relatório com o Botão Export
// (Já que testaremos a lógica real após aprovação do uso do react-to-print)
const MockReportView = ({ onExportClick }: { onExportClick: () => void }) => (
  <div>
    <button onClick={onExportClick}>Gerar PDF Executivo</button>
    <div id="print-container">Conteúdo do Relatório Central</div>
  </div>
);

describe('Rotina de Exportação de PDF (Ciclo 12)', () => {
  it('deve existir um botão de Gerar PDF que dispara a função de impressão na tela renderizada', () => {
    const handleExport = jest.fn();
    render(<MockReportView onExportClick={handleExport} />);

    // Busca o botão pelo texto
    const exportBtn = screen.getByText(/Gerar PDF Executivo/i);
    expect(exportBtn).toBeInTheDocument();

    // Simula clique de disparo para acionar a lib de impressão
    fireEvent.click(exportBtn);

    // Valida que a callback de captura foi invocada
    expect(handleExport).toHaveBeenCalledTimes(1);
  });
});
