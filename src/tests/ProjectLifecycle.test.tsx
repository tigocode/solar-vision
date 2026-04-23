/**
 * ProjectLifecycle.test.tsx
 * Ciclo 16 (Refatoração): 9 Etapas Operacionais
 *
 * Mudanças vs versão anterior:
 * - Enum reduzido de 13 → 9 etapas
 * - Desbloqueio de relatório: FASE_RELATORIO (índice 7, etapa 8)
 * - Novos campos por etapa: financeiro (3-4) e análise IA (7)
 */

import { ProjectStatus, AssetType, SolarPlant } from '@/types/plants';

// =====================================================
// CONSTANTE CANÔNICA DAS 9 ETAPAS
// =====================================================
const ORDERED_STAGES: ProjectStatus[] = [
  ProjectStatus.RECEBIMENTO_DEMANDA,  // 1 — Registro da Planta
  ProjectStatus.PROJETO,              // 2 — Upload Layout/Módulos
  ProjectStatus.SUPRIMENTO_LOGISTICA, // 3 — Cálculo Custo/Orçamento
  ProjectStatus.FASE_PROPOSTA,        // 4 — Cálculo Custo/Orçamento
  ProjectStatus.FASE_PLANEJAMENTO,    // 5 — Planejamento Execução
  ProjectStatus.FASE_EXECUCAO,        // 6 — Execução do Serviço
  ProjectStatus.FASE_ANALISE,         // 7 — Análise das Imagens (IA)
  ProjectStatus.FASE_RELATORIO,       // 8 — Elaboração do Relatório ← unlock
  ProjectStatus.ENTREGA,              // 9 — Entrega Final
];

// Desbloqueio na etapa 8 = índice 7
const REPORT_UNLOCK_INDEX = 7;

// =====================================================
// 1. ENUM — COMPLETITUDE E ORDEM
// =====================================================
describe('ProjectStatus Enum — 9 etapas', () => {
  it('deve conter exatamente 9 etapas', () => {
    expect(ORDERED_STAGES).toHaveLength(9);
  });

  it('deve iniciar em "Registro da Planta"', () => {
    expect(ORDERED_STAGES[0]).toBe(ProjectStatus.RECEBIMENTO_DEMANDA);
    expect(ORDERED_STAGES[0]).toBe('Registro da Planta');
  });

  it('deve terminar em "Entrega Final"', () => {
    expect(ORDERED_STAGES[8]).toBe(ProjectStatus.ENTREGA);
    expect(ORDERED_STAGES[8]).toBe('Entrega Final');
  });

  it('deve ter "Elaboração do Relatório" no índice 7 (etapa 8)', () => {
    expect(ORDERED_STAGES[REPORT_UNLOCK_INDEX]).toBe(ProjectStatus.FASE_RELATORIO);
    expect(ORDERED_STAGES[REPORT_UNLOCK_INDEX]).toBe('Elaboração do Relatório');
  });

  it('deve conter a etapa de Análise das Imagens (IA)', () => {
    expect(ORDERED_STAGES).toContain(ProjectStatus.FASE_ANALISE);
  });

  it('deve conter todas as fases financeiras (Suprimento e Proposta)', () => {
    expect(ORDERED_STAGES).toContain(ProjectStatus.SUPRIMENTO_LOGISTICA);
    expect(ORDERED_STAGES).toContain(ProjectStatus.FASE_PROPOSTA);
  });

  it('não deve conter etapas do workflow antigo (ex: PROCESSAMENTO_DADOS)', () => {
    // @ts-expect-error - verifica que chave PROCESSAMENTO_DADOS foi removida do enum
    expect(ProjectStatus.PROCESSAMENTO_DADOS).toBeUndefined();
    // @ts-expect-error - verifica que chave COMISSIONAMENTO foi removida do enum
    expect(ProjectStatus.COMISSIONAMENTO).toBeUndefined();
    // @ts-expect-error - verifica que chave MONTAGEM_PAINEIS foi removida do enum
    expect(ProjectStatus.MONTAGEM_PAINEIS).toBeUndefined();
  });

  it('não deve conter duplicatas', () => {
    const unique = new Set(ORDERED_STAGES);
    expect(unique.size).toBe(ORDERED_STAGES.length);
  });
});

// =====================================================
// 2. LÓGICA DE TRANSIÇÃO: campos obrigatórios por etapa
// =====================================================
type StepFields = {
  plantName?: string;
  assetType?: AssetType;
  layoutUploaded?: boolean;
  equipmentCost?: string;
  proposalValue?: string;
  executionStartDate?: string;
  pilotName?: string;
};

function canAdvanceFromStep(stepIndex: number, fields: StepFields): boolean {
  switch (stepIndex) {
    case 0: // Registro: nome da planta obrigatório
      return !!(fields.plantName && fields.plantName.trim().length > 0);

    case 1: // Projeto: layout deve ter sido anexado
      return !!(fields.layoutUploaded);

    case 2: // Suprimento: custo de equipamentos
      return !!(fields.equipmentCost && parseFloat(fields.equipmentCost) > 0);

    case 3: // Proposta: valor da proposta
      return !!(fields.proposalValue && parseFloat(fields.proposalValue) > 0);

    case 4: // Planejamento: data de início de execução
      return !!(fields.executionStartDate && fields.executionStartDate.trim().length > 0);

    case 5: // Execução: piloto responsável
      return !!(fields.pilotName && fields.pilotName.trim().length > 0);

    default: // Análise (6), Relatório (7), Entrega (8): avançam livremente
      return true;
  }
}

describe('Lógica de Transição entre Etapas (9 estágios)', () => {
  describe('Etapa 1 — Registro da Planta', () => {
    it('NÃO deve avançar com nome vazio', () => {
      expect(canAdvanceFromStep(0, { plantName: '' })).toBe(false);
    });
    it('NÃO deve avançar com apenas espaços', () => {
      expect(canAdvanceFromStep(0, { plantName: '   ' })).toBe(false);
    });
    it('deve avançar com nome preenchido', () => {
      expect(canAdvanceFromStep(0, { plantName: 'Complexo Pirapora' })).toBe(true);
    });
  });

  describe('Etapa 2 — Projeto (Layout)', () => {
    it('NÃO deve avançar sem arquivo de layout', () => {
      expect(canAdvanceFromStep(1, { layoutUploaded: false })).toBe(false);
    });
    it('NÃO deve avançar sem o flag layoutUploaded', () => {
      expect(canAdvanceFromStep(1, {})).toBe(false);
    });
    it('deve avançar quando layout estiver anexado', () => {
      expect(canAdvanceFromStep(1, { layoutUploaded: true })).toBe(true);
    });
  });

  describe('Etapa 3 — Suprimento e Logística', () => {
    it('NÃO deve avançar sem custo informado', () => {
      expect(canAdvanceFromStep(2, { equipmentCost: '' })).toBe(false);
    });
    it('NÃO deve avançar com custo zero', () => {
      expect(canAdvanceFromStep(2, { equipmentCost: '0' })).toBe(false);
    });
    it('deve avançar com custo preenchido e positivo', () => {
      expect(canAdvanceFromStep(2, { equipmentCost: '520000' })).toBe(true);
    });
  });

  describe('Etapa 4 — Fase de Proposta', () => {
    it('NÃO deve avançar sem valor da proposta', () => {
      expect(canAdvanceFromStep(3, { proposalValue: '' })).toBe(false);
    });
    it('deve avançar com valor da proposta positivo', () => {
      expect(canAdvanceFromStep(3, { proposalValue: '850000' })).toBe(true);
    });
  });

  describe('Etapa 5 — Planejamento de Execução', () => {
    it('NÃO deve avançar sem data de início', () => {
      expect(canAdvanceFromStep(4, {})).toBe(false);
    });
    it('deve avançar com data de início definida', () => {
      expect(canAdvanceFromStep(4, { executionStartDate: '2026-07-01' })).toBe(true);
    });
  });

  describe('Etapa 6 — Execução do Serviço', () => {
    it('NÃO deve avançar sem piloto responsável', () => {
      expect(canAdvanceFromStep(5, {})).toBe(false);
    });
    it('deve avançar com nome do piloto preenchido', () => {
      expect(canAdvanceFromStep(5, { pilotName: 'Carlos Drone' })).toBe(true);
    });
  });

  describe('Etapas 7, 8 e 9 — livres', () => {
    it('Análise (6) avança sem restrição', () => {
      expect(canAdvanceFromStep(6, {})).toBe(true);
    });
    it('Relatório (7) avança sem restrição', () => {
      expect(canAdvanceFromStep(7, {})).toBe(true);
    });
    it('Entrega (8) avança sem restrição', () => {
      expect(canAdvanceFromStep(8, {})).toBe(true);
    });
  });
});

// =====================================================
// 3. LÓGICA DE PERMISSÃO: FASE_RELATORIO (etapa 8)
// =====================================================
function isReportUnlocked(currentStepIndex: number): boolean {
  return currentStepIndex >= REPORT_UNLOCK_INDEX;
}

describe('Permissão de Relatório — desbloqueio na FASE_RELATORIO (etapa 8)', () => {
  it('deve estar BLOQUEADO nas etapas 1 a 7 (índices 0 a 6)', () => {
    for (let i = 0; i < REPORT_UNLOCK_INDEX; i++) {
      expect(isReportUnlocked(i)).toBe(false);
    }
  });

  it('deve ser DESBLOQUEADO exatamente na etapa 8 (índice 7 — FASE_RELATORIO)', () => {
    expect(isReportUnlocked(7)).toBe(true);
  });

  it('deve permanecer DESBLOQUEADO na etapa final 9 (índice 8 — ENTREGA)', () => {
    expect(isReportUnlocked(8)).toBe(true);
  });

  it('a etapa de desbloqueio deve ser "Elaboração do Relatório"', () => {
    expect(ORDERED_STAGES[REPORT_UNLOCK_INDEX]).toBe(ProjectStatus.FASE_RELATORIO);
  });
});

// =====================================================
// 4. PAYLOAD UFV vs COMPLEXO (adaptado para novo enum)
// =====================================================
describe('Payload de Criação — schema SolarPlant v2', () => {
  const base = {
    id: 'p-001',
    location: 'MG',
    status: ProjectStatus.RECEBIMENTO_DEMANDA,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  it('UFV: deve ter type "UFV" e status inicial RECEBIMENTO_DEMANDA', () => {
    const ufv: SolarPlant = { ...base, name: 'UFV Test', type: 'UFV', capacityKWp: 5 };
    expect(ufv.type).toBe<AssetType>('UFV');
    expect(ufv.status).toBe(ProjectStatus.RECEBIMENTO_DEMANDA);
    expect(ufv.status).toBe('Registro da Planta');
  });

  it('COMPLEXO: capacidade deve igualar soma das subUnits', () => {
    const sub1: SolarPlant = { ...base, id: 's1', name: 'Sub 1', type: 'UFV', capacityKWp: 4 };
    const sub2: SolarPlant = { ...base, id: 's2', name: 'Sub 2', type: 'UFV', capacityKWp: 6 };
    const cx: SolarPlant = {
      ...base,
      name: 'Complexo', type: 'COMPLEXO',
      capacityKWp: sub1.capacityKWp + sub2.capacityKWp,
      subUnits: [sub1, sub2],
    };
    const calcTotal = cx.subUnits!.reduce((a, u) => a + u.capacityKWp, 0);
    expect(cx.capacityKWp).toBe(calcTotal);
    expect(cx.capacityKWp).toBe(10);
  });

  it('Status inicial da planta deve ser sempre RECEBIMENTO_DEMANDA', () => {
    expect(ProjectStatus.RECEBIMENTO_DEMANDA).toBe('Registro da Planta');
  });
});

// =====================================================
// 5. LÓGICA DE NAVEGAÇÃO — "Acessar Fluxo"
// =====================================================

/**
 * Função pura que retorna a rota para o fluxo baseado no
 * índice da etapa ativa, passando o plantId como query param.
 * Retorna null se a etapa não possui fluxo vinculado.
 */
function getFlowRoute(stepIndex: number, plantId: string): string | null {
  const BASE = `/dashboard`;
  switch (stepIndex) {
    case 4: // FASE_PLANEJAMENTO → Nova Inspeção
    case 5: // FASE_EXECUCAO → Nova Inspeção
      return `${BASE}/nova-inspecao?plantId=${plantId}`;
    case 6: // FASE_ANALISE → Diagnóstico
      return `${BASE}/diagnostico?plantId=${plantId}`;
    case 7: // FASE_RELATORIO → Relatórios
      return `${BASE}/relatorios?plantId=${plantId}`;
    default:
      return null;
  }
}

describe('Lógica de Navegação — Acessar Fluxo', () => {
  const PLANT_ID = 'plant-abc-123';

  describe('Mapeamento de rotas por etapa', () => {
    it('Etapa 5 (FASE_PLANEJAMENTO, índice 4) → /nova-inspecao com plantId', () => {
      const route = getFlowRoute(4, PLANT_ID);
      expect(route).toBe(`/dashboard/nova-inspecao?plantId=${PLANT_ID}`);
    });

    it('Etapa 6 (FASE_EXECUCAO, índice 5) → /nova-inspecao com plantId', () => {
      const route = getFlowRoute(5, PLANT_ID);
      expect(route).toBe(`/dashboard/nova-inspecao?plantId=${PLANT_ID}`);
    });

    it('Etapa 7 (FASE_ANALISE, índice 6) → /diagnostico com plantId', () => {
      const route = getFlowRoute(6, PLANT_ID);
      expect(route).toBe(`/dashboard/diagnostico?plantId=${PLANT_ID}`);
    });

    it('Etapa 8 (FASE_RELATORIO, índice 7) → /relatorios com plantId', () => {
      const route = getFlowRoute(7, PLANT_ID);
      expect(route).toBe(`/dashboard/relatorios?plantId=${PLANT_ID}`);
    });
  });

  describe('Etapas sem fluxo vinculado', () => {
    it('Etapas 1-4 (índices 0-3) devem retornar null', () => {
      for (let i = 0; i <= 3; i++) {
        expect(getFlowRoute(i, PLANT_ID)).toBeNull();
      }
    });

    it('Etapa 9 (índice 8 — ENTREGA) não possui fluxo → null', () => {
      expect(getFlowRoute(8, PLANT_ID)).toBeNull();
    });
  });

  describe('Inclusão do plantId na rota', () => {
    it('a rota deve conter o plantId passado como parâmetro', () => {
      const specificId = 'ufv-sertao-001';
      const route = getFlowRoute(4, specificId);
      expect(route).toContain(specificId);
    });

    it('plant IDs diferentes devem gerar rotas diferentes', () => {
      const routeA = getFlowRoute(5, 'plant-A');
      const routeB = getFlowRoute(5, 'plant-B');
      expect(routeA).not.toBe(routeB);
    });

    it('a rota base deve conter /dashboard/', () => {
      const route = getFlowRoute(6, PLANT_ID);
      expect(route).toMatch(/^\/dashboard\//);
    });
  });

  describe('Validação semântica das rotas', () => {
    it('a rota da Nova Inspeção deve estar correta para etapa 5', () => {
      expect(getFlowRoute(4, PLANT_ID)).toContain('/nova-inspecao');
    });

    it('a rota do Diagnóstico deve estar correta para etapa 7', () => {
      expect(getFlowRoute(6, PLANT_ID)).toContain('/diagnostico');
    });

    it('a rota de Relatórios deve estar correta para etapa 8', () => {
      expect(getFlowRoute(7, PLANT_ID)).toContain('/relatorios');
    });
  });
});
