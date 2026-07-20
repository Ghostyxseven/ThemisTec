# Spec 35: Central de documentos

**Story:** `story-35-central-documentos.md`
**Status:** active

## Harness

- `supabase/migrations/*documentos*.sql`
- `src/specs/schemas/documento.schema.ts`
- `src/shared/interfaces/IDocumentoRepository.ts`
- `src/features/documentos-central/**`
- `src/app/(authenticated)/documentos/**`
- `src/services/index.ts`
- `src/tests/**/documento*.test.ts`

## Implementação

- Criar catálogo de documentos com pasta lógica, tags, versão, estado de lixeira e retenção.
- Reutilizar `SupabaseStorageAdapter` para objetos privados e URLs assinadas.
- Oferecer busca, download, lixeira, restauração e exclusão definitiva.
