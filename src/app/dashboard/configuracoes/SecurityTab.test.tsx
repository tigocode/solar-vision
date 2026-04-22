import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SecurityTab from './SecurityTab';

// Mock do storage
jest.mock('@/utils/storage', () => ({
  getStoredUsers: jest.fn(),
  saveUser: jest.fn(),
  deleteUser: jest.fn(),
  getAuditLogs: jest.fn(),
  saveAuditLog: jest.fn(),
}));

import { getStoredUsers, getAuditLogs, saveUser } from '@/utils/storage';

describe('SecurityTab Component', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Setup Mock Returns
    (getStoredUsers as jest.Mock).mockReturnValue([
      { id: 'usr-1', name: 'Administrador SV', email: 'admin@solarvision.com', role: 'ADMIN', status: 'ACTIVE', companyName: 'Solar Vision', plantAccess: [], createdAt: new Date().toISOString() }
    ]);
    
    (getAuditLogs as jest.Mock).mockReturnValue([
       { id: 'lg-1', timestamp: new Date().toISOString(), action: 'SYSTEM_INIT', description: 'Sistema inicializado', userId: 'system', userName: 'System', severity: 'INFO' }
    ]);
  });

  test('Renderiza a tabela de usuários com o Admin inicial', () => {
    render(<SecurityTab />);
    
    expect(screen.getByText('Controle de Acesso e Segurança')).toBeInTheDocument();
    expect(screen.getByText('Administrador SV')).toBeInTheDocument();
    expect(screen.getByText('admin@solarvision.com')).toBeInTheDocument();
  });

  test('Abre o modal ao clicar em "Novo Usuário"', () => {
    render(<SecurityTab />);
    
    const novoUsuarioBtn = screen.getByText('Novo Usuário');
    fireEvent.click(novoUsuarioBtn);
    
    expect(screen.getByText('Convidar Usuário')).toBeInTheDocument();
  });

  test('Mostra o seletor de "Vinculação de Ativos" apenas quando a role for Cliente', async () => {
    render(<SecurityTab />);
    
    // Abre o modal
    fireEvent.click(screen.getByText('Novo Usuário'));
    
    // Verifica campo Role (default é CLIENT)
    const roleSelect = screen.getByLabelText(/Tipo de Acesso \(Função\)/i) || screen.getByRole('combobox');
    
    // Como CLIENT é o default no nosso plano, a vinculação já deve aparecer
    expect(screen.getByText('Vinculação de Ativos')).toBeInTheDocument();
    
    // Troca para OPERATOR
    fireEvent.change(roleSelect, { target: { value: 'OPERATOR' } });
    
    // A vinculação deve sumir
    await waitFor(() => {
      expect(screen.queryByText('Vinculação de Ativos')).not.toBeInTheDocument();
    });
  });

  test('Simula o cadastro de um novo Cliente via Email/Convite (Mock de UI)', async () => {
    render(<SecurityTab />);
    
    // Abre modal
    fireEvent.click(screen.getByText('Novo Usuário'));
    
    // Preenche campos
    const nameInput = screen.getByLabelText(/Nome/i) || screen.getByRole('textbox', { name: /nome/i });
    const emailInput = screen.getByLabelText(/E-mail/i) || screen.getByRole('textbox', { name: /e-mail/i });
    const empInput = screen.getByPlaceholderText('Ex: AES Brasil');
    
    fireEvent.change(nameInput, { target: { value: 'João Cliente' } });
    fireEvent.change(emailInput, { target: { value: 'joao@cliente.com' } });
    fireEvent.change(empInput, { target: { value: 'Minha Energia SA' } });
    
    // Clica no checkbox da usina (UFV Alpha deve aparecer nas opções MOCK_PLANTS)
    const ufvAlphaCheckbox = screen.getByLabelText('UFV Alpha', { exact: false }) as HTMLInputElement;
    if (ufvAlphaCheckbox) {
      fireEvent.click(ufvAlphaCheckbox);
      expect(ufvAlphaCheckbox.checked).toBe(true);
    }
    
    // Envia o formulário
    const submitBtn = screen.getByText('Enviar Convite');
    fireEvent.click(submitBtn);
    
    // Verifica se `saveUser` foi chamado
    await waitFor(() => {
      expect(saveUser).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'João Cliente',
          email: 'joao@cliente.com',
          role: 'CLIENT',
          companyName: 'Minha Energia SA'
        })
      );
    });
  });
});
