# Story 40: Tratamento de Erro de E-mail Não Confirmado no Login

## Contexto e Valor de Negócio
**Epic:** Epic 01 - Autenticação MVP
**User Story:** Como usuário tentando fazer login, eu quero ser avisado caso meu login falhe por causa de e-mail não confirmado, para que eu saiba exatamente que preciso checar minha caixa de entrada, ao invés de receber um erro genérico.

## Acceptance Criteria
- [ ] Quando o Supabase retornar "Email not confirmed", o adaptador de autenticação deve interceptar a mensagem.
- [ ] O sistema deve emitir o erro "Por favor, confirme seu e-mail através do link que enviamos antes de fazer login."
- [ ] Qualquer outro erro não tratado deve logar a mensagem real no console para ajudar no debug futuro.

## Requisitos Técnicos
- Modificar o mapeamento em `authError` dentro do `SupabaseAuthAdapter.ts`.
