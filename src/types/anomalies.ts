/**
 * @types/anomalies.ts
 * Definição dos contratos de dados para anomalias detectadas via IA (Termografia/RGB).
 */

export type Severity = 'Crítico' | 'Médio' | 'Baixo';

export type AnomalyStatus = 'Pendente' | 'Em Análise' | 'Falso Positivo' | 'Resolvido';

/**
 * Coordenadas da Bounding Box (Regra 5)
 * Valores relativos (0 a 1) para facilitar a renderização em diferentes resoluções.
 */
export interface BoundingBox {
  x: number;      // Posição horizontal superior esquerda
  y: number;      // Posição vertical superior esquerda
  width: number;  // Largura da caixa
  height: number; // Altura da caixa
}

/**
 * Hierarquia de Ativos (Regra 9)
 */
export interface AssetLocation {
  route: string;    // Rota (ex: RT-01)
  string: string;   // String (ex: ST-04)
  position: 'superior' | 'inferior'; // Posição do Módulo
}

/**
 * Interface principal representando uma anomalia detectada (Regra 1, 4, 5, 8 e 9)
 */
export interface Anomaly {
  id: string;             // Identificador (ex: PT-01)
  type: string;           // Categoria (ex: Módulo Trincado, Ponto Quente, Sujeira, Sombreamento)
  deltaT: number;         // Diferença de temperatura em °C (Regra 4)
  severity: Severity;     // Nível de severidade (Regra 2 e 4)
  status: AnomalyStatus;  // Estado atual do reparo

  // Localização Hierárquica (Regra 9)
  location: AssetLocation;
  
  // Localização Geográfica (Oculta para 'client' - Regra 3)
  coordinates?: {
    lat: number;
    lng: number;
  };

  // Imagens Sincronizadas (Regra 5)
  irUrl: string;          // URL da imagem IR (Termográfica)
  rgbUrl: string;         // URL da imagem RGB (Visual)

  // Marcações Geométricas Unificadas (Regra 5)
  boundingBox: BoundingBox; 

  // Metadados para Sombreamento (Regra 8)
  affectedArea?: number;  // Área afetada em percentual (0 a 100)

  // Metadados Adicionais
  createdAt: string;      // Data da detecção
  updatedAt: string;
}
