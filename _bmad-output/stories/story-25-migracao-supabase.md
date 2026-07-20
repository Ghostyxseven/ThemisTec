# Story 25: Migração integral do Firebase para Supabase

**Status:** done
**Épico relacionado:** Modernização da infraestrutura

## Story

**Como** responsável técnico do ThemisTec,
**quero** concentrar autenticação, banco de dados e arquivos no Supabase,
**para que** o sistema opere com um único backend e preserve o isolamento MVVM.

## Critérios de aceitação

- [x] Substituir Firebase Auth por Supabase Auth.
- [x] Substituir os repositórios Firestore por adapters Supabase/PostgreSQL.
- [x] Substituir Firebase Storage por Supabase Storage em bucket privado.
- [x] Aplicar Row Level Security em todas as tabelas e no bucket.
- [x] Views e ViewModels não podem importar o SDK do Supabase diretamente.
- [x] Remover SDK, configuração e variáveis Firebase do projeto.
- [x] Preservar os contratos Zod e interfaces existentes sempre que possível.
- [x] `npm run typecheck`, `npm run lint`, `npm run test` e `npm run build` devem passar.
