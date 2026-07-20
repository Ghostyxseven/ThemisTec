# Implementation Spec 44: Captura em Tribunais (Webhooks)

## 1. Contexto
Implementar um webhook receptor para atualizações de andamentos de tribunais, conforme Story 44.

## 2. Arquivos Modificados/Criados

- **`src/app/api/webhooks/tribunais/route.ts` [NOVO]**: Rota POST.
  - Verifica o header de autorização customizado (`x-webhook-secret`) batendo com variável de ambiente `WEBHOOK_TRIBUNAIS_SECRET`.
  - Extrai `numero_cnj` e `texto_andamento` do JSON.
  - Usa a service role key do Supabase (`@supabase/supabase-js` com `process.env.SUPABASE_SERVICE_ROLE_KEY`) para buscar o processo pelo número ignorando RLS inicial, descobrindo assim o `user_id` e o `processo_id`.
  - Insere o registro em `movimentacoes` passando o `user_id` do dono do processo.
  - Responde HTTP 200 para confirmar recebimento.

## 3. Variáveis de Ambiente Necessárias
- `WEBHOOK_TRIBUNAIS_SECRET`
- `SUPABASE_SERVICE_ROLE_KEY` (Para bypassar o RLS ao inserir em background).

## 4. Validação
- Disparar requisições POST locais ou via curl para verificar se rejeita não autorizados e se insere com sucesso a movimentação no banco.
