# SPEC: Cadastro de Conta com Confirmação (US02)

**Referência:** Story 02 (Auth Register)  
**Status:** Ready for Dev  

## 1. Arquivos-Alvo (Target Files)
Esta especificação dita as mudanças exatas que deverão ser feitas para concluir a US02.

- **Página de Cadastro:** `src/app/register/page.tsx` [NEW]
- **ViewModel de Cadastro:** `src/app/register/useRegister.ts` [NEW]
- **Schema de Validação (Não alterar):** `src/specs/schemas/auth.schema.ts`

## 2. Instruções de Implementação

### 2.1. ViewModel (`useRegister.ts`)
Criar o hook ViewModel (MVVM):
- **Campos de Estado:** `isLoading` (boolean), `errorMessage` (string | null), `successMessage` (string | null).
- **Métodos:**
  - `registerUser(dados: RegisterInput): Promise<void>`: Chama `authService.register(dados)`, atualiza os estados reativos e define `successMessage` se a operação for concluída com sucesso.

### 2.2. View (`src/app/register/page.tsx`)
Criar a tela visual em `/register`:
- Utilizar `"use client"`.
- Form com `react-hook-form` acoplado ao `zodResolver(RegisterSchema)`.
- Inputs para `nome`, `email`, `senha`.
- Exibir feedbacks de erro individuais por campo e erros gerais vindos da ViewModel.
- Exibir caixa de sucesso amigável quando `successMessage` for preenchida, instruindo o usuário a verificar a caixa de entrada do e-mail.
- Botão/Link para voltar a `/login`.

## 3. Limites Estritos (Harness)
- 🛑 **PROIBIDO:** A View acessar diretamente o Firebase Auth ou instanciar SDKs externos do Firebase.
- ✅ **OBRIGATÓRIO:** Executar `npm run typecheck` e `npm run lint` antes do commit final.
