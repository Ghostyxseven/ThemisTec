# SPEC: Cadastro de Cliente (Front-end)

**Referência:** Story 04 (Josiane)  
**Status:** Ready for Dev  

## 1. Arquivos-Alvo (Target Files)
Esta especificação dita as mudanças exatas que deverão ser feitas para concluir a Story 04 (US04).

- **Página Visual:** `src/app/clientes/cadastro/page.tsx` [NEW]
- **Hook de Lógica (ViewModel):** `src/app/clientes/cadastro/useCreateCliente.ts` [NEW]
- **Schema de Validação (Não alterar):** `src/specs/schemas/cliente.schema.ts`

## 2. Instruções de Implementação

### 2.1. O Contrato do Adapter
O ViewModel de criação de clientes deve interagir com um serviço concreto (que encapsulará a chamada ao Firestore). 
O Adapter de Clientes deve validar que o CPF é único na base do Firestore para o respectivo advogado (`userId`) antes de persistir o registro.

### 2.2. ViewModel (`useCreateCliente.ts`)
Criar o custom hook que funcionará como a ViewModel (padrão MVVM):
- **Campos de Estado:** `isLoading` (boolean) e `errorMessage` (string | null).
- **Assinatura do Método:** `createCliente(dados: CreateClienteInput): Promise<void>`.
- O método deve extrair o `userId` do usuário autenticado no momento, injetá-lo no objeto do cliente e enviar a requisição de salvamento via Adapter de Clientes.
- Tratar possíveis erros do Firebase (ex: "CPF já cadastrado") e expor mensagens amigáveis em português no `errorMessage`.

### 2.3. View (`src/app/clientes/cadastro/page.tsx`)
Criar a tela visual de cadastro:
- Utilizar `"use client"`.
- Importar `useForm` de `react-hook-form` e `zodResolver` de `@hookform/resolvers/zod`.
- Usar o schema `CreateClienteSchema` para validação em tempo real.
- Aplicar máscara de CPF (`000.000.000-00`) para digitação, mas garantir que apenas dígitos limpos sejam enviados para o `createCliente`.
- **Feedbacks:**
  - Exibir loader ou texto de carregamento no botão de salvar se `isLoading` for verdadeiro.
  - Exibir a mensagem do `errorMessage` da ViewModel no topo do formulário em caso de erro.
  - Mostrar os erros do Zod sob cada respectivo input em vermelho.

## 3. Limites Estritos (Harness)
- 🛑 **PROIBIDO:** A View acessar diretamente o Firestore ou serviços do Firebase.
- 🛑 **PROIBIDO:** Criar funções de validação manual para o CPF. O `CreateClienteSchema` é a lei.
- ✅ **OBRIGATÓRIO:** Executar `npm run typecheck` e `npm run lint` antes do commit final.
