import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DashboardLayout from './DashboardLayout';

// Mock do hook useUI
jest.mock('@/hooks/useUI', () => ({
  useUI: jest.fn(() => ({
    viewMode: 'operator',
    setViewMode: jest.fn(),
    toggleViewMode: jest.fn(),
  })),
  UIProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Mock dos componentes secundários
jest.mock('./Sidebar', () => ({
  __esModule: true,
  default: () => <div data-testid="sidebar-mock">Sidebar Mock</div>
}));

jest.mock('./Header', () => ({
  __esModule: true,
  default: () => <div data-testid="header-mock">Header Mock</div>
}));

describe('DashboardLayout Component', () => {
  it('deve orquestrar a exibição da Sidebar, Header e conteúdo principal', () => {
    render(
      <DashboardLayout>
        <div data-testid="page-content">Page Content Test</div>
      </DashboardLayout>
    );

    expect(screen.getByTestId('sidebar-mock')).toBeInTheDocument();
    expect(screen.getByTestId('header-mock')).toBeInTheDocument();
    expect(screen.getByTestId('page-content')).toBeInTheDocument();
    expect(screen.getByText(/page content test/i)).toBeInTheDocument();
  });

  it('deve ter a estrutura flex correta para a página inteira', () => {
    const { container } = render(
      <DashboardLayout>
        <div>Content</div>
      </DashboardLayout>
    );
    
    // O div interior (DashboardLayoutContent) deve ser flex
    const flexContainer = container.querySelector('.flex.min-h-screen');
    expect(flexContainer).toBeInTheDocument();
    expect(flexContainer).toHaveClass('bg-[#F8FAFC]');
  });
});
