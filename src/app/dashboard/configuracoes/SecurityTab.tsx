import React, { useState, useEffect } from 'react';
import { Shield, Plus, Users, UserPlus, X, Key, Building2, CheckCircle2, History } from 'lucide-react';
import { SolarUser, AuditLogEntry, UserRole } from '@/types/user';
import { getStoredUsers, saveUser, deleteUser, getAuditLogs, saveAuditLog } from '@/utils/storage';
import { SolarPlant, ProjectStatus } from '@/types/plants';

const MOCK_PLANTS: SolarPlant[] = [
  { id: 'p1', name: 'UFV Alpha', type: 'UFV', capacityKWp: 5.2, location: '', status: ProjectStatus.FASE_RELATORIO, createdAt: '', updatedAt: '' },
  { id: 'p2', name: 'Complexo Pirapora', type: 'COMPLEXO', capacityKWp: 15.0, location: '', status: ProjectStatus.FASE_RELATORIO, createdAt: '', updatedAt: '' }
];

export default function SecurityTab() {
  const [users, setUsers] = useState<SolarUser[]>([]);
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState<Partial<SolarUser>>({
    name: '', email: '', role: 'CLIENT', companyName: '', plantAccess: []
  });

  useEffect(() => {
    const loadedUsers = getStoredUsers();
    if (loadedUsers.length === 0) {
      // Setup initial mocks
      const mockAdmin: SolarUser = { id: 'usr-1', name: 'Administrador SV', email: 'admin@solarvision.com', role: 'ADMIN', status: 'ACTIVE', companyName: 'Solar Vision', plantAccess: [], createdAt: new Date().toISOString() };
      saveUser(mockAdmin);
      saveAuditLog({ id: 'lg-1', timestamp: new Date().toISOString(), action: 'SYSTEM_INIT', description: 'Sistema inicializado com políticas de segurança padrão.', userId: 'system', userName: 'System', severity: 'INFO' });
      setUsers([mockAdmin]);
      setLogs(getAuditLogs());
    } else {
      setUsers(loadedUsers);
      setLogs(getAuditLogs());
    }
  }, []);

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) return;

    const createdUser: SolarUser = {
      id: `usr-${Date.now()}`,
      name: newUser.name as string,
      email: newUser.email as string,
      role: newUser.role as UserRole,
      status: 'PENDING',
      companyName: newUser.companyName || 'Indefinida',
      plantAccess: newUser.plantAccess || [],
      createdAt: new Date().toISOString()
    };

    saveUser(createdUser);
    setUsers(getStoredUsers());

    const log: AuditLogEntry = {
      id: `lg-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: 'USER_CREATED',
      description: `Novo usuário ${createdUser.role} criado: ${createdUser.email}`,
      userId: 'usr-1',
      userName: 'Administrador SV',
      severity: 'INFO'
    };
    saveAuditLog(log);
    setLogs(getAuditLogs());
    setIsModalOpen(false);
    setNewUser({ name: '', email: '', role: 'CLIENT', companyName: '', plantAccess: [] });
  };

  const handleTogglePlant = (plantId: string) => {
    const current = newUser.plantAccess || [];
    if (current.includes(plantId)) {
      setNewUser(prev => ({ ...prev, plantAccess: current.filter(id => id !== plantId) }));
    } else {
      setNewUser(prev => ({ ...prev, plantAccess: [...current, plantId] }));
    }
  };

  return (
    <div className="animate-in fade-in duration-500 space-y-12">
      <div className="border-b border-slate-100 pb-4 flex justify-between items-end">
        <div>
          <h2 className="text-lg font-black text-slate-800 uppercase tracking-widest flex items-center">
            <Shield className="mr-2 text-primary" size={20} /> Controle de Acesso e Segurança
          </h2>
          <p className="text-xs text-slate-500 mt-1">Gerencie clientes, operadores e audite eventos críticos do sistema.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors flex items-center shadow-lg"
        >
          <UserPlus size={16} className="mr-2" />
          Novo Usuário
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

        {/* USERS TABLE */}
        <div className="xl:col-span-2 space-y-4">
          <h3 className="text-sm font-black text-slate-700 uppercase flex items-center">
            <Users size={16} className="mr-2 text-slate-400" /> Usuários Cadastrados
          </h3>
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 font-bold uppercase text-[10px] tracking-wider text-slate-400 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Usuário</th>
                  <th className="px-6 py-4">Função</th>
                  <th className="px-6 py-4">Empresa / Acesso</th>
                  <th className="px-6 py-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800">{u.name}</p>
                      <p className="text-xs text-slate-500">{u.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${u.role === 'ADMIN' ? 'bg-indigo-100 text-indigo-700' :
                          u.role === 'OPERATOR' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                        {u.role === 'CLIENT' ? 'Cliente' : u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-700 text-xs">{u.companyName}</p>
                      {u.role === 'CLIENT' && u.plantAccess && (
                        <p className="text-[10px] text-slate-400 font-medium">
                          {u.plantAccess.length === 0 ? 'Nenhum ativo vinculado' : `${u.plantAccess.length} ativo(s) vinculado(s)`}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-1 flex items-center justify-center mx-auto w-max space-x-1 rounded-full text-[10px] font-bold uppercase ${u.status === 'ACTIVE' ? 'text-emerald-600 bg-emerald-50' : 'text-amber-600 bg-amber-50'
                        }`}>
                        {u.status === 'ACTIVE' && <CheckCircle2 size={12} />}
                        <span>{u.status === 'ACTIVE' ? 'Ativo' : 'Pendente (Convite)'}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* AUDIT LOGS */}
        <div className="xl:col-span-1 space-y-4">
          <h3 className="text-sm font-black text-slate-700 uppercase flex items-center">
            <History size={16} className="mr-2 text-slate-400" /> Log de Auditoria
          </h3>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm h-full max-h-[400px] flex flex-col relative text-slate-300 font-mono text-xs">
            <div className="p-4 overflow-y-auto space-y-3 flex-1 flex flex-col-reverse">
              {logs.map(log => (
                <div key={log.id} className="flex space-x-3 items-start border-b border-slate-800 pb-3 last:border-0 last:pb-0">
                  <div className="text-[10px] text-slate-500 mt-0.5 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div>
                    <span className={`font-bold mr-2 ${log.severity === 'INFO' ? 'text-blue-400' : 'text-amber-400'}`}>
                      [{log.action}]
                    </span>
                    {log.description}
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-slate-950 p-2 text-center text-[10px] border-t border-slate-800 text-slate-500 uppercase tracking-widest font-sans font-bold">
              Logs protegidos por immutabilidade
            </div>
          </div>
        </div>
      </div>

      {/* USER MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white max-w-xl w-full rounded-3xl shadow-2xl overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-black text-slate-800 flex items-center">
                <UserPlus className="mr-2 text-primary" size={24} /> Convidar Usuário
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-red-500 transition-colors p-2 rounded-xl hover:bg-slate-50"><X size={20} /></button>
            </div>
            <form onSubmit={handleCreateUser} className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="user-name" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nome</label>
                  <input id="user-name" autoFocus required type="text" value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} className="w-full px-4 py-2 border border-slate-200 rounded-xl bg-slate-50 font-medium text-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="user-email" className="text-xs font-bold text-slate-500 uppercase tracking-wider">E-mail</label>
                  <input id="user-email" required type="email" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} className="w-full px-4 py-2 border border-slate-200 rounded-xl bg-slate-50 font-medium text-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="user-role" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tipo de Acesso (Função)</label>
                  <select id="user-role" value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value as UserRole })} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 font-bold text-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none appearance-none">
                    <option value="CLIENT">Cliente (Leitura/Acompanhamento)</option>
                    <option value="OPERATOR">Operador (Piloto/Técnico)</option>
                    <option value="ADMIN">Administrador (Total)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Empresa Contratante</label>
                  <div className="relative">
                    <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="text" value={newUser.companyName} onChange={e => setNewUser({ ...newUser, companyName: e.target.value })} placeholder="Ex: AES Brasil" className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl bg-slate-50 font-medium text-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                  </div>
                </div>
              </div>

              {newUser.role === 'CLIENT' && (
                <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl space-y-3 animate-in slide-in-from-top-2">
                  <div>
                    <p className="text-xs font-black text-slate-700 uppercase tracking-widest flex items-center">
                      <Key size={14} className="mr-2 text-amber-500" /> Vinculação de Ativos
                    </p>
                    <p className="text-[10px] text-slate-500 mt-1">Selecione quais usinas este cliente poderá acompanhar.</p>
                  </div>
                  <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto pr-2">
                    {MOCK_PLANTS.map(plant => (
                      <label key={plant.id} className="flex items-center space-x-3 p-3 bg-white border border-slate-100 rounded-lg cursor-pointer hover:border-primary transition-colors">
                        <input
                          type="checkbox"
                          checked={(newUser.plantAccess || []).includes(plant.id)}
                          onChange={() => handleTogglePlant(plant.id)}
                          className="w-4 h-4 text-primary bg-slate-100 border-slate-300 rounded focus:ring-primary focus:ring-2"
                        />
                        <div className="flex-1">
                          <span className="text-sm font-bold text-slate-700">{plant.name}</span>
                          <span className="ml-2 text-[10px] font-medium text-slate-400 px-2 py-0.5 bg-slate-100 rounded uppercase">{plant.type}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 border border-slate-200 text-slate-600 font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-slate-50 transition-colors">Cancelar</button>
                <button type="submit" className="px-6 py-2 bg-primary text-white font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-opacity-90 shadow-lg shadow-primary/30 transition-all flex items-center"><UserPlus size={16} className="mr-2" /> Enviar Convite</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
