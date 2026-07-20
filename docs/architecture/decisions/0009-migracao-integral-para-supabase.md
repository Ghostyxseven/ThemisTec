# 9. Migração integral para Supabase

Data: 2026-07-18

## Status

Aceito — substitui as decisões Firebase dos ADRs 0003, 0004 e 0006.

## Contexto

O sistema passou a usar Firebase e Supabase simultaneamente, aumentando acoplamento, configuração e risco operacional. O fluxo de documentos já dependia parcialmente do Supabase.

## Decisão

Adotar Supabase como backend único para autenticação, PostgreSQL e armazenamento privado de documentos. Manter Vercel, domínio e CDN conforme ADR-0005. Preservar MVVM e Adapter conforme ADRs 0007 e 0008.

## Consequências

- Um único provedor e uma única sessão para dados e arquivos.
- Segurança de registros implementada com PostgreSQL Row Level Security.
- Documentos jurídicos armazenados em bucket privado.
- É necessário executar a migration SQL e migrar usuários/dados existentes antes de desligar o projeto Firebase em produção.
