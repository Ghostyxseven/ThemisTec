# Git Workflow - ThemisTec

> Padrão de branches, commits e responsabilidades da equipe

---

## 1. Estrutura de Branches

```
main                    ← produção (protegida, só merge via PR)
  └── develop           ← branch de integração (todos mergem aqui)
        ├── feature/auth-login          ← US01
        ├── feature/auth-register       ← US02
        ├── feature/auth-reset          ← US03
        ├── feature/clientes-crud       ← US04, US05, US06
        ├── feature/processos-crud      ← US07, US08
        ├── feature/processos-upload    ← US09
        ├── fix/nome-do-bug             ← correções
        ├── docs/nome-do-doc            ← documentação
        └── config/nome-da-config       ← configurações (eslint, ci, etc.)
```

### Regras

| Regra | Descrição |
|-------|-----------|
| Nunca commitar direto na `main` | Sempre via Pull Request |
| `develop` é a branch de trabalho | Features saem de `develop` e voltam para `develop` |
| Merge para `main` só quando estável | Após testes passarem na `develop` |
| Uma branch por feature/user story | Não misturar features na mesma branch |

### Como criar uma branch

```bash
git checkout develop
git pull origin develop
git checkout -b feature/auth-login
```

### Como fazer merge (PR)

```bash
git push -u origin feature/auth-login
# Criar Pull Request no GitHub: feature/auth-login → develop
```

---

## 2. Padrão de Commits (Conventional Commits)

### Formato

```
<tipo>(<escopo>): <descrição curta>

[corpo opcional - explica o que e por quê]
```

### Tipos permitidos

| Tipo | Quando usar | Exemplo |
|------|-------------|---------|
| `feat` | Nova funcionalidade | `feat(clientes): adicionar cadastro de cliente` |
| `fix` | Correção de bug | `fix(auth): corrigir redirect após login` |
| `docs` | Documentação | `docs: criar PRD do projeto` |
| `style` | Formatação (sem mudar lógica) | `style(clientes): ajustar indentação` |
| `refactor` | Refatoração (sem mudar comportamento) | `refactor(services): extrair adapter do Firebase` |
| `test` | Adicionar/corrigir testes | `test(schemas): adicionar testes de CPF inválido` |
| `config` | Configs e ferramentas | `config: configurar ESLint strict mode` |
| `ci` | CI/CD | `ci: adicionar GitHub Actions para testes` |

### Escopos (opcionais)

| Escopo | Área |
|--------|------|
| `auth` | Autenticação (EP01) |
| `clientes` | Gestão de clientes (EP02) |
| `processos` | Gestão de processos (EP03) |
| `services` | Camada de serviços (Firebase) |
| `specs` | Contratos e schemas |
| `harness` | ESLint, tsc, testes |
| `ui` | Componentes visuais compartilhados |

### Exemplos bons ✅

```
feat(auth): implementar login com Firebase Auth
feat(clientes): criar formulário de cadastro com validação Zod
fix(processos): corrigir upload de PDF acima de 10MB
test(specs): adicionar testes de contrato para ProcessoSchema
docs: atualizar PRD com critérios de sucesso
config(harness): adicionar regra no-floating-promises no ESLint
refactor(services): aplicar padrão Adapter no FirebaseAuth
```

### Exemplos ruins ❌

```
update                          ← não diz nada
fix bug                         ← qual bug? onde?
mudanças no código              ← sem contexto
WIP                             ← não commitar trabalho incompleto
feat: tudo                      ← commit gigante, dividir em partes
```

### Regras de commit

- Commit **pequeno e focado** (1 commit = 1 mudança lógica)
- Descrição em **português** e no **imperativo** (adicionar, corrigir, criar)
- Máximo **72 caracteres** na primeira linha
- Se o commit é grande demais para explicar em 72 chars, precisa ser dividido

---

## 3. Responsabilidades por Membro

### Marcos Vinícius (Líder / Scrum Master / PO)

| Responsabilidade | Branches |
|-----------------|----------|
| Coordenação geral e code review | Revisar PRs de todos |
| Arquitetura e configurações | `config/*`, `docs/*` |
| Specs e contratos | `feature/specs-*` |
| AI Harness (ESLint, tsc, testes) | `config/harness-*` |
| Deploy e CI/CD | `ci/*` |

### Micael Cardoso (Dev Backend / DBA)

| Responsabilidade | Branches |
|-----------------|----------|
| Serviços Firebase (Auth, Firestore, Storage) | `feature/services-*` |
| Adapters e padrões GoF | `feature/services-*` |
| Lógica de negócio (ViewModels) | `feature/auth-*`, `feature/processos-*` |
| Regras de segurança do Firestore | `config/firebase-rules` |
| Upload de arquivos (Storage) | `feature/processos-upload` |

### Josiane Amorim (Dev Frontend / Designer)

| Responsabilidade | Branches |
|-----------------|----------|
| Componentes visuais (View) | `feature/ui-*` |
| Páginas e layout | `feature/auth-*`, `feature/clientes-*` |
| Responsividade e design | `feature/ui-*` |
| Formulários com validação visual | `feature/clientes-crud`, `feature/processos-crud` |
| Estilização (CSS/Tailwind) | `style/*` |

### Gisele Dias (PO + Apoio ao Marcos)

| Responsabilidade | Branches |
|-----------------|----------|
| Documentação de produto | `docs/prd`, `docs/user-stories` |
| Validação de critérios de aceite | Revisar PRs das features |
| Apoio ao Marcos na coordenação e configs | `config/*`, `docs/*` |
| Specs, contratos e testes de contrato | `feature/specs-*`, `test/*` |
| AI Harness e documentação técnica | `config/harness-*` |
| Deploy e CI/CD (com Marcos) | `ci/*` |

---

## 4. Fluxo de Trabalho Diário

```
1. Pegar tarefa do sprint (story/issue)
2. Criar branch a partir de develop
3. Implementar com commits pequenos e descritivos
4. Rodar o harness antes de push:
   npm run harness
5. Push e criar Pull Request → develop
6. Solicitar review de pelo menos 1 membro
7. Após aprovação → merge squash para develop
8. Quando develop estiver estável → PR para main
```

### Checklist antes do PR

- [ ] `npm run typecheck` passa sem erros
- [ ] `npm run lint` passa sem erros
- [ ] `npm run test` todos os testes passam
- [ ] Commit messages seguem o padrão
- [ ] Branch está atualizada com develop
- [ ] Código respeita os schemas Zod (contratos)

---

## 5. Proteção de Branches (GitHub)

### Configurar no GitHub → Settings → Branches:

**Branch `main`:**
- ✅ Require pull request before merging
- ✅ Require approvals (mínimo 1)
- ✅ Require status checks to pass (harness)
- ✅ Require branches to be up to date

**Branch `develop`:**
- ✅ Require pull request before merging
- ✅ Require status checks to pass (opcional)

---

## 6. Resumo Visual

```
                    ┌─────────┐
                    │  main   │ ← produção (deploy)
                    └────▲────┘
                         │ PR (quando estável)
                    ┌────┴────┐
                    │ develop │ ← integração
                    └────▲────┘
                         │ PRs das features
          ┌──────────────┼──────────────┐
          │              │              │
   feature/auth   feature/clientes  feature/processos
   (Micael)       (Josiane)         (Micael)
   
   config/* + docs/* + ci/*
   (Marcos + Gisele)
```
