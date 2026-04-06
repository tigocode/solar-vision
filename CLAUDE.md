@AGENTS.md

# 🧠 AI Context & Rules: Solar Vision (Front-end)

## 🎯 1. Visão Geral do Projeto
* **O que é:** Interface web (Front-end) do ecossistema de relatórios/laudos de termografia de usinas solares.
* **Público-Alvo:** Gestores, engenheiros e técnicos que precisam visualizar falhas em módulos fotovoltaicos e gerar relatórios/laudos de termografia.
* **Fase Atual:** Setup inicial e construção da arquitetura base (MVP).

## 🛠️ 2. Tech Stack
* **Framework:** React - Next.js (App Router - pasta `src/app`).
* **Linguagem:** TypeScript estrito.
* **Estilização:** Tailwind CSS.
* **Comunicação com a API:** Axios para requisições HTTP, sempre com tipagem estrita das respostas.
* **Testes:** Jest e React Testing Library.

## 🏛️ 3. Arquitetura e Padrões (Next.js App Router com src/)
* **Server vs Client Components:** Por padrão, a IA deve criar componentes como **Server Components** para máxima performance. Use a diretiva `"use client"` estritamente e apenas quando houver necessidade de interatividade (hooks como `useState`, `useEffect` ou eventos de clique).
* **Estrutura de Pastas (Sempre dentro de /src):**
    * `src/app`: Apenas rotas, layouts e pages.
    * `src/components`: Componentes visuais reutilizáveis.
    * `src/types`: Interfaces e tipagens globais do TypeScript.
    * `src/services`: Funções de consumo de API (Server Actions ou chamadas externas).
    * `src/utils`: Funções auxiliares e formatações.

## 💼 4. Regras de Negócio Core (Desenvolvimento Orientado a Contratos)
*(Atenção IA: Como o back-end pode estar em desenvolvimento paralelo, siga estas regras para o front-end)*
* **Regra 1 (Mocks First):** Ao criar uma nova tela que dependa de dados externos (ex: relatórios de IA, histórico de usinas), crie primeiro a Interface TypeScript (o contrato) e um mock temporário de dados antes de implementar a UI.
* **Regra 2 (Padronização Solar):** Dados de potência devem sempre indicar a unidade correta (ex: kWp, MWp para capacidade instalada). O status de equipamentos e anomalias deve seguir um padrão visual de cores semânticas estritamente consistente em toda a aplicação:
    * **Verde:** Bom / Operacional (ex: Sem anomalias).
    * **Vermelho:** Crítico / Falha (ex: Módulo Trincado).
    * **Laranja:** Atenção / Médio (ex: Múltiplos Pontos Quentes).
    * **Amarelo:** Baixo / Alerta (ex: Sujeira/Sombreamento).
* **Regra 3 (Isolamento de Visão - Operador vs. Cliente):** O front-end deve garantir que a "Visão Cliente" seja totalmente cega a processos operacionais.
    * Rotas e botões de Nova Inspeção, Upload de Dados e ações de Processamento IA devem ser omitidos do menu e da interface.
    * Informações de alta granularidade (como as coordenadas GPS exatas de cada painel ou status do motor do servidor) devem ser suprimidas na tabela quando o modo cliente estiver ativo.
* **Regra 4 (Classificação de Anomalias - Norma IEC TS 62446-3):** A renderização e filtragem das anomalias no Digital Twin e na Tabela de Diagnóstico devem obedecer aos gradientes de Severidade baseados no Delta de Temperatura ($\Delta$T) capturado no voo termográfico:
    * **Crítico:** $\Delta$T muito alto ou anomalias estruturais graves (Ex: Módulos Trincados, String Inativa, Diodo Bypass Aberto).
    * **Médio:** Temperatura entre 10°C e 40°C acima das células vizinhas (Ex: Múltiplos Pontos Quentes, PID incipiente).
    * **Baixo:** Diferença de temperatura abaixo dos 10°C (Ex: Sujeira, Bird Drop, Sombreamento leve).
* **Regra 5 (Sincronização do Digital Twin - IR vs. RGB):** Na interface de "Diagnóstico Técnico", a visualização da imagem Termográfica (Infravermelha) e Visual (RGB) deve estar sempre emparelhada. Ao selecionar uma linha na Tabela de Anomalias, o bounding box (caixa de marcação da falha) deve ser desenhado simultaneamente e nas proporções corretas em ambas as imagens.
* **Regra 6 (Validação de Upload de Dados):** O componente de Drag & Drop da área operacional deve fazer uma triagem no front-end antes de iniciar a comunicação com a API:
    * **Canal Termográfico:** Aceitar apenas ficheiros de imagem rádio-métricos (.JPG ou .TIFF térmico). Validar limite visual por lote (ex: 500MB).
    * **Canal Visual (RGB):** Aceitar ficheiros de espectro visível (.JPG, .PNG). Validar limite visual por lote (ex: 1GB).
* **Regra 7 (Imutabilidade de Relatórios e White-Label):** Ao clicar em "Gerar Relatório" (PDF ou PPT), os dados exportados devem representar um snapshot exato da inspeção atual. Quaisquer logótipos ou informações de empresa alteradas na tab de Configurações (White-label) devem refletir-se imediatamente no cabeçalho dos documentos gerados, permitindo que a Facilit'Air entregue o relatório com a identidade visual do cliente final.
* **Regra 8 (Tipos de Falha - Sujeira vs. Sombreamento):** Deve-se diferenciar 'Sujeira' de 'Sombreamento' (Shadowing). Enquanto a sujeira é avaliada prioritariamente pelo $\Delta$T, o sombreamento deve ter sua severidade calculada baseada na área afetada do módulo, independentemente de um $\Delta$T elevado.
* **Regra 9 (Hierarquia de Ativos e Localização):** Todo diagnóstico de anomalia deve obrigatoriamente conter sua localização hierárquica: Rota (ex: RT-01), String (ex: ST-04) e Posição do Módulo (Superior ou Inferior).
* **Regra 10 (Relatórios Executivos):** Os relatórios gerados para o cliente final devem ser uma síntese da inteligência validada. Devem expor apenas as anomalias que foram analisadas pelo operador (status diferente de 'Pendente') e ocultar obrigatoriamente anomalias marcadas como 'Falso Positivo'.

## 🧹 5. Clean Code & Style Guide
* **Nomenclatura:** Componentes React sempre em `PascalCase`. Funções e variáveis em `camelCase`. Nomes descritivos.
* **Tipagem Forte:** Evite o uso de `any` no TypeScript a todo custo. Tipos de retorno de funções devem ser explícitos.
* **Modularidade:** Se um componente passar de 100 linhas, avalie dividi-lo em subcomponentes menores.

## 🧪 6. Estratégia de Testes (TDD Guideline)
* A primeira etapa antes de escrever a lógica ou a renderização de um componente complexo é criar o arquivo `.test.tsx` correspondente.
* Foque em testar o comportamento do usuário (acessibilidade, cliques, renderização de estados de erro) em vez de detalhes de implementação.

## 🌐 7. Idioma e Comunicação (Regra Estrita)
* **Idioma Padrão:** Todas as nossas conversas, explicações, retornos do chat, sugestões de refatoração e explicações de mensagens de erro DEVEM ser estritamente em **Português do Brasil (PT-BR)**.
* **Comentários no Código:** Qualquer comentário gerado dentro dos arquivos (como `//` ou `/** */`) também deve ser escrito em Português do Brasil.
* **Nomenclatura (Código):** Manter nomes de arquivos, variáveis e funções em inglês (ex: `calculatePower`, `ReportList`), para manter o padrão da indústria, mas a explicação sobre o código será sempre em PT-BR.

## 🎨 8. Integração de UI (Mestre das Interfaces)
* **Referências Visuais:** Todo código base focado em layout e prototipação gerado previamente fica armazenado na pasta `_prototypes/`. 
* **Regra de Uso:** Quando solicitado para construir uma nova tela ou componente visual, a IA DEVE primeiro analisar o arquivo correspondente em `_prototypes/` para extrair as classes do Tailwind e a estrutura HTML/JSX/tsx, adaptando esse visual "sujo" para a arquitetura limpa do projeto (separando componentes, aplicando contratos e adicionando os testes).