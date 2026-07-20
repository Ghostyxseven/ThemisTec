# Story 46: Motor de Alertas (Backend)

**Épico:** 10 - Notificações
**Estimativa:** Alta
**Responsável:** Micael

## Descrição
Como servidor automatizado,
Eu quero consultar o banco de dados diariamente por prazos a vencer,
Para notificar os advogados responsáveis via e-mail.

## Critérios de Aceite
- **Dado** o banco de dados do Supabase
- **Quando** a Edge Function `email-automation` for disparada
- **Então** ela deve buscar Prazos com data de hoje e Movimentações novas (criadas nas últimas 24h).
- **E** deve simular um envio de e-mail (mock ou Resend) consolidando essas informações para o respectivo usuário/escritório.
