# 3. Stack Tecnológica do MVP

Data: 2026-06-18

## Status
Substituído pelo ADR-0009

## Contexto
Para entregar o MVP dentro do cronograma (calendário acadêmico), precisamos de tecnologias que promovam desenvolvimento ágil, segurança, e estabilidade sem a necessidade de gerenciar infraestrutura complexa ou servidores locais robustos.

## Decisão
Foi definido no Relatório de Viabilidade de Software o uso da seguinte Stack:
- **Next.js:** Framework React para o Frontend (e lógicas básicas de backend). Permite interfaces rápidas e suporte a PWA.
- **Firebase:** Plataforma Serverless para banco de dados e autenticação.
- **Vercel, Hostinger e Cloudflare:** Soluções de infraestrutura em nuvem.

## Consequências
- **Positivo:** Baixo custo inicial (pay-as-you-go), alta velocidade de entrega e estabilidade.
- **Negativo/Risco:** Lock-in com provedores (como Firebase). O risco de ultrapassar cotas gratuitas existe, mas será mitigado com os créditos do Google Cloud disponíveis.
