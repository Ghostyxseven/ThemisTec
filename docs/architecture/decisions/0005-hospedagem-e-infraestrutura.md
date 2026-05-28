# 5. Hospedagem e Infraestrutura

Data: 2026-06-18

## Status
Aceito

## Contexto
A aplicação precisa estar acessível na internet de forma segura, performática e com baixo custo.

## Decisão
A infraestrutura será dividida da seguinte forma:
- **Vercel:** Utilizada para a hospedagem do sistema Next.js. Garante deploys rápidos e CI/CD integrado nativamente ao repositório.
- **Hostinger:** Gerenciamento do domínio (`themistec.site`).
- **Cloudflare:** CDN e firewall para proteção contra ataques DDoS, melhorando o cache e o carregamento para os usuários (advogados).

## Consequências
- Custos controlados e infraestrutura serverless altamente escalável.
- Processo de Deploy contínuo automatizado e sem downtime.
