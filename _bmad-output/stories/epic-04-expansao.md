# Épico 04: Expansão e Colaboração

**Status:** todo

## Objetivo

Transformar o ThemisTec de uma ferramenta individual para uma plataforma multi-tenant (pequenos escritórios), além de melhorar significativamente a experiência mobile com modo offline.

## Ordem de entrega (Stories propostas)

1. **Story 50 — Multi-tenancy (Workspaces)**: Refatorar o banco (Supabase) para ter a tabela `workspaces` e `workspace_users`, ajustando as políticas de RLS.
2. **Story 51 — Controle de Acesso (RBAC)**: Perfil de Sócio, Advogado Júnior e Estagiário (leitura vs. escrita).
3. **Story 52 — PWA Offline (Service Workers)**: Implementar IndexedDB e `next-pwa` para cache de consultas de processos.
4. **Story 53 — Notificações Push (Web Push)**: Integrar Web Push API para alertas de agenda iminentes.
5. **Story 54 — Relatórios e Exportação**: Gerador de relatórios visuais (PDF/Excel) do dashboard financeiro e produtividade.

## Dependências

- Exige forte validação das políticas RLS do Supabase que atualmente filtram apenas por `user_id`. Será necessário migrar para `workspace_id`.
- Offline exige repensar como os Server Actions são consumidos no cliente em momentos sem rede.

## Restrições

- A migração para Multi-tenancy (Workspaces) é uma *breaking change* e requer script de migração para os dados existentes (transformar cada usuário individual em um workspace próprio de 1 pessoa).
