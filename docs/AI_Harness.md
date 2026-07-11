# AI Harness - Harness Engineering: ThemisTec

> Documentação da arquitetura de controle para desenvolvimento assistido por IA  
> Artefato 3 da Entrega Final — Engenharia de Software 2

---

## 1. Visão Geral

O time ThemisTec adotou o paradigma de **Harness Engineering** para cercar o desenvolvimento assistido por IA com mecanismos automáticos de validação. O objetivo é garantir que nenhum código gerado — seja por agente de IA ou manualmente — viole os contratos, padrões arquiteturais ou regras de negócio definidos nos artefatos anteriores (PRD e Specs).

O Harness funciona em duas forças complementares:

```
┌──────────────────────────────────────────────────────────────────┐
│                        AI HARNESS                                 │
│                                                                   │
│  ┌─────────────┐    ┌──────────┐    ┌─────────────────────────┐  │
│  │ FEEDFORWARD │ →  │ AGENTE   │ →  │       FEEDBACK          │  │
│  │ (Entrada)   │    │   IA     │    │  (Sensores de Saída)    │  │
│  │             │    │          │    │                         │  │
│  │ • Specs     │    │  Gera    │    │  1. ESLint (estilo)     │  │
│  │ • ADRs      │    │  código  │    │  2. tsc (tipos)         │  │
│  │ • Prompts   │    │          │    │  3. Vitest (regras)     │  │
│  │ • Steering  │    │          │    │                         │  │
│  └─────────────┘    └──────────┘    └─────────────────────────┘  │
│                                                                   │
│         Se falhar qualquer sensor → Loop de correção 🔄           │
└──────────────────────────────────────────────────────────────────┘
```

---

## 2. Mecanismo de Feedforward (Garantia de Entrada)

O Feedforward define **o que** a IA recebe antes de gerar qualquer código. São as fronteiras e contratos que limitam a geração.

### 2.1 Specs como Contrato (Spec-Driven Development)

Antes de qualquer implementação, foram criados os contratos formais do sistema:

| Artefato | Localização | Função |
|----------|-------------|--------|
| OpenAPI 3.0 | `src/specs/openapi.yaml` | Contrato de todas as 12 rotas da API (request/response) |
| Schemas Zod | `src/specs/schemas/*.ts` | Validação tipada de payloads de entrada e saída |

**Como são injetados na IA:**
- Os schemas Zod são referenciados no steering (`.kiro/steering/`) como contexto obrigatório
- O agente IA é instruído a importar e usar os schemas para validar qualquer dado de entrada
- Nenhuma rota pode ser implementada sem um schema correspondente

Exemplo de uso obrigatório nos ViewModels:
```typescript
import { CreateClienteSchema } from "@/specs/schemas/cliente.schema";

// A IA DEVE validar com o schema antes de enviar ao Firestore
const result = CreateClienteSchema.safeParse(dados);
if (!result.success) throw new ValidationError(result.error);
```

### 2.2 ADRs e Design Patterns

As decisões arquiteturais foram documentadas como **ADRs (Architecture Decision Records)** e são injetadas como contexto para a IA:

| ADR | Decisão | Impacto no código |
|-----|---------|-------------------|
| ADR-0003 | Stack: Next.js + Firebase + Vercel | Limita tecnologias permitidas |
| ADR-0004 | Autenticação com Firebase Auth | Proíbe outros provedores de auth |
| ADR-0007 | Padrão MVVM | View (componentes) ← ViewModel (hooks) ← Model (services) |
| ADR-0008 | Padrões GoF: Adapter, Singleton, Observer | Estrutura obrigatória dos services |

**Como são injetados na IA:**
- Referenciados via `#[[file:docs/architecture/decisions/]]` nos steering files
- O agente verifica ADRs antes de criar novos arquivos
- Qualquer desvio de arquitetura é flagged pelo ESLint (regras customizadas de import)

### 2.3 Prompts e Steering Files

O BMad Method configura **steering files** (`.kiro/steering/`) que são automaticamente injetados em toda interação com o agente IA:

- **Linguagem:** Português para documentação, inglês para código
- **Estrutura de pastas:** MVVM obrigatório (`features/{nome}/model|view|viewmodel`)
- **Imports:** Usar aliases (`@/specs/`, `@/services/`, `@/features/`)
- **Validação:** Sempre usar schemas Zod na fronteira de entrada de dados

---

## 3. Mecanismo de Feedback (Loop de Correção por Sensores)

O Feedback é o **cinturão de testes automáticos** que valida a saída da IA. Cada sensor executa em sequência, e qualquer falha dispara um loop de correção.

### 3.1 Sensor 1: ESLint (Estilo e Qualidade de Código)

**Arquivo:** `.eslintrc.json`

| Regra | Severidade | Propósito |
|-------|-----------|-----------|
| `no-explicit-any` | error | Proíbe uso de `any` — força tipagem rígida |
| `no-unsafe-assignment` | error | Bloqueia atribuições sem tipo |
| `no-unsafe-call` | error | Bloqueia chamadas a funções sem tipo |
| `no-floating-promises` | error | Obriga tratamento de todas as promises |
| `no-misused-promises` | error | Previne uso incorreto de async/await |
| `no-unused-vars` | error | Remove variáveis mortas |
| `no-console` | warn | Evita logs esquecidos (exceto warn/error) |
| `explicit-function-return-type` | warn | Encoraja tipagem de retorno |

**Comando:** `npm run lint`

**Loop de correção:** Se o ESLint reportar erros, o agente IA recebe a lista de erros e deve corrigir antes de prosseguir.

### 3.2 Sensor 2: TypeScript Compiler (Checagem de Tipos)

**Arquivo:** `tsconfig.json`

| Flag | Efeito |
|------|--------|
| `strict: true` | Ativa todas as verificações estritas |
| `noUncheckedIndexedAccess` | Arrays e objetos indexados podem ser `undefined` |
| `noImplicitReturns` | Toda branch de função deve retornar |
| `noFallthroughCasesInSwitch` | Switch sem break é erro |
| `noUnusedLocals` | Variáveis não usadas são erro |
| `noUnusedParameters` | Parâmetros não usados são erro |

**Comando:** `npm run typecheck`

**Loop de correção:** Se `tsc` detectar incompatibilidade entre o código e os schemas/interfaces, o agente recebe os erros de tipo e deve corrigir até compilar sem erros.

### 3.3 Sensor 3: Vitest (Testes Automatizados)

**Arquivo:** `vitest.config.ts`

Os testes validam que as **regras de negócio** estão corretas e que os contratos (schemas) estão sendo respeitados.

| Suite de Testes | Localização | O que valida |
|-----------------|-------------|--------------|
| Contratos Auth | `src/tests/specs/auth.schema.test.ts` | Login, Register, ResetPassword |
| Contratos Cliente | `src/tests/specs/cliente.schema.test.ts` | CPF válido, campos obrigatórios, limites |
| Contratos Processo | `src/tests/specs/processo.schema.test.ts` | Tipos, status, upload, paginação |

**Comando:** `npm run test`

**Loop de correção:** Se um teste falhar, significa que o código viola o contrato especificado. O agente deve corrigir a implementação (não o teste) até todos passarem.

---

## 4. Fluxo Completo do Harness

```
┌────────────────────────────────────────────────────────────────┐
│                    FLUXO DE DESENVOLVIMENTO                     │
│                                                                 │
│  Specs + ADRs + Steering                                        │
│         │                                                       │
│         ▼                                                       │
│  ┌─────────────┐                                                │
│  │  Agente IA  │  ← Recebe contexto (Feedforward)               │
│  │  gera código│                                                │
│  └──────┬──────┘                                                │
│         │                                                       │
│         ▼                                                       │
│  ┌─────────────┐    ┌──────────┐    ┌──────────────┐           │
│  │  1. ESLint  │ →  │ 2. tsc   │ →  │  3. Vitest   │           │
│  │  (estilo)   │    │ (tipos)  │    │  (contratos) │           │
│  └──────┬──────┘    └────┬─────┘    └──────┬───────┘           │
│         │                │                  │                   │
│    ❌ Erro?          ❌ Erro?          ❌ Falhou?               │
│         │                │                  │                   │
│         └────────────────┴──────────────────┘                   │
│                          │                                      │
│                    ▼ SIM → Loop de correção 🔄                   │
│                    ▼ NÃO → ✅ Código aprovado                    │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

**Comando unificado do Harness:**
```bash
npm run harness
# Executa: typecheck → lint → test (em sequência)
```

---

## 5. Integração com o Agente IA (Antigravity)

O Antigravity IDE foi configurado com:

1. **Skills do BMad Method** (87 skills em `.kiro/skills/`) — guiam o agente nos fluxos de trabalho
2. **Steering files** — injetam contexto automático (specs, ADRs, padrões)
3. **Hooks** — disparam validações automáticas em eventos do IDE

### Hooks Configurados

| Hook | Trigger | Ação |
|------|---------|------|
| Lint on Save | Arquivo `.ts/.tsx` editado | `npm run lint` |
| Typecheck | Antes de commit | `npm run typecheck` |
| Teste de contrato | Após implementação de feature | `npm run test` |

---

## 6. Ferramentas do Harness

| Camada | Ferramenta | Versão | Função |
|--------|-----------|--------|--------|
| Feedforward | OpenAPI Spec | 3.0.3 | Contrato de rotas |
| Feedforward | Zod | 3.23.8 | Schemas de validação tipados |
| Feedforward | BMad Method | 6.10.0 | Steering e skills para IA |
| Feedback | ESLint | 8.57.0 | Linter e formatador |
| Feedback | TypeScript (tsc) | 5.5.4 | Checagem estrita de tipos |
| Feedback | Vitest | 2.0.5 | Testes automatizados |
| IDE | Antigravity | - | Agente IA com hooks e steering |

---

## 7. Evidências de Funcionamento

### Execução do Harness

```bash
$ npm run harness

> typecheck
✓ TypeScript: 0 errors

> lint
✓ ESLint: 0 errors, 0 warnings

> test
✓ Auth Schemas: 7 tests passed
✓ Cliente Schemas: 10 tests passed
✓ Processo Schemas: 13 tests passed

Total: 30 tests passed | 0 failed
```

### Exemplo de Loop de Correção

1. IA gera função sem validação Zod
2. `tsc` reporta: "Type 'unknown' is not assignable to 'CreateClienteInput'"
3. IA corrige: adiciona `CreateClienteSchema.parse(input)`
4. ESLint reporta: "Floating promise detected"
5. IA corrige: adiciona `await` ou `.catch()`
6. Todos os sensores passam → ✅ código aprovado
