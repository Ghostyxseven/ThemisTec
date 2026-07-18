# Épico 02: Evolução operacional do escritório

**Status:** planned

## Objetivo

Transformar o ThemisTec de um cadastro jurídico em uma central operacional para agenda, finanças, movimentações, pesquisa, documentos e notificações.

## Ordem de entrega

1. Story 31 — Agenda jurídica completa.
2. Story 33 — Movimentações processuais.
3. Story 34 — Busca global.
4. Story 32 — Dashboard financeiro.
5. Story 35 — Central de documentos.
6. Story 36 — Notificações persistentes.

## Dependências

- Agenda reutiliza os prazos existentes e cria eventos jurídicos tipados.
- Movimentações alimentam busca global e notificações.
- Financeiro reutiliza honorários dos processos e acrescenta lançamentos/parcelas.
- Central de documentos evolui o Storage privado sem duplicar arquivos.
- Notificações consomem agenda, movimentações e financeiro.

## Restrições

- Todas as tabelas devem usar RLS por `user_id`.
- Views e ViewModels não importam Supabase diretamente.
- Google Calendar e Outlook usam exportação `.ics` primeiro; OAuth fica para uma fase posterior.
- E-mails e resumos automáticos exigem serviço server-side separado e não podem expor `service_role`.
