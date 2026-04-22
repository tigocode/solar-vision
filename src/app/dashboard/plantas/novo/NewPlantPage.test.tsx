import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import NewPlantPage from './page';
import { UIProvider } from '@/hooks/useUI';

// Mock UI Context and Navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/dashboard/plantas/novo',
}));

jest.mock('@/contexts/BrandContext', () => ({
  useBrand: () => ({
    brand: { primaryColor: '#000', companyName: 'Solar Vision' }
  })
}));

describe('NewPlantPage - TDD Contracts for Lifecycle & Client Restricted View', () => {

  test('Deve ser capaz de renderizar a lista de projetos, não só um formulário efêmero', async () => {
    render(
      <UIProvider>
        <NewPlantPage />
      </UIProvider>
    );
    // Deve haver um botão visual ou seção que represente a lista de projetos ativos do usuário
    expect(screen.getByText(/Projetos Ativos/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Novo Projeto/i })).toBeInTheDocument();
  });

  test('Deve derivar os formulários de UFV a partir da quantidade de layouts enviados na Etapa 2 (Projeto)', () => {
    // Rendemos no modo padrão (Operator)
    render(
      <UIProvider>
        <NewPlantPage />
      </UIProvider>
    );

    // Simula abrir o formulário
    const novoProjBtn = screen.getByRole('button', { name: /Novo Projeto/i });
    fireEvent.click(novoProjBtn);

    // Clica no radio para Complexo
    const complexRadio = screen.getByLabelText(/Complexo Solar/i);
    fireEvent.click(complexRadio);

    // Preenche o nome do complexo para permitir avançar
    const nomeComplexoInput = screen.getByPlaceholderText(/Ex: Complexo Pirapora/i);
    fireEvent.change(nomeComplexoInput, { target: { value: 'Complexo Secundário' } });
    
    // Na Etapa 1 (Registro), subUnits e a Imagem 1 foram erradicados. Somente o nome e o radio ficam.
    // Avançamos para a Etapa 2 (Projeto)
    const avancarBtn = screen.getByRole('button', { name: /Avançar/i });
    fireEvent.click(avancarBtn);

    // Agora na Etapa 2, simulamos o envio de 2 arquivos de layout
    const simulateUploadBtn = screen.getByRole('button', { name: /Simular Envio de Layout/i });
    
    // Primeiro Layout Enviado
    fireEvent.click(simulateUploadBtn);
    // Segundo Layout Enviado
    fireEvent.click(simulateUploadBtn);

    // Verificamos se apareceram os campos mapeados (2 de cada, vindos da Imagem 1 e Imagem 2)
    const nomeUfvInputs = screen.getAllByPlaceholderText(/Nome da UFV/i);
    expect(nomeUfvInputs.length).toBe(2);

    const mwpInputs = screen.getAllByPlaceholderText(/MWp/i);
    expect(mwpInputs.length).toBe(2);

    const modulesInputs = screen.getAllByLabelText(/QTD. MÓDULOS/i);
    expect(modulesInputs.length).toBe(2);
    
    const stringsInputs = screen.getAllByLabelText(/Nº STRINGS/i);
    expect(stringsInputs.length).toBe(2);

    const inverterInputs = screen.getAllByLabelText(/INVERSOR/i);
    expect(inverterInputs.length).toBe(2);
  });

  test('Regra de Isolamento (CLIENT): O Cliente só pode interagir com o Upload de PDF e visualização geral', () => {
    // Para simplificar, testamos mudando o viewMode implicitamente usando a injeção do UI
    // Neste teste mockado, apenas consideraremos que a UI é montada e lê o client
    // Você deve criar lógica na interface garantindo que as labels "Financeiro" e "Gestão" da direita existam (timeline), 
    // mas que na esquerda ("Formulários"), apenas o Projeto (Layout) consiga ser usado.
    
    // O mock UIProvider neste caso será configurado por fora ou na implementação final 
    // lerá localStorage('solarvision-viewmode') == 'client'. Isso é responsabilidade da view.
  });

});
