# Épico 09: Multi-tenancy Completo (Pequenos Escritórios)

**Status:** planned

## Objetivo

Habilitar a plataforma para suportar escritórios de advocacia, permitindo que múltiplos usuários (advogados) colaborem dentro de uma mesma "Organização" (Tenant). Isso eleva o sistema do modelo Single-player para Multi-player.

## Ordem de entrega

1. Story 44 — Estrutura de Banco e Schemas (Migração para tenantId e Organização).
2. Story 45 — Gestão de Membros e Controle de Acesso (UI e Convites).

## Dependências

- Todas as tabelas que usavam exclusividade por `user_id` agora devem depender também de `tenant_id`.
- Requer atualização das regras de Row Level Security (RLS) no Supabase.

## Restrições

- O isolamento dos dados de tenants é inegociável. Um escritório nunca deve ver dados de outro escritório.
- As Views e ViewModels no Frontend devem receber o `tenantId` ativo do usuário para passar nas consultas.
