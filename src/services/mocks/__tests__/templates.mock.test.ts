import { mockTemplates } from '../templates';

describe('Estrutura Normativa do Relatório Padrão', () => {
  const standardReport = mockTemplates.find(t => t.id === 'temp-executivo-1');

  it('deve existir o Relatório Executivo Padrão', () => {
    expect(standardReport).toBeDefined();
    expect(standardReport?.name).toBe('Relatório Executivo Padrão');
  });

  it('deve conter no mínimo 2 páginas conforme o planejamento de expansão', () => {
    expect(standardReport!.pages.length).toBeGreaterThanOrEqual(2);
  });

  it('deve conter a seção de Informações Gerais e Termografista Qualificado', () => {
    const allBlocks = standardReport!.pages.flatMap(p => p.blocks);
    const techTeamBlock = allBlocks.find(b => 
      b.content?.toLowerCase().includes('iso 9712') || b.content?.toLowerCase().includes('termografista')
    );
    expect(techTeamBlock).toBeDefined();
  });

  it('deve conter campos para Condições Ambientais (irradiância, temperatura, etc)', () => {
    const allBlocks = standardReport!.pages.flatMap(p => p.blocks);
    const environmentalBlock = allBlocks.find(b => 
      b.content?.toLowerCase().includes('w/m²') || b.content?.toLowerCase().includes('condições ambientais')
    );
    expect(environmentalBlock).toBeDefined();
  });

  it('deve conter a seção de Parecer Técnico e Recomendações', () => {
    const allBlocks = standardReport!.pages.flatMap(p => p.blocks);
    const recommendationsBlock = allBlocks.find(b => 
      b.content?.toLowerCase().includes('parecer técnico') || b.content?.toLowerCase().includes('recomendações')
    );
    expect(recommendationsBlock).toBeDefined();
  });
});
