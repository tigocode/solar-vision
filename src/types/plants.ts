export enum ProjectStatus {
  RECEBIMENTO_DEMANDA    = 'Registro da Planta',
  PROJETO                = 'Projeto',
  SUPRIMENTO_LOGISTICA   = 'Suprimento e Logística',
  FASE_PROPOSTA          = 'Fase de Proposta',
  FASE_PLANEJAMENTO      = 'Planejamento de Execução',
  FASE_EXECUCAO          = 'Execução do Serviço',
  FASE_ANALISE           = 'Análise das Imagens',
  FASE_RELATORIO         = 'Elaboração do Relatório',
  ENTREGA                = 'Entrega Final',
}

export type AssetType = 'UFV' | 'COMPLEXO';

export interface SolarPlant {
  id: string;
  name: string;
  type: AssetType;
  capacityKWp: number;
  location: string;
  status: ProjectStatus;
  subUnits?: SolarPlant[];
  createdAt: string;
  updatedAt: string;
}
