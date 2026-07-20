# Épico 08: Integração com Tribunais (Captura Automática)

**Status:** planned

## Objetivo

Automatizar a captura de movimentações processuais através de integração com APIs de dados jurídicos (ex: Jusbrasil/Escavador), reduzindo o trabalho manual do advogado e garantindo que ele não perca atualizações importantes em seus processos.

## Ordem de entrega

1. Story 41 — Infraestrutura Backend (Sync e Schemas).
2. Story 42 — Configuração e UI.

## Dependências

- Este épico depende da estrutura de Processos e Movimentações já desenvolvida no Épico 02.
- Necessita da habilitação do `pg_cron` ou Edge Functions no Supabase.

## Restrições

- As atualizações devem respeitar rigorosamente as políticas RLS.
- O payload retornado pelas APIs externas deve ser tratado via Adapter.
