import { Template } from '@/types/templates';

export const mockTemplates: Template[] = [
  {
    id: 'temp-executivo-1',
    name: 'Relatório Executivo Padrão',
    lastEdited: 'Há 2 dias',
    pages: [
      {
        id: 'page-1',
        blocks: [
          {
            id: 'header-1',
            type: 'header',
            x: 32,
            y: 32,
            width: 730,
            height: 80,
          },
          {
            id: 'title-1',
            type: 'text',
            x: 32,
            y: 112,
            width: 730,
            height: 60,
            content: 'RELATÓRIO DE INSPEÇÃO TERMOGRÁFICA',
            style: { fontSize: '24px', fontWeight: '900', textAlign: 'center' }
          },
          {
            id: 'info-geral-1',
            type: 'text',
            x: 32,
            y: 180,
            width: 730,
            height: 140,
            content: 'INFORMAÇÕES GERAIS\nCliente: {{Cliente}}\nUsina: {{Nome_Usina}}\nData da Inspeção: {{Data_Inspecao}}\nResponsável: {{Tecnico_Responsavel}}\nQualificação: Termografista Nível 1 - ISO 9712',
            style: { fontSize: '12px', textAlign: 'left', lineHeight: '1.8' }
          },
          {
            id: 'ambient-1',
            type: 'table',
            x: 32,
            y: 330,
            width: 730,
            height: 120,
            content: 'Condições Ambientais',
            // No futuro o estado da tabela será mais complexo, por enquanto usamos o placeholder visual
          },
          {
            id: 'ambient-text',
            type: 'text',
            x: 32,
            y: 460,
            width: 730,
            height: 80,
            content: 'Irradiância: {{Irradiancia}} W/m² | Temp. Ambiente: {{Temp_Amb}}°C | Vento: {{Vento}} m/s | Nuvens: {{Cobertura_Nuvens}}',
            style: { fontSize: '11px', italic: true }
          },
          {
            id: 'equip-1',
            type: 'text',
            x: 32,
            y: 550,
            width: 730,
            height: 100,
            content: 'EQUIPAMENTOS UTILIZADOS\nCâmera: FLIR Vue Pro R 640 / Resolução: 640x512px\nDrone: DJI Matrice 300 RTK / Calibração: Válida até {{Data_Calibracao}}\nConfiguração: Emissividade 0.95 | Refletida 20°C',
            style: { fontSize: '12px', textAlign: 'left' }
          },
          {
            id: 'proc-1',
            type: 'text',
            x: 32,
            y: 660,
            width: 730,
            height: 80,
            content: 'PROCEDIMENTO DE INSPEÇÃO\nTécnica: Termografia Passiva / Ângulo de Visão: 90° em relação à normal.\nNormas: ABNT NBR 15572 / ASTM E1213.',
            style: { fontSize: '12px', textAlign: 'left' }
          },
          {
            id: 'thermal-map-1',
            type: 'thermal_map',
            x: 32,
            y: 750,
            width: 730,
            height: 280,
          }
        ]
      },
      {
        id: 'page-2',
        blocks: [
          {
            id: 'header-2',
            type: 'header',
            x: 32,
            y: 32,
            width: 730,
            height: 80,
          },
          {
            id: 'res-title',
            type: 'text',
            x: 32,
            y: 120,
            width: 730,
            height: 40,
            content: 'RESULTADOS DA INSPEÇÃO E ANALÍSE DE ANOMALIAS',
            style: { fontSize: '14px', fontWeight: 'bold', textAlign: 'center' }
          },
          {
            id: 'res-1',
            type: 'table',
            x: 32,
            y: 170,
            width: 730,
            height: 400,
          },
          {
            id: 'eval-title',
            type: 'text',
            x: 32,
            y: 580,
            width: 730,
            height: 30,
            content: 'AVALIAÇÃO DE SEVERIDADE (DELTA T)',
            style: { fontSize: '12px', fontWeight: 'bold' }
          },
          {
            id: 'eval-1',
            type: 'table',
            x: 32,
            y: 620,
            width: 730,
            height: 150,
          },
          {
            id: 'rec-1',
            type: 'text',
            x: 32,
            y: 780,
            width: 730,
            height: 200,
            content: 'PARECER TÉCNICO E RECOMENDAÇÕES:\nAs anomalias detectadas indicam a necessidade de limpeza e reaperto de conexões em 15% dos módulos. Recomendamos manutenção preventiva nas próximas 48 horas para evitar degradação térmica acelerada.',
            style: { fontSize: '12px', textAlign: 'justify' }
          }
        ]
      }
    ],
    theme: {
      primaryColor: '#f59e0b',
      secondaryColor: '#0f172a',
      fontFamily: 'Inter'
    }
  }
];
