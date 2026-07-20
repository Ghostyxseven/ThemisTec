# Story 02: Cadastro de Conta com Confirmação (US02)

**Responsável:** Josiane / Micael  
**Status:** done
**Épico Relacionado:** Épico 01 - Autenticação  

## 1. Contexto e Objetivo
Como novo usuário, quero criar uma conta com nome, e-mail e senha para poder acessar e gerenciar meus clientes e processos jurídicos no ThemisTec.

## 2. Contratos Rigorosos (Spec-Driven Development)
- **Schema de Validação:** Utilizar o schema `RegisterSchema` em `src/specs/schemas/auth.schema.ts` para validar o input do usuário.
- **ViewModel:** A View deve consumir apenas a ViewModel correspondente (`useRegister.ts`) para lidar com a submissão e os estados de loading/erro.
- **Serviço de Autenticação:** A chamada do Firebase deve ser delegada ao adaptador de autenticação (`IAuthService` -> `FirebaseAuthAdapter`), que já tem a lógica implementada.

## 3. Requisitos Técnicos e Visuais
1. **Página de Cadastro (`/register`):**
   * Tela responsiva com visual premium similar à tela de login.
   * Campos: Nome (mín. 2 e máx. 100 caracteres), E-mail (válido) e Senha (mín. 8 caracteres).
   * Validação com `react-hook-form` + `zodResolver(RegisterSchema)`.
   * Feedback visual de carregamento no botão de submit.
   * Mensagem de sucesso amigável informando que um e-mail de confirmação foi enviado.
   * Link para redirecionar o usuário de volta à página de login.
2. **Confirmação por E-mail:**
   * Utilizar a funcionalidade de confirmação nativa do Firebase Auth (já configurada no adaptador).

## 4. Harness Engineering (Regras de Entrega)
- [ ] O código não pode acusar erros no TypeScript (`npm run typecheck`).
- [ ] O código não pode acusar avisos no Linter (`npm run lint`).
- [ ] O PR deve ser associado à Issue #12 no GitHub.
