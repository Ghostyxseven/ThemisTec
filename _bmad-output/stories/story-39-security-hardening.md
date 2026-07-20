# Story 39: Blindagem de Segurança (Supabase RLS)

## Contexto e Valor de Negócio
**Epic:** Epic 02 - Evolução Operacional e Técnica
**User Story:** Como administrador do sistema, eu quero garantir que as políticas de Row Level Security (RLS) do Supabase estejam estritamente habilitadas em todas as tabelas de negócio (clientes, processos), para que nenhum advogado possa acessar os dados de outro, garantindo total privacidade e inviolabilidade das informações processuais.

## Acceptance Criteria
- [ ] A tabela `clientes` deve estar com RLS habilitado, restrito apenas a usuários logados cujos IDs correspondam ao `user_id` da linha em operações de SELECT, INSERT, UPDATE e DELETE.
- [ ] A tabela `processos` deve seguir a mesma regra rigorosa de RLS.
- [ ] As políticas antigas/frouxas devem ser sobrepostas ou apagadas (DROP) preventivamente.

## Requisitos Técnicos
- Escrita de uma migration SQL pura que executa o `ALTER TABLE` e os comandos `CREATE POLICY`.
