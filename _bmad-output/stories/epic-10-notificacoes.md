# Épico 10: Automações e Notificações Ativas

**Status:** em_andamento

## Objetivo

Transformar o ThemisTec de um sistema puramente reativo para um assistente proativo. Os advogados devem ser notificados automaticamente sobre prazos que vencem no dia e sobre novas movimentações processuais detectadas na captura automática.

## Ordem de entrega

1. Story 46 — Motor de Notificações Backend (Cron e Edge Functions para varredura e envio de E-mails).
2. Story 47 — Central de Notificações In-App (Sininho de Alertas no Navbar e preferências do usuário).

## Restrições

- Evitar "Spam" e fadiga de notificações. Agrupar alertas do dia em um único E-mail "Daily Digest" (Resumo Diário).
- A Edge Function deve ser agendada via pg_cron do Supabase.
