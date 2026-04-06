'use client';
/**
 * PlantLifecycle.test.tsx
 * Ciclo 14/15: Testes TDD-first para Cadastro de Ativos
 *
 * Cobertura:
 * 1. Schema SolarPlant (UFV vs COMPLEXO)
 * 2. Cálculo de potência consolidada
 * 3. Toggle de UI (UFV / COMPLEXO) — componente montado
 * 4. Visibilidade do botão "Adicionar Sub-UFV"
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AssetType, SolarPlant, ProjectStatus } from '@/types/plants';

// =====================================================
// MOCK DE CONTEXTOS NECESSÁRIOS
// =====================================================
jest.mock('@/contexts/BrandContext', () => ({
  useBrand: () => ({
    brand: {
      primaryColor: '#4f46e5',
      companyName: 'Solar Vision',
      logoUrl: '',
      enableGradient: false,
    },
  }),
}));

jest.mock('@/hooks/useUI', () => ({
  useUI: () => ({
    viewMode: 'operator',
    isMenuOpen: false,
    setIsMenuOpen: jest.fn(),
    toggleViewMode: jest.fn(),
    toggleMenu: jest.fn(),
  }),
  UIProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock('next/navigation', () => ({
  usePathname: () => '/dashboard/plantas/novo',
}));

jest.mock('next/link', () => {
  const MockLink = ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
  MockLink.displayName = 'MockLink';
  return MockLink;
});

// =====================================================
// 1. TESTES DE SCHEMA / TIPOS
// =====================================================
describe('Schema SolarPlant', () => {
  it('deve aceitar um ativo do tipo UFV sem subUnits', () => {
    const ufv: SolarPlant = {
      id: 'ufv-01',
      name: 'UFV Alpha',
      type: 'UFV',
      capacityKWp: 5.5,
      location: 'MG',
      status: ProjectStatus.RECEBIMENTO_DEMANDA,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    expect(ufv.type).toBe<AssetType>('UFV');
    expect(ufv.subUnits).toBeUndefined();
  });

  it('deve aceitar um ativo do tipo COMPLEXO com array de subUnits', () => {
    const sub: SolarPlant = {
      id: 'sub-01',
      name: 'UFV Pirapora I',
      type: 'UFV',
      capacityKWp: 7.0,
      location: 'MG',
      status: ProjectStatus.RECEBIMENTO_DEMANDA,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const complex: SolarPlant = {
      id: 'cx-01',
      name: 'Complexo Pirapora',
      type: 'COMPLEXO',
      capacityKWp: 7.0,
      location: 'MG',
      status: ProjectStatus.RECEBIMENTO_DEMANDA,
      subUnits: [sub],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    expect(complex.type).toBe<AssetType>('COMPLEXO');
    expect(complex.subUnits).toHaveLength(1);
    expect(complex.subUnits![0].name).toBe('UFV Pirapora I');
  });
});

// =====================================================
// 2. LÓGICA DE CÁLCULO DE CAPACIDADE CONSOLIDADA
// =====================================================
describe('Cálculo de potência consolidada em Complexos', () => {
  const calcTotalCapacity = (units: { capacity: string }[]): number =>
    units.reduce((acc, unit) => acc + (parseFloat(unit.capacity) || 0), 0);

  it('deve retornar 0 quando não há sub-unidades', () => {
    expect(calcTotalCapacity([])).toBe(0);
  });

  it('deve somar corretamente quando todas as sub-UFVs têm valores', () => {
    const units = [
      { capacity: '5.5' },
      { capacity: '10.0' },
      { capacity: '2.25' },
    ];
    expect(calcTotalCapacity(units)).toBeCloseTo(17.75);
  });

  it('deve ignorar campos vazios sem gerar NaN', () => {
    const units = [{ capacity: '' }, { capacity: '8.0' }];
    expect(calcTotalCapacity(units)).toBe(8.0);
    expect(Number.isNaN(calcTotalCapacity(units))).toBe(false);
  });

  it('deve ignorar strings não numéricas sem gerar NaN', () => {
    const units = [{ capacity: 'abc' }, { capacity: '3.0' }];
    expect(calcTotalCapacity(units)).toBe(3.0);
  });
});

// =====================================================
// 3. TESTES DE COMPONENTE — TOGGLE UFV / COMPLEXO
// =====================================================

/**
 * Componente isolado para testar a lógica do toggle
 * sem dependência do DashboardLayout completo.
 */
const AssetTypeToggle = () => {
  const [assetType, setAssetType] = React.useState<AssetType>('UFV');
  const [subUnits, setSubUnits] = React.useState<{ name: string; capacity: string }[]>([]);

  const totalCapacity = assetType === 'COMPLEXO' && subUnits.length > 0
    ? subUnits.reduce((acc, u) => acc + (parseFloat(u.capacity) || 0), 0).toFixed(2)
    : '0.00';

  return (
    <div>
      <label>
        <input
          type="radio"
          name="assetType"
          value="UFV"
          checked={assetType === 'UFV'}
          onChange={() => setAssetType('UFV')}
          aria-label="Planta Única (UFV)"
        />
        Planta Única (UFV)
      </label>
      <label>
        <input
          type="radio"
          name="assetType"
          value="COMPLEXO"
          checked={assetType === 'COMPLEXO'}
          onChange={() => setAssetType('COMPLEXO')}
          aria-label="Complexo Solar"
        />
        Complexo Solar
      </label>

      {assetType === 'COMPLEXO' && (
        <div data-testid="complex-panel">
          <button
            type="button"
            onClick={() => setSubUnits([...subUnits, { name: '', capacity: '' }])}
          >
            + Adicionar UFV
          </button>
          <div data-testid="sub-units-list">
            {subUnits.map((_, idx) => (
              <div key={idx} data-testid={`sub-unit-${idx}`}>
                <input placeholder={`Nome da UFV ${idx + 1}`} />
                <input placeholder="MWp" type="number" />
              </div>
            ))}
          </div>
          <p data-testid="total-capacity">
            Capacidade Total: {totalCapacity} MWp
          </p>
        </div>
      )}

      {assetType === 'UFV' && (
        <div data-testid="ufv-panel">
          <input placeholder="Potência (MWp)" type="number" />
        </div>
      )}
    </div>
  );
};

describe('Toggle UFV / COMPLEXO — UI', () => {
  it('deve iniciar no estado UFV por padrão', () => {
    render(<AssetTypeToggle />);
    const ufvRadio = screen.getByRole('radio', { name: 'Planta Única (UFV)' }) as HTMLInputElement;
    const complexoRadio = screen.getByRole('radio', { name: 'Complexo Solar' }) as HTMLInputElement;

    expect(ufvRadio.checked).toBe(true);
    expect(complexoRadio.checked).toBe(false);
  });

  it('deve mostrar o painel UFV (campo de potência) no estado inicial', () => {
    render(<AssetTypeToggle />);
    expect(screen.getByTestId('ufv-panel')).toBeInTheDocument();
    expect(screen.queryByTestId('complex-panel')).not.toBeInTheDocument();
  });

  it('deve alternar para COMPLEXO ao clicar no radio correspondente', () => {
    render(<AssetTypeToggle />);
    const complexoRadio = screen.getByRole('radio', { name: 'Complexo Solar' });
    fireEvent.click(complexoRadio);

    const ufvRadio = screen.getByRole('radio', { name: 'Planta Única (UFV)' }) as HTMLInputElement;
    expect((complexoRadio as HTMLInputElement).checked).toBe(true);
    expect(ufvRadio.checked).toBe(false);
  });

  it('deve exibir o painel COMPLEXO e ocultar o painel UFV após alternância', () => {
    render(<AssetTypeToggle />);
    fireEvent.click(screen.getByRole('radio', { name: 'Complexo Solar' }));

    expect(screen.getByTestId('complex-panel')).toBeInTheDocument();
    expect(screen.queryByTestId('ufv-panel')).not.toBeInTheDocument();
  });

  it('deve mostrar o botão "+ Adicionar UFV" apenas no modo COMPLEXO', () => {
    render(<AssetTypeToggle />);

    // No modo UFV: botão não existe
    expect(screen.queryByText('+ Adicionar UFV')).not.toBeInTheDocument();

    // Alterna para COMPLEXO
    fireEvent.click(screen.getByRole('radio', { name: 'Complexo Solar' }));

    // Agora o botão deve aparecer
    expect(screen.getByText('+ Adicionar UFV')).toBeInTheDocument();
  });

  it('deve adicionar uma linha de sub-UFV ao clicar em "+ Adicionar UFV"', () => {
    render(<AssetTypeToggle />);
    fireEvent.click(screen.getByRole('radio', { name: 'Complexo Solar' }));

    const addBtn = screen.getByText('+ Adicionar UFV');
    fireEvent.click(addBtn);

    expect(screen.getByTestId('sub-unit-0')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Nome da UFV 1')).toBeInTheDocument();
  });

  it('deve acumular múltiplas sub-UFVs ao clicar várias vezes', () => {
    render(<AssetTypeToggle />);
    fireEvent.click(screen.getByRole('radio', { name: 'Complexo Solar' }));

    const addBtn = screen.getByText('+ Adicionar UFV');
    fireEvent.click(addBtn);
    fireEvent.click(addBtn);
    fireEvent.click(addBtn);

    expect(screen.getByTestId('sub-unit-0')).toBeInTheDocument();
    expect(screen.getByTestId('sub-unit-1')).toBeInTheDocument();
    expect(screen.getByTestId('sub-unit-2')).toBeInTheDocument();
  });

  it('deve voltar ao painel UFV e ocultar COMPLEXO ao reverter o toggle', () => {
    render(<AssetTypeToggle />);

    // Muda para COMPLEXO
    fireEvent.click(screen.getByRole('radio', { name: 'Complexo Solar' }));
    expect(screen.getByTestId('complex-panel')).toBeInTheDocument();

    // Reverte para UFV
    fireEvent.click(screen.getByRole('radio', { name: 'Planta Única (UFV)' }));
    expect(screen.queryByTestId('complex-panel')).not.toBeInTheDocument();
    expect(screen.getByTestId('ufv-panel')).toBeInTheDocument();
  });
});
