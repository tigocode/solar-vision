import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrandProvider, useBrand } from './BrandContext';

// Componente auxiliar para testar o hook useBrand
const TestComponent = () => {
  const { brand, updateBrand, resetBrand } = useBrand();
  return (
    <div>
      <span data-testid="company-name">{brand.companyName}</span>
      <span data-testid="primary-color">{brand.primaryColor}</span>
      <button onClick={() => updateBrand({ companyName: 'Nova Empresa', primaryColor: '#ff0000' })}>
        Update
      </button>
      <button onClick={resetBrand}>Reset</button>
    </div>
  );
};

describe('BrandContext (White-label Logic)', () => {
  beforeEach(() => {
    // Reset da cor do documentElement para cada teste
    document.documentElement.style.setProperty('--primary-color', '');
  });

  it('deve inicializar com os valores padrão do Solar Vision', () => {
    render(
      <BrandProvider>
        <TestComponent />
      </BrandProvider>
    );

    expect(screen.getByTestId('company-name')).toHaveTextContent('Solar Vision');
    expect(screen.getByTestId('primary-color')).toHaveTextContent('#4f46e5');
  });

  it('deve atualizar os valores de marca e injetar a cor no CSS Variable', () => {
    render(
      <BrandProvider>
        <TestComponent />
      </BrandProvider>
    );

    const updateBtn = screen.getByText('Update');
    
    act(() => {
      updateBtn.click();
    });

    expect(screen.getByTestId('company-name')).toHaveTextContent('Nova Empresa');
    expect(screen.getByTestId('primary-color')).toHaveTextContent('#ff0000');
    
    // Validando a injeção no DOM real (o coração do White-label)
    expect(document.documentElement.style.getPropertyValue('--primary-color')).toBe('#ff0000');
  });

  it('deve resetar para os valores padrão ao chamar resetBrand', () => {
    render(
      <BrandProvider>
        <TestComponent />
      </BrandProvider>
    );

    act(() => {
      screen.getByText('Update').click();
    });

    act(() => {
      screen.getByText('Reset').click();
    });

    expect(screen.getByTestId('company-name')).toHaveTextContent('Solar Vision');
    expect(document.documentElement.style.getPropertyValue('--primary-color')).toBe('#4f46e5');
  });
});
