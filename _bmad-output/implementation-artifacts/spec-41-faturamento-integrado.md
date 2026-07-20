# Especificação Técnica: Story 41 - Faturamento Integrado (Pix/Boleto)

Esta especificação define os limites (Harness) e o plano de ação arquitetural para a integração do sistema de faturamento.

## 1. Banco de Dados (Supabase/PostgreSQL)

**Nova Tabela:** `cobrancas`
- `id`: uuid (PK)
- `processo_id`: uuid (FK -> processos.id)
- `cliente_id`: uuid (FK -> clientes.id)
- `user_id`: uuid (FK -> auth.users.id) // Advogado que gerou
- `gateway_id`: text (ID da cobrança retornado pelo Asaas)
- `valor`: numeric
- `vencimento`: date
- `status`: text (PENDENTE, PAGA, VENCIDA, CANCELADA)
- `link_pagamento`: text (URL do boleto/checkout)
- `payload_gateway`: jsonb (Dados adicionais úteis como linha digitável ou qrcode)
- `criado_em`: timestamptz
- `atualizado_em`: timestamptz

**RLS (Row Level Security):**
- Advogados: SELECT, INSERT, UPDATE, DELETE onde `user_id = auth.uid()`.
- Clientes (Portal): SELECT onde `cliente_id = get_portal_cliente_id()` (via middleware/função).

## 2. Model & Adapters (Camada de Dados)

**Arquivos:**
- `src/features/cobrancas/model/IPaymentGateway.ts` (Interface)
- `src/features/cobrancas/model/AsaasGatewayAdapter.ts` (Implementação do gateway via fetch)
- `src/features/cobrancas/model/SupabaseCobrancaAdapter.ts` (Acesso ao banco local)

**Zod Schemas:**
- `src/specs/schemas/cobranca.schema.ts` (Validação de criação e dados).

## 3. Rotas de API (Backend/Server)

**Arquivos:**
- `src/app/api/cobrancas/route.ts`: Endpoint POST que recebe a requisição do advogado, cria a cobrança no Asaas (`AsaasGatewayAdapter.criarCobranca()`) e salva no Supabase.
- `src/app/api/webhooks/asaas/route.ts`: Endpoint POST que o Asaas chamará quando o pagamento for efetuado. Este webhook deverá verificar o status e acionar o `SupabaseCobrancaAdapter.atualizarStatus(id, 'PAGA')`.

## 4. ViewModels (Hooks do React)

**Arquivos:**
- `src/features/cobrancas/viewmodel/useCreateCobranca.ts`: Gerencia o form do advogado, bate na rota `/api/cobrancas`.
- `src/features/cobrancas/viewmodel/useListCobrancas.ts`: Usado pelo Portal do Cliente para listar o que ele tem que pagar.

## 5. Views (UI)

**Arquivos:**
- **Advogado:** Adição de modal/seção em `src/features/processos/view/ProcessosEditView.tsx` (ou componente filho) contendo um botão "Nova Cobrança".
- **Cliente:** Adição de aba ou seção em `src/app/portal/dashboard/page.tsx` exibindo as faturas (`cobrancas`) pendentes e o botão para copiar chave Pix ou abrir Boleto.

## 6. Procedimento de Desenvolvimento
1. Criar e aplicar migration da tabela `cobrancas`.
2. Implementar schemas.
3. Criar a interface `IPaymentGateway` e o adapter `AsaasGatewayAdapter` mockado ou com chave de sandbox.
4. Implementar rotas da API (Criação e Webhook).
5. Criar UI para advogado (gerar).
6. Criar UI para cliente (visualizar/pagar).
7. Testar fluxo ponta a ponta (Typecheck e manual via Sandbox).
