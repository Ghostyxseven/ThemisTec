# Story 38: Melhoria de UX com Toasts e Feedback Visual

## Contexto e Valor de Negócio
**Epic:** Epic 04 - Automação Avançada (Feature Extra MVP)
**User Story:** Como usuário do sistema, eu quero receber feedbacks visuais imediatos (toasts) após realizar ações ou enfrentar erros, para ter clareza sobre o estado da aplicação sem precisar interpretar telas congeladas.

## Acceptance Criteria
- [ ] O sistema deve exibir notificações estilo Toast no canto superior direito para ações de sucesso.
- [ ] Mensagens de erro em operações (como falha na geração de documentos) devem acionar um Toast de erro.
- [ ] O layout global deve abraçar o componente `<Toaster />`.

## Requisitos Técnicos
- Utilizar a biblioteca `sonner` para a renderização de toasts.
- Remover estados locais de erro verbosos (`error`) onde couber e usar `toast.error`.
