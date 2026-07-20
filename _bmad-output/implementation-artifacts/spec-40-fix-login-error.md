# Spec 40: Correção do Erro Genérico de Login (Implementation Artifact)

## 1. Escopo Técnico
A implementação da Story 40 visa expandir a capacidade da função utilitária `authError` para cobrir o fluxo padrão do Supabase de exigência de confirmação de e-mail.

## 2. Arquivos a serem Modificados
- **[MODIFY]** `src/features/auth/model/SupabaseAuthAdapter.ts`:
  - Inserção de uma validação de `if (normalized.includes("email not confirmed"))`.
  - Adição de um `console.error` residual antes de soltar o erro genérico.
