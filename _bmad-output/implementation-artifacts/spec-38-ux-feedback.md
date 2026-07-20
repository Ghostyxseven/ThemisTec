# Spec 38: Melhoria de UX (Toasts) (Implementation Artifact)

## 1. Escopo Técnico
A implementação da Story 38 será feita globalmente no `layout.tsx` e instanciada em views específicas para demonstrar a melhoria.

## 2. Arquivos a serem Criados/Modificados
- **[MODIFY]** `package.json`: Adição do `sonner`.
- **[MODIFY]** `src/app/layout.tsx`: Import e instânciação do `<Toaster position="top-right" richColors />`.
- **[MODIFY]** `src/features/gerador-documentos/viewmodel/useGerador.ts`: Importar `toast` de `sonner`, substituir `setError(msg)` por `toast.error(msg)` e adicionar `toast.success` onde couber.
- **[MODIFY]** `src/features/gerador-documentos/view/GeradorView.tsx`: Remover renderização condicional do bloco de erro de estado local.

## 3. Padrões de Código
- Manter chamadas de Toast no View ou ViewModel dependendo de onde o fluxo de dados encerra. Como o `useGerador` controla a geração, faremos a chamada lá para desacoplar a lógica da interface visual.
