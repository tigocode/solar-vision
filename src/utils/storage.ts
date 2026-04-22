export interface InspectionRecord {
  id: string;
  unitName: string;
  unitId: string;
  date: string;
  inspector: string;
  status: 'Aguardando Upload' | 'Em Processamento' | 'Concluída';
  healthScore?: number;
  criticalAnomalies?: number;
  totalAnomalies?: number;
  timestamp: number;
  technicalData: {
    envTemp: string;
    envWind: string;
    envClouds: string;
    envIrradiance?: string;
    cameraModel: string;
    cameraResolution: string;
    droneModel: string;
    calibrationValidUntil: string;
    emissivity: string;
    reflectedTemp: string;
    technique: string;
    viewAngle: string;
    standards: string;
  };
}

const STORAGE_KEY = 'solar_inspections';

export const getStoredInspections = (): InspectionRecord[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveInspection = (inspection: InspectionRecord) => {
  const current = getStoredInspections();
  const next = [inspection, ...current.filter(i => i.id !== inspection.id)];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
};

export const updateInspectionStatus = (id: string, status: InspectionRecord['status']) => {
  const current = getStoredInspections();
  const next = current.map(i => i.id === id ? { ...i, status } : i);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
};

export const clearInspections = () => {
  localStorage.removeItem(STORAGE_KEY);
};

// --- USER & SECURITY MOCKS ---
// Nota: Em produção, isso seria gerenciado por um backend (ex: Firebase Auth / Supabase / Node.js)
import { SolarUser, AuditLogEntry } from '../types/user';

const USERS_STORAGE_KEY = 'solar_users';
const AUDIT_STORAGE_KEY = 'solar_audit_logs';

export const getStoredUsers = (): SolarUser[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(USERS_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveUser = (user: SolarUser) => {
  const current = getStoredUsers();
  const next = [user, ...current.filter(u => u.id !== user.id)];
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(next));
};

export const deleteUser = (id: string) => {
  const current = getStoredUsers();
  const next = current.filter(u => u.id !== id);
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(next));
}

export const getAuditLogs = (): AuditLogEntry[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(AUDIT_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveAuditLog = (log: AuditLogEntry) => {
  const current = getAuditLogs();
  const next = [log, ...current];
  localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(next));
};

// --- MULTIPLE PROJECTS LIFECYCLE MOCKS ---
const PROJECTS_STORAGE_KEY = 'solar_projects';

export interface SolarProjectFlow {
  id: string;
  name: string;
  assetType: 'UFV' | 'COMPLEXO';
  currentStep: number;
  lastUpdated: string;
  createdAt: string;
  formData: any; // Armazenará encapsulado todo o objeto FormData
}

export const getStoredProjects = (): SolarProjectFlow[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(PROJECTS_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveProjectFlow = (project: SolarProjectFlow) => {
  const current = getStoredProjects();
  const next = [project, ...current.filter(p => p.id !== project.id)];
  localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(next));
};

export const deleteProjectFlow = (id: string) => {
  const current = getStoredProjects();
  const next = current.filter(p => p.id !== id);
  localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(next));
};
