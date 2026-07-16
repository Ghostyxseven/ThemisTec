# Spec 22: Cadastro de Prazos e Audiências

## 1. Objetivo
Descrever a arquitetura e componentes necessários para permitir o registro de novos prazos e audiências vinculados a processos existentes.

## 2. Escopo
- Definição do schema de validação para prazos (`PrazoSchema`).
- Criação da interface do repositório (`IPrazoRepository`).
- Implementação da camada de banco de dados no Firebase (`FirestorePrazoAdapter`).
- Desenvolvimento do formulário e interface de cadastro (`/prazos/cadastro`).
- Hook responsável pela lógica de submissão do formulário (`useCreatePrazo`).

## 3. Detalhamento Técnico

### 3.1. Schemas (Zod)
- **PrazoSchema:** Deve conter no mínimo `id`, `processoId`, `processoNumero`, `titulo`, `descricao`, `dataVencimento`, `status`, `userId`.
- Validação estrita no formato de data (`YYYY-MM-DD`).
- **CreatePrazoSchema:** Omitir os campos gerados pelo backend (id, userId, etc.).

### 3.2. Repositório e Adapter
- Criar a interface abstrata `IPrazoRepository` garantindo forte tipagem para o método `criar(userId, data)`.
- Implementar `FirestorePrazoAdapter` que recupera o número do processo (desnormalização para otimizar leitura) e grava o prazo na coleção `prazos`.

### 3.3. Interface Gráfica (Cadastro)
- Componente Server-Side `page.tsx` no diretório `prazos/cadastro`.
- Formulário usando TailwindCSS contendo os inputs de Título, Data (tipo `date`), Processo Vinculado (Select/Dropdown) e Descrição.
- O Select de processos deve listar apenas os processos do usuário logado.

### Arquivos Modificados/Criados
1. `src/specs/schemas/prazo.schema.ts` [NEW]
2. `src/shared/interfaces/IPrazoRepository.ts` [NEW]
3. `src/services/firebase/FirestorePrazoAdapter.ts` [NEW]
4. `src/services/index.ts` [MODIFY]
5. `src/app/(authenticated)/prazos/cadastro/page.tsx` [NEW]
6. `src/app/(authenticated)/prazos/cadastro/useCreatePrazo.ts` [NEW]

## 4. Testes e Validação
- Validar envio de formulário com campos vazios (deve gerar erro).
- Verificar se a gravação no Firestore ocorreu com a formatação correta de data (ISO).
- Testar desnormalização, validando se o `processoNumero` salvo no documento do prazo confere com o Processo selecionado.
