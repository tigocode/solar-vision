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
