# 8. Adoção de Padrões de Projeto GoF (Refatoração Preventiva)

Data: 2026-06-19

## Status

Aceito

## Contexto

Com o MVP estruturado sob a arquitetura MVVM (ADR-0007), o time identificou pontos críticos de acoplamento e inicialização que, se não tratados agora, comprometem a flexibilidade e estabilidade do sistema antes mesmo da entrada no Spec-Driven Development (SDD):

**Desafio 1 — Fronteira com Serviços Externos (Padrão Criacional/Estrutural):**
Toda a camada de serviços (`src/services/firebase/`) consome diretamente os SDKs do Firebase Auth, Firestore e Storage. Os ViewModels como `useLogin` e `useClientes` importam e instanciam essas dependências externas diretamente. Isso cria um acoplamento rígido entre o core de negócio da plataforma jurídica e a biblioteca de terceiros. Se o Firebase precisar ser trocado, substituído por um mock nos testes, ou complementado com outro provedor de armazenamento no futuro, seria necessário alterar múltiplos arquivos de negócio — violando o princípio OCP (Open/Closed).

**Desafio 2 — Inicialização do SDK do Firebase (Padrão Criacional):**
O Next.js utiliza SSR (Server-Side Rendering) e CSR (Client-Side Rendering). Chamar `initializeApp()` do Firebase múltiplas vezes ou em momentos inadequados causa erros em runtime. Precisamos garantir que o Firebase App seja inicializado apenas uma vez por sessão e possa ser reutilizado globalmente.

**Desafio 3 — Fluxo de Cadastro de Processo (Padrão Comportamental):**
O fluxo de cadastro/atualização de um processo jurídico (feature `processos`) é o caso de uso mais crítico do MVP. Ao salvar um processo, múltiplos efeitos colaterais independentes precisam ser disparados: (a) persistência no Firestore, (b) upload e vinculação do PDF no Firebase Storage e (c) futuramente, notificações e atualizações de dashboard. Implementar tudo isso de forma linear no ViewModel resultaria em uma função monolítica difícil de manter, testar e estender.

## Decisão

O time decidiu adotar três padrões de projeto do GoF para endereçar os desafios identificados:

---

### Padrão 1: Adapter — Isolamento dos SDKs do Firebase

Será criada uma camada de abstração via interfaces TypeScript entre os ViewModels e os serviços do Firebase. Cada serviço externo terá uma interface de contrato e uma implementação concreta (Adapter).

**Estrutura planejada:**

```
src/services/
├── interfaces/
│   ├── IAuthService.ts        # contrato: signIn, signUp, signOut, resetPassword
│   ├── IStorageService.ts     # contrato: uploadFile, deleteFile, getFileUrl
│   └── IClienteRepository.ts # contrato: criar, buscar, atualizar, deletar
└── firebase/
    ├── FirebaseAuthAdapter.ts    # implementa IAuthService usando Firebase Auth SDK
    ├── FirebaseStorageAdapter.ts # implementa IStorageService usando Firebase Storage SDK
    └── FirestoreClienteAdapter.ts# implementa IClienteRepository usando Firestore SDK
```

Os ViewModels (`useLogin`, `useClientes`, `useProcessos`) passarão a depender exclusivamente das interfaces, nunca dos SDKs diretamente. A injeção das implementações concretas ocorrerá via um módulo de composição centralizado.

---

### Padrão 2: Singleton — Instância Única do Firebase Client

Implementaremos o padrão Singleton no arquivo `src/services/firebase/firebase.client.ts` para garantir que o SDK do Firebase (`FirebaseApp`) seja instanciado uma única vez, provendo um ponto de acesso global e seguro para os Adapters.

**Estrutura planejada:**

```typescript
// firebase.client.ts
let app: FirebaseApp | null = null;

export function getFirebaseApp(): FirebaseApp {
  if (!app) {
    app = initializeApp(firebaseConfig);
  }
  return app;
}
```

---

### Padrão 3: Observer — Reações ao Cadastro de Processo

Será implementado um mecanismo de Observer simples para o fluxo de salvamento de processos. O `useProcessos` (ViewModel) atuará como **Subject**, notificando uma lista de **Observers** registrados toda vez que um processo for criado ou atualizado com sucesso.

**Estrutura planejada:**

```
src/shared/observers/
├── IProcessoObserver.ts       # interface: onProcessoSalvo(processo: Processo): void
├── PersistenciaObserver.ts    # salva no Firestore
├── StorageObserver.ts         # faz upload do PDF e vincula a URL
└── ProcessoEventBus.ts        # gerencia o array de observers e dispara notificações
```

O `useProcessos` instanciará o `ProcessoEventBus`, registrará os observers necessários e chamará `eventBus.notify(processo)` após a validação. Novos efeitos colaterais (ex: notificações push, log de auditoria) poderão ser adicionados como novos Observers sem alterar nada no ViewModel existente.

## Consequências

**Ganhos:**
- O core de negócio do ThemisTec (regras jurídicas, validações de processos) fica completamente desacoplado das bibliotecas externas do Firebase, permitindo troca ou mock sem alteração dos ViewModels.
- O fluxo de cadastro de processos torna-se extensível por composição: adicionar uma notificação ou log é apenas adicionar um Observer ao EventBus, sem tocar no código existente.
- O Firebase é inicializado de forma segura, eliminando bugs de runtime com o Next.js SSR.
- A camada de interfaces funciona como os contratos exatos que serão especificados na próxima etapa do SDD, reduzindo o retrabalho de especificação.
- Testes unitários dos ViewModels tornam-se triviais: basta injetar mocks das interfaces ao invés dos SDKs reais.

**Custos e Trade-offs:**
- O número de arquivos e interfaces aumenta significativamente antes de qualquer funcionalidade nova ser entregue, o que pode gerar confusão inicial para membros menos experientes do time.
- A injeção de dependência manual (sem um container IoC) exige disciplina da equipe para não instanciar os Adapters Firebase diretamente nos componentes, criando pontos de acoplamento "escondidos".
- O padrão Observer, sem um gerenciador de estado robusto, pode dificultar o rastreamento da ordem de execução dos efeitos colaterais em caso de falha parcial (ex: o PDF foi enviado mas o Firestore falhou), exigindo tratamento de rollback explícito em `ProcessoEventBus`.
- Existe um risco de over-engineering para o escopo atual do MVP: os padrões só justificam seu custo se as integrações de fato mudarem ou os observers se multiplicarem.
