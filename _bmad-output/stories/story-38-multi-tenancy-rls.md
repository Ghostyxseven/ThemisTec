---
epic: Epic 07
status: todo
---
# Story 38: Multi-Tenancy e Refatoração RLS

**Como** um sócio de escritório
**Quero** que meus estagiários e sócios acessem o mesmo banco de processos
**Para** trabalhar em equipe com segurança de dados.

## Critérios de Aceite
1. Tabela escritorios e escritorio_usuarios no Supabase.
2. Atualização das Policies RLS para ler/escrever baseado no escritorio_id.
3. Contexto no Next.js fornecendo o ctiveTenantId para a camada ViewModel.
