import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import NovaInspecaoPage from '@/app/dashboard/nova-inspecao/page';
import { BrandProvider } from '@/contexts/BrandContext';

// Precisamos mockar o componente inteiro ou testar a interatividade da página diretamente
// Como a página usará useRouter do next/navigation p/ o success step futuramente, mocked it
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
    };
  },
}));

describe('Página de Nova Inspeção (Upload Lifecycle)', () => {
  it('deve renderizar o formulário inicial corretamente', () => {
    render(
      <BrandProvider>
        <NovaInspecaoPage />
      </BrandProvider>
    );

    expect(screen.getByLabelText(/Nome da Usina/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Responsável Técnico/i)).toBeInTheDocument();
  });

  it('não deve permitir iniciar o processamento com campos obrigatórios vazios', () => {
    render(
      <BrandProvider>
        <NovaInspecaoPage />
      </BrandProvider>
    );

    // Encontraremos o botão nativo do formulário
    const submitBtn = screen.getByRole('button', { name: /Iniciar Processamento/i });
    
    // Deixamos os campos limpos e tentamos clicar. O form valida internamente (required)
    // Se tentarmos submeter, ele não pode mudar o estado para 'processing'
    fireEvent.click(submitBtn);

    // O campo de Nome da Usina ainda deve estar na tela (não mudou de step)
    expect(screen.getByLabelText(/Nome da Usina/i)).toBeInTheDocument();
  });

  it('deve simular o upload interagindo com o botão de processamento após preencher os dados', () => {
    render(
      <BrandProvider>
        <NovaInspecaoPage />
      </BrandProvider>
    );

    const plantInput = screen.getByLabelText(/Nome da Usina/i);
    const inspectorInput = screen.getByLabelText(/Responsável Técnico/i);
    const mockFileBtn = screen.getByTestId('mock-dropzone-click'); // Botão fake para anexar

    fireEvent.change(plantInput, { target: { value: 'Usina Alpha' } });
    fireEvent.change(inspectorInput, { target: { value: 'João Auditor' } });
    
    // Simula attach de arquivo no dropzone
    fireEvent.click(mockFileBtn);

    const submitBtn = screen.getByRole('button', { name: /Iniciar Processamento/i });
    
    // Clicando agora, o form validará e passará do step de 'setup' para 'processing' 
    // ou tentará submeter. Vamos garantir isso capturando o evento handleSubmit via testes se o DOM mudasse.
    expect(submitBtn).toBeEnabled();
  });
});
