# Spec 37: Gerador Automático de Petições (Implementation Artifact)

## 1. Escopo Técnico
A implementação da Story 37 será feita de forma modular em `src/features/gerador-documentos`, obedecendo rigorosamente à separação MVVM.

## 2. Arquivos a serem Criados/Modificados
- **[NEW]** `supabase/migrations/20260719_create_templates_table.sql`: Tabela de templates.
- **[MODIFY]** `package.json`: Adição do `docxtemplater`, `pizzip` e `file-saver`.
- **[NEW]** `src/features/gerador-documentos/model/SupabaseTemplateAdapter.ts`: Adapter para persistência.
- **[NEW]** `src/features/gerador-documentos/viewmodel/useGerador.ts`: Hook ViewModel.
- **[NEW]** `src/features/gerador-documentos/view/GeradorView.tsx`: Interface React principal.
- **[NEW]** `src/app/(authenticated)/gerador/page.tsx`: Rota da página de geração.
- **[MODIFY]** `src/components/layout/Sidebar.tsx`: Link na sidebar de navegação.

## 3. Padrões de Código
- O ViewModel (`useGerador.ts`) é o único ponto de contato entre a `GeradorView` e o `SupabaseTemplateAdapter`.
- Validações de entrada com Zod.
- Componentes do UI devem utilizar Tailwind CSS para manter a coesão de estilo do ThemisTec.
