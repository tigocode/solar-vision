import { replacePlaceholders } from '../reportData';

describe('Utility: replacePlaceholders', () => {
  const mockData = {
    '{{Nome_Usina}}': 'UFV Santa Marta',
    '{{Capacidade_MWp}}': '5.2 MWp',
    '{{Total_Anomalias}}': '12',
    '{{Irradiancia}}': '850 W/m²',
    '{{Temp_Amb}}': '32°C',
    '{{Vento}}': '1.5 m/s'
  };

  it('deve substituir corretamente uma única variável no texto', () => {
    const text = 'Relatório da Usina {{Nome_Usina}}';
    const result = replacePlaceholders(text, mockData);
    expect(result).toBe('Relatório da Usina UFV Santa Marta');
  });

  it('deve substituir múltiplas variáveis no mesmo texto', () => {
    const text = 'Usina: {{Nome_Usina}}, Potência: {{Capacidade_MWp}}';
    const result = replacePlaceholders(text, mockData);
    expect(result).toBe('Usina: UFV Santa Marta, Potência: 5.2 MWp');
  });

  it('deve manter o texto original se a variável não for encontrada no objeto de dados', () => {
    const text = 'Variable {{Variavel_Inexistente}} mock';
    const result = replacePlaceholders(text, mockData);
    expect(result).toBe('Variable {{Variavel_Inexistente}} mock');
  });

  it('deve lidar com textos vazios ou sem variáveis', () => {
    expect(replacePlaceholders('', mockData)).toBe('');
    expect(replacePlaceholders('Texto comum', mockData)).toBe('Texto comum');
  });
});
