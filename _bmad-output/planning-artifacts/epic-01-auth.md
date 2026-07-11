# Epic 01: Autenticação Segura (Micael - Backend)

**Status:** Concluído
**Data de Conclusão:** 11 de Julho de 2026
**Responsável (Dev):** Micael (Agente)

## Resumo do Épico
Este épico teve como objetivo criar o motor base (POO) de autenticação do sistema utilizando Firebase Auth, garantindo a segurança de entrada na aplicação ThemisTec. As responsabilidades visuais (telas) foram deixadas para a Josiane (Épico de Frontend).

## Histórias de Usuário (Stories) Implementadas

### US01: Login de Usuário (Issue #10)
- **O que foi feito:** Criação da interface IAuthService e implementação inicial de FirebaseAuthAdapter.ts usando signInWithEmailAndPassword.
- **Validação:** Tipagem Zod (LoginInput) respeitada. Teste estático via tsc e Linter validado com sucesso. Trata erros comuns.

### US02: Cadastro com Confirmação (Issue #12 - PR #20)
- **O que foi feito:** Expansão do adapter para suportar createUserWithEmailAndPassword e updateProfile. Inclusão obrigatória de sendEmailVerification.
- **Validação:** Tratamento de erros específicos. Lint e Typecheck passados com sucesso.

### US03: Recuperação de Senha (Issue #13 - PR #21)
- **O que foi feito:** Método resetPassword acionado via sendPasswordResetEmail. Refatoração global de segurança trocando tipos vagos pelo tipo oficial FirebaseError.
- **Validação:** Linter pacificado. Todo o ciclo de vida do motor de credenciais (Login, Registro, Reset e Logout) centralizado.

## Retrospectiva do Desenvolvimento
- **Arquitetura Respeitada:** O princípio de Inversão de Dependência (DIP) foi 100% honrado. A camada que for consumir isso conhecerá apenas a interface IAuthService.
- **Dívida Técnica:** Ausência de testes unitários automatizados com Vitest/Jest.
- **Trabalho Futuro:** A Frontend Designer (Josiane) precisa consumir estes três métodos nas respectivas telas (Pages) do sistema.
