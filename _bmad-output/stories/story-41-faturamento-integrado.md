# Story 41: Faturamento Integrado (Pix/Boleto)

**Status:** ready-for-dev

## Story

**Como** advogado (usuário do ThemisTec),
**quero** gerar cobranças (Pix e Boleto) integradas a um processo,
**para que** meu cliente possa pagar diretamente pelo Portal ou via link, e o sistema dê baixa automática nos honorários sem intervenção manual.

## Critérios de aceitação

- [ ] A tela de edição/detalhes de um Processo (para o advogado) deve ter um botão "Gerar Cobrança".
- [ ] O formulário de cobrança deve permitir definir valor, data de vencimento e descrição.
- [ ] O sistema deve se integrar com o Gateway de Pagamento (usaremos o **Asaas** como padrão inicial por suportar bem Pix e Boleto) para gerar a cobrança na API deles.
- [ ] A cobrança gerada deve ser salva em uma nova tabela de `cobrancas` vinculada ao `processo_id` e `cliente_id`.
- [ ] O sistema deve possuir um endpoint `/api/webhooks/asaas` capaz de receber notificações do gateway (ex: pagamento confirmado).
- [ ] Ao receber a confirmação de pagamento via Webhook, o sistema deve atualizar o status da cobrança para `PAGA` e atualizar o `status_pagamento` do processo correspondente de forma automatizada.
- [ ] O Portal do Cliente (criado na Story 40) deve exibir a cobrança pendente e o link/QR Code Pix para pagamento.

## Notas Técnicas

- Usar o padrão **Adapter** (`IPaymentGateway` e `AsaasGatewayAdapter`) para abstrair as chamadas externas. A ViewModel NUNCA deve chamar o Asaas diretamente; o backend (API Route / Server Action) fará a comunicação.
- A tabela `cobrancas` precisará de RLS rígido: o cliente só vê a sua, o advogado só vê as do seu `user_id`.
- O Webhook deve validar o token de autenticação/assinatura do Asaas para evitar ataques.
