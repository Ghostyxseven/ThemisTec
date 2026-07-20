# Story 48: Infraestrutura do Módulo Financeiro (Backend)

**Épico:** 11 - Financeiro
**Estimativa:** Baixa
**Responsável:** Micael

## Descrição
Como desenvolvedor backend,
Eu quero criar a tabela `financeiro` no Supabase e estabelecer as políticas de segurança RLS,
Para garantir que o fluxo de caixa de um escritório nunca vaze para outro.

## Critérios de Aceite
- **Dado** o banco PostgreSQL
- **Quando** a migration for executada
- **Então** deve surgir a tabela `financeiro` com suporte a relacionamentos opcionais com `clientes` e `processos`.
- **E** a tabela deve estar selada sob a política `tenant_isolation_financeiro` usando a chave `escritorio_id`.
