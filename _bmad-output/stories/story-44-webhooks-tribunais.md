---
epic: epic-03-automacao
title: Captura em Tribunais (Webhooks)
status: todo
---

# Story 44: Captura em Tribunais via Webhooks

**Como** um sistema ThemisTec
**Eu quero** receber notificações de andamentos processuais via webhook (Escavador/Jusbrasil)
**Para que** eu possa atualizar automaticamente a linha do tempo (Movimentações) dos processos dos advogados sem intervenção manual.

## Critérios de Aceitação

1. Existência de uma rota de API pública (`/api/webhooks/tribunais`) apta a receber POST.
2. A rota deve validar a assinatura de segurança via chave secreta.
3. Ao receber um andamento, localizar o processo pelo `numero` (CNJ) na tabela `processos`.
4. Se encontrado, inserir o log na tabela `movimentacoes` atrelado àquele processo.

## Limites (Harness)
- Não precisaremos integrar a assinatura do serviço agora (pagamento), apenas construir o receptor para o payload padrão de webhook.
- O endpoint deve ser extremamente rápido e seguro contra abusos.
