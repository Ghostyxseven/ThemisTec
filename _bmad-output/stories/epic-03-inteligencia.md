# Épico 03: Automação Determinística e Serviços ao Cliente

**Status:** todo

## Objetivo

Fornecer ferramentas clássicas e robustas (sem dependência de IA) para automatizar o relacionamento com o cliente, cobranças e elaboração de peças padrão, aumentando a produtividade e a percepção de valor do escritório.

## Ordem de entrega (Stories propostas)

1. **Story 40 — Portal do Cliente**: Área *white-label* restrita (login por CPF e data de nascimento) para o cliente visualizar o andamento do próprio processo e documentos públicos.
2. **Story 41 — Faturamento Integrado (Pix/Boleto)**: Integração com gateway (Mercado Pago/Asaas) para geração de cobranças atreladas ao processo, com baixa automática de honorários.
3. **Story 42 — WhatsApp Transacional**: Disparo de lembretes automáticos de audiência ou vencimento de honorários via API de WhatsApp (ex: Z-API, Twilio), baseado em templates aprovados.
4. **Story 43 — Geração de Petições (Templates Fixos)**: Módulo onde o advogado faz upload de modelos `.docx` (com tags como `{{NOME_CLIENTE}}`) e o sistema gera o PDF final com os dados do banco, garantindo 100% de controle sobre o texto.
5. **Story 44 — Webhooks de Tribunais**: Recebimento passivo de atualizações processuais via API (ex: Escavador) para popular a linha do tempo do processo.

## Dependências

- Portal do cliente exige um sistema de permissões na tabela de documentos (quais arquivos o cliente pode ver).
- Faturamento exige criação de tabelas de cobrança e histórico transacional, ligadas aos pagamentos do Épico 02.

## Restrições

- Zero uso de LLMs ou processos não-determinísticos (alucinações).
- Disparos de WhatsApp não podem ser usados para spam, apenas envios transacionais estritos para não ter o número bloqueado.
