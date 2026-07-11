# Story 07: Registro de Processo Vinculado a Cliente (US07)

**Responsável:** Josiane  
**Status:** review  
**Épico Relacionado:** Épico 03 - Gestão de Processos  

## 1. Contexto e Objetivo
Desenvolver a funcionalidade de cadastro de processos jurídicos no sistema, garantindo a associação correta com um cliente previamente cadastrado.

## 2. Contratos Rigorosos (Spec-Driven Development)
- **Schema de Validação:** Utilizar o schema de validação `CreateProcessoSchema` em `src/specs/schemas/processo.schema.ts`.
- **ViewModel:** A View deve consumir apenas a ViewModel correspondente (ex: `useCreateProcesso`) para realizar a criação e lidar com estados de processamento.
- **Banco de Dados (Firestore):** As gravações devem ser propagadas ao Firestore por intermédio de um Adapter de Processos concreto.

## 3. Requisitos Técnicos e Visuais
1. **Formulário de Cadastro:**
   - Campos: Número do processo (obrigatório), Tipo do processo (dropdown com as opções de `TipoProcessoEnum`), Cliente vinculado (campo de seleção obrigatório), Data de abertura (tipo date, obrigatório) e Descrição (opcional, máximo de 1000 caracteres).
   - O campo de seleção de clientes deve listar os clientes cadastrados daquele advogado (`userId`) para que ele selecione o dono do processo.
2. **Validações:**
   - Acoplar validações do Zod usando `react-hook-form` + `zodResolver(CreateProcessoSchema)`.
   - Garantir que a data selecionada obedeça ao formato de data esperado.
3. **Feedback:**
   - Loader indicando o progresso da gravação.
   - Mensagens de erro amigáveis exibidas abaixo dos respectivos inputs.
   - Redirecionamento automático para a tela de listagem de processos após o salvamento.

## 4. Harness Engineering (Regras de Entrega)
- [x] O código não pode acusar erros no TypeScript (`npm run typecheck`).
- [x] O código não pode acusar avisos no Linter (`npm run lint`).
- [ ] Nenhum Pull Request pode ser criado sem uma Issue associada.
