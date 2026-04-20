/**
 * Utilitário para substituição de placeholders em relatórios.
 * Substitui chaves no formato {{Variavel}} pelos valores correspondentes.
 */
export function replacePlaceholders(text: string, data: Record<string, string>): string {
  if (!text) return '';
  
  return text.replace(/\{\{([^}]+)\}\}/g, (match) => {
    // Retorna o valor do mapeamento ou o próprio match se não encontrado
    return data[match] || match;
  });
}

/**
 * Filtra anomalias com base na severidade configurada no bloco.
 */
export function getFilteredAnomalies(anomalies: any[], filter?: string) {
  if (!filter || filter === 'Todos') return anomalies;
  return anomalies.filter(a => a.severity.toLowerCase() === filter.toLowerCase());
}

/**
 * Mapeamento padrão de variáveis disponíveis na plataforma Solar Vision.
 * Futuramente isso pode ser carregado de um serviço.
 */
export const AVAILABLE_VARIABLES = [
  { id: 'v1', label: '{{Nome_Usina}}', desc: 'Nome da Planta' },
  { id: 'v2', label: '{{Capacidade_MWp}}', desc: 'Potência instalada' },
  { id: 'v3', label: '{{Total_Anomalias}}', desc: 'Contagem de falhas' },
  { id: 'v4', label: '{{Irradiancia}}', desc: 'Nível de radiação (W/m²)' },
  { id: 'v5', label: '{{Temp_Amb}}', desc: 'Temperatura ambiente' },
  { id: 'v6', label: '{{Vento}}', desc: 'Velocidade do vento' },
  { id: 'v7', label: '{{Data_Inspecao}}', desc: 'Data da coleta' },
  { id: 'v8', label: '{{Cliente}}', desc: 'Nome do Proprietário/Cliente' },
  { id: 'v9', label: '{{Tecnico_Responsavel}}', desc: 'Inspetor da Usina' },
];

export const MOCK_REPORT_DATA: Record<string, string> = {
  '{{Nome_Usina}}': 'UFV Santa Marta - Fase 1',
  '{{Capacidade_MWp}}': '12.5 MWp',
  '{{Total_Anomalias}}': '28',
  '{{Irradiancia}}': '950',
  '{{Temp_Amb}}': '34',
  '{{Vento}}': '2.1',
  '{{Cobertura_Nuvens}}': 'Céu Limpo',
  '{{Data_Inspecao}}': '15/04/2024',
  '{{Cliente}}': 'Energias Renovaveis S.A.',
  '{{Tecnico_Responsavel}}': 'Eng. Ricardo Almeida',
  '{{Data_Calibracao}}': '20/12/2024',
};

export const IEC_BLOCK_MOCK = {
  id: 'IEC-1',
  thermalUrl: 'https://images.unsplash.com/photo-1611288875055-3b72b2234001?auto=format&fit=crop&q=80&w=400',
  rgbUrl: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&q=80&w=400',
  deltaT: 45.2,
  severity: 'Crítico',
  location: 'RT-01, ST-01',
};
