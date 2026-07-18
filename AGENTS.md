# ThemisTec: Agent Directives (AGENTS.md)

Você é um Agente de IA trabalhando no projeto **ThemisTec**. Suas ações devem ser estritamente guiadas por este documento. Qualquer violação destas regras é considerada uma falha grave.

## 1. Contexto do Projeto (O que você precisa saber)
- **Stack Tecnológica:** Next.js (App Router), Tailwind CSS, Supabase (Auth/PostgreSQL/Storage), Zod (Validação).
- **Arquitetura:** Monolito Modular baseado em **MVVM** com forte uso de **Inversão de Dependência (Adapters)**. A View NUNCA deve importar o banco de dados diretamente.
- **Base de Conhecimento:** Se tiver dúvidas sobre a arquitetura, leia o diretório `_bmad-output/project-knowledge/`.

## 2. Mapa de Pastas e Diretórios Críticos
Antes de executar qualquer ação, saiba onde encontrar a verdade:
- `docs/PRD.md`: Regras de negócio, Personas e Escopo do MVP.
- `docs/architecture/decisions/`: Contém os ADRs (Architecture Decision Records). Toda decisão arquitetural de peso está aqui.
- `src/specs/`: Contratos da API (OpenAPI) e Schemas de validação de dados (Zod). **Não viole estes contratos.**
- `_bmad-output/stories/`: Contém as **Stories** (O *Quê* fazer). Leia a história relacionada antes de codar.
- `_bmad-output/implementation-artifacts/`: Contém as **Specs Técnicas** (O *Como* fazer). **É a lei.** Você só pode codar se existir uma Spec guiando as suas ações.

## 3. Uso do BMad (Skills do Agente)
Dependendo do que o usuário pedir, acione as ferramentas apropriadas:
- Se o usuário pedir para **documentar** ou gerar base de conhecimento: Use a skill `bmad-document-project`.
- Se o usuário pedir para **planejar um Épico ou Tarefas**: Use a skill `bmad-create-epics-and-stories` (para gerar múltiplas) ou `bmad-create-story` (para uma individual).
- Se o usuário pedir para **revisar código**: Use as skills de `bmad-review-*`.

## 4. O Fluxo de Desenvolvimento Estrito (BMad Method)
Se o usuário lhe pedir para programar/desenvolver uma nova tela ou funcionalidade, siga a ordem:
1. **Identificar:** Localize a Story em `_bmad-output/stories/`. **Se a Story não existir, PARE E CRIE A STORY PRIMEIRO.** Em seguida, gere o *Implementation Artifact* (Spec) correspondente antes de prosseguir.
2. **Estudar a Spec:** Leia o artefato de implementação correspondente em `_bmad-output/implementation-artifacts/`.
3. **Desenvolver:** Modifique APENAS os arquivos descritos na Spec. Respeite os limites (Harness).
4. **Validar:** Rode o cinturão de testes localmente (`npm run lint`, `npm run typecheck`). Se algo quebrar, corrija antes do próximo passo.

## 5. Regras Obrigatórias para Entregas (Issues e PRs)
Nenhum Pull Request pode ser criado sem uma Issue relacionada.
1. Procure se já existe uma issue aberta para o trabalho.
2. Se não existir, **CRIE A ISSUE PRIMEIRO**.
3. Crie o PR apontando para a branch correta e preencha o corpo com conteúdo real.
4. O PR deve obrigatoriamente conter `Closes #<numero-da-issue>` no corpo para fechamento automático se for para a `main` (ou justifique caso contrário).
5. Certifique-se de que o checklist de testes no PR reflete a realidade do que você validou. Não abra PR vazio ou com dados "falsos".
