# Issues Workflow - ThemisTec

> Guia de criação, uso e ciclo de vida das issues no projeto  
> Referência para a equipe e para o agente IA (Kiro)

---

## 1. O que é uma Issue?

Uma issue representa uma **unidade de trabalho rastreável** no GitHub. Pode ser:

- Uma **user story** a implementar
- Um **bug** a corrigir
- Uma **tarefa técnica** (configuração, documentação, refatoração)
- Uma **melhoria** proposta

Toda issue deve ter relação direta com o backlog do MVP definido no PRD.

---

## 2. Tipos de Issue

| Tipo | Label | Quando usar |
|------|-------|------------|
| User Story | `story` | Implementar uma US do PRD (US01–US09) |
| Bug | `bug` | Comportamento incorreto em algo já implementado |
| Tarefa técnica | `task` | Configuração, CI/CD, harness, documentação |
| Melhoria | `enhancement` | Sugestão de melhoria em algo existente |
| Dúvida / Discussão | `question` | Perguntas que precisam de resposta antes de agir |

---

## 3. Estrutura Obrigatória de uma Issue

### Título

```
[TIPO] Descrição curta no imperativo

Exemplos:
[STORY] Implementar login com e-mail e senha (US01)
[BUG] CPF duplicado não está sendo rejeitado no cadastro
[TASK] Configurar GitHub Actions para rodar o harness
```

### Corpo

Cada tipo tem seu próprio template (ver seção 4). Use sempre o template correto ao abrir a issue.

---

## 4. Relação Issues ↔ User Stories do MVP

| Issue | User Story | Épico | Responsável |
|-------|-----------|-------|-------------|
| `[STORY] US01` | Login com e-mail/senha | EP01 – Auth | Micael |
| `[STORY] US02` | Cadastro de conta + confirmação | EP01 – Auth | Micael |
| `[STORY] US03` | Recuperação de senha por e-mail | EP01 – Auth | Micael |
| `[STORY] US04` | Cadastro de cliente (CPF único) | EP02 – Clientes | Josiane |
| `[STORY] US05` | Listagem paginada com busca | EP02 – Clientes | Josiane |
| `[STORY] US06` | Edição e exclusão de cliente | EP02 – Clientes | Josiane |
| `[STORY] US07` | Registro de processo vinculado a cliente | EP03 – Processos | Micael |
| `[STORY] US08` | Consulta de processos com filtros | EP03 – Processos | Micael |
| `[STORY] US09` | Anexar PDF ao processo (máx. 10MB) | EP03 – Processos | Micael |

---

## 5. Labels do Projeto

| Label | Cor | Descrição |
|-------|-----|-----------|
| `story` | Azul | User story do MVP |
| `bug` | Vermelho | Defeito em código existente |
| `task` | Cinza | Tarefa técnica sem entrega de valor direto |
| `enhancement` | Verde | Melhoria incremental |
| `question` | Amarelo | Bloqueio por falta de informação |
| `blocked` | Laranja | Issue bloqueada por dependência |
| `in-progress` | Roxo | Em desenvolvimento |
| `review` | Azul-claro | Aguardando code review |
| `done` | Verde-escuro | Concluída e verificada |
| `ep01-auth` | — | Pertence ao Épico 01 |
| `ep02-clientes` | — | Pertence ao Épico 02 |
| `ep03-processos` | — | Pertence ao Épico 03 |

---

## 6. Ciclo de Vida Automático de uma Issue

O fluxo é **totalmente automatizado**: a issue é criada, gera a branch automaticamente, e se fecha sozinha quando o PR é mergeado.

```
1. Issue criada no GitHub
        │
        ▼ (automático — GitHub cria a branch)
2. Branch criada a partir de develop
        │
        ▼ (dev implementa + harness passa)
3. PR aberto com "Closes #<número>"
        │
        ▼ (Marcos aprova e mergea)
4. Issue fechada automaticamente ✅
```

### Como o GitHub cria a branch automaticamente

Ao abrir uma issue, o GitHub exibe o botão **"Create a branch"** no painel lateral direito da issue. Clique nele e:

1. O GitHub sugere o nome da branch com base no título da issue
2. Ajuste o nome seguindo a convenção do projeto (ex: `feature/auth-login`)
3. Selecione `develop` como branch base (não `main`)
4. Clique em **"Create branch"**

A branch já estará vinculada à issue no GitHub.

### Como a issue fecha automaticamente

No corpo do PR, inclua obrigatoriamente:

```
Closes #<número-da-issue>
```

Quando o PR for mergeado em `develop`, o GitHub fecha a issue automaticamente. Não é necessário fechar manualmente.

### Regras de transição

| Transição | Quem faz | Como |
|-----------|----------|------|
| Open → branch criada | Dev (ou IA) | Botão "Create a branch" na issue |
| Branch → PR | Dev (ou IA) | `git push` + abrir PR com `Closes #N` |
| PR → Closed | GitHub (automático) | Merge do PR dispara o fechamento |

---

## 7. Convenção de Nomenclatura de Branch

O nome da branch deve seguir o padrão do `GIT_WORKFLOW.md`. Ao usar o botão "Create a branch" do GitHub, ajuste o nome sugerido:

| Issue | Branch correta |
|-------|----------------|
| US01 – Login | `feature/auth-login` |
| US02 – Cadastro | `feature/auth-register` |
| US03 – Reset senha | `feature/auth-reset` |
| US04–06 – Clientes | `feature/clientes-crud` |
| US07–08 – Processos | `feature/processos-crud` |
| US09 – Upload PDF | `feature/processos-upload` |
| Bug no CPF | `fix/cpf-validacao` |
| Config CI | `ci/github-actions-harness` |

**Branch base sempre: `develop`** — nunca `main`.

---

## 8. Como a IA (Kiro) deve usar as Issues

### Ao receber uma tarefa de implementação:

1. **Identificar a issue relacionada** — Qual US ou tarefa está sendo trabalhada?
2. **Verificar os critérios de aceite** — Lidos diretamente do corpo da issue
3. **Verificar o schema correspondente** — Em `src/specs/schemas/` para a entidade envolvida
4. **Verificar o contrato OpenAPI** — Em `src/specs/openapi.yaml` para a rota envolvida
5. **Gerar código alinhado** — Seguindo MVVM, ADRs e padrões GoF documentados
6. **Rodar o harness** — `npm run harness` antes de considerar a tarefa concluída

### Ao abrir ou sugerir uma issue:

1. Usar o template correto (story / bug / task)
2. Preencher todos os campos obrigatórios
3. Associar a label de épico (`ep01-auth`, `ep02-clientes`, `ep03-processos`)
4. Indicar o responsável esperado com base no `GIT_WORKFLOW.md`

### O que a IA NÃO deve fazer:

- Fechar uma issue sem verificar se o harness passa (`npm run harness`)
- Criar branches ou PRs sem referência a uma issue
- Implementar funcionalidades fora do escopo do MVP sem aprovação explícita
- Modificar testes de contrato para fazer o código "passar" — corrigir o código, não o teste

---

## 9. Milestones

| Milestone | Descrição | Issues relacionadas |
|-----------|-----------|---------------------|
| `MVP - EP01 Auth` | Autenticação completa | US01, US02, US03 |
| `MVP - EP02 Clientes` | CRUD de clientes | US04, US05, US06 |
| `MVP - EP03 Processos` | CRUD de processos + upload | US07, US08, US09 |
| `Harness & Config` | Configuração do harness | Tasks técnicas |

---

## 10. Referências Cruzadas

| Documento | Relevância |
|-----------|-----------|
| `docs/PRD.md` | Fonte das user stories e critérios de aceite |
| `docs/GIT_WORKFLOW.md` | Padrão de branches e commits por membro |
| `docs/AI_Harness.md` | Sensores de validação que a IA deve respeitar |
| `src/specs/openapi.yaml` | Contratos das rotas da API |
| `src/specs/schemas/` | Schemas Zod de validação |
| `.github/pull_request_template.md` | Template de PR vinculado à issue |

---

## 11. Regra obrigatoria para IA: issue antes de PR

Antes de criar qualquer Pull Request, a IA deve confirmar que existe uma issue relacionada.

Fluxo obrigatorio:

1. Procurar issue existente que corresponda ao trabalho.
2. Se nao existir, criar a issue antes do PR.
3. Abrir o PR somente depois da issue existir.
4. Preencher o campo `Issue relacionada` no PR.
5. Usar `Closes #<numero-da-issue>` quando o PR tiver como destino a branch padrao (`main`).

Observacao importante: o fechamento automatico por `Closes #N` acontece quando o PR e mergeado na branch padrao do repositorio. Neste projeto, a branch padrao e `main`. Em PRs intermediarios para `develop`, a issue pode precisar ser fechada manualmente depois da validacao.

A IA nao deve:

- Criar PR sem issue.
- Deixar `Closes #` sem numero.
- Usar template vazio.
- Deixar texto de exemplo no corpo do PR.
- Fechar issue antes do trabalho estar mergeado e validado.
