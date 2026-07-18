# Story 36: Notificações persistentes

**Status:** ready-for-spec

## Story

**Como** usuário,
**quero** receber e administrar alertas relevantes,
**para que** compromissos e pendências não dependam apenas da minha memória.

## Critérios de aceitação

- [ ] Persistir notificações com origem, prioridade e destino.
- [ ] Marcar uma ou todas como lidas.
- [ ] Manter histórico paginado e contador de não lidas.
- [ ] Configurar antecedência por tipo de evento.
- [ ] Enviar alertas por e-mail somente quando habilitados.
- [ ] Gerar resumo diário de compromissos e pendências.
- [ ] Evitar notificações duplicadas por chave de idempotência.
- [ ] Aplicar RLS e testes de geração/isolamento.
