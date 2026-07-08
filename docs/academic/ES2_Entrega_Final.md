# ES2 - Entrega Final: Especificação, Harness Engineering e Consolidação do MVP

**Data de Entrega:** [16/06/2026]

## Contextualização Final

Chegamos ao fim da nossa jornada em Engenharia de Software 2.

Agora, é hora de materializar tudo isso no produto final. No mercado de alta tecnologia contemporâneo, não aceitamos mais o desenvolvimento manual descuidado, tampouco a geração caótica de código por IAs gerativas sem controle de fronteiras.

Nesta entrega final, vocês aplicarão o paradigma de Spec-Driven Development (SDD) acoplado à Harness Engineering. Vocês criarão os contratos do sistema, cercarão o ambiente de desenvolvimento com sensores automáticos de validação e usarão agentes de IA (ou desenvolvimento manual) para construir um MVP robusto, livre de alucinações e falhas de contrato.

## Objetivo da Atividade

Os times deverão consolidar e entregar o ecossistema completo do produto proposto, composto pelo alinhamento de negócio (PRD), as especificações técnicas de fronteira (Specs), o ecossistema automatizado de proteção (AI Harness) e o código-fonte funcional do MVP.

## Artefatos Obrigatórios da Entrega

O repositório do GitHub de cada equipe deverá ser atualizado para conter, rigorosamente, os quatro artefatos finais descritos a seguir:

### 1. PRD (Product Requirement Document)

O documento que alinha a visão de negócio ao escopo técnico. Ele deve guiar qualquer engenheiro que entre no projeto agora.

- **Conteúdo obrigatório:** Visão geral do produto, valor de mercado, personas (público-alvo), escopo detalhado do MVP (o que entrou e o que ficou de fora), e os critérios de sucesso do produto.

### 2. Conjunto de Specs (Spec-Driven Development)

Vocês devem travar os contratos do sistema antes que o código exista. Nenhuma linha de código deve violar a especificação.

- **Contratos de API:** Arquivos formais de especificação de rotas (ex: OpenAPI/Swagger em formato JSON/YAML).
- **Contratos de Dados:** Esquemas rígidos de validação e tipagem de payloads (ex: Schemas Zod, JSON Schema ou Speckit).

### 3. Detalhamento do AI Harness (Harness Engineering)

Vocês devem documentar a arquitetura do Harness personalizado que criaram para cercar o desenvolvimento (especialmente se usaram assistentes como Claude Code, Antigravity, OpenCode ou Copilot). O texto deve detalhar as duas forças do Harness:

- **Mecanismo de Feedforward (Garantia de Entrada):** Como as Specs produzidas no item anterior e os prompts foram injetados na IA para garantir que ela iniciasse a geração do código respeitando os limites arquiteturais, os Design Patterns e as ADRs decididas pelo time.
- **Mecanismo de Feedback (Loop de Correção Baseado em Sensores):** Como o ambiente do projeto foi configurado com sensores automáticos para validar a saída da IA. O time deve detalhar a integração sequencial de:
  1. Linters / Formatadores (ex: ESLint, Biome) para estilo de código.
  2. Typecheckers (ex: tsc do TypeScript, Mypy) para checagem estrita de contratos.
  3. Testes Automatizados (ex: Vitest, Jest, PyTest) para validação da regra de negócio.

### 4. O MVP Funcional

O código-fonte completo da aplicação, hospedado e rodando em ambiente de produção ou simulado de forma idônea.

- O código deve refletir perfeitamente as especificações (Specs), os padrões de projeto definidos e as regras de negócio acordadas.

## Como Entregar?

1. Toda a documentação técnica (PRD, Definição do Harness) deve estar organizada na pasta `/docs/` do repositório principal no GitHub.
2. As Specs devem estar localizadas em suas respectivas pastas técnicas (ex: `/src/specs/` ou na raiz de contratos).
3. No ambiente virtual de aprendizagem, o representante da equipe deverá enviar:
   - O link do repositório do GitHub do projeto na branch principal.
   - O link do MVP em produção (se aplicável/hospedado) ou instruções claras no README.md de como rodar o app completo localmente.

## Critérios de Avaliação

| Critério | Descrição | Peso |
|---|---|---|
| Alinhamento do PRD e Escopo | Clareza no valor de negócio e fidelidade do MVP em relação ao que foi prometido no documento de produto. | 20% |
| Rigor do SDD (Specs) | Qualidade e corretude técnica das especificações (OpenAPI/Zod). O código não pode divergir da especificação. | 25% |
| Harness Engineering (Feedforward/Feedback) | Maturidade técnica na construção do cinturão de testes e automação do loop de correção do código gerado por IA. | 35% |
| Qualidade do MVP Final | Funcionamento da aplicação, estabilidade do software e cumprimento dos requisitos propostos pelo time. | 20% |
