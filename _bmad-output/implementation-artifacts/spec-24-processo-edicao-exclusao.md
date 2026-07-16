---
tipo: "Spec"
épico: "EP03"
história: "STORY-24"
título: "Implementação da Edição e Exclusão de Processos"
status: "DONE"
---

# 1. Resumo da Implementação
Este artefato detalha a implementação das funcionalidades de edição e exclusão de processos para complementar a listagem e cadastro. 

# 2. Arquitetura e Padrões (MVVM)
- **Model:** `Processo` e `UpdateProcessoSchema` (Zod).
- **View:** `src/app/(authenticated)/processos/editar/[id]/page.tsx` (Formulário) e modal na tabela em `processos/page.tsx`.
- **ViewModel:** `useEditProcesso.ts` (Formulário) e métodos na listagem para exclusão.
- **Repository:** Adição de `excluir` em `IProcessoRepository` e no Adapter do Firestore.

# 3. Limites de Alteração (Harness)
Apenas as seguintes áreas podem ser modificadas/criadas:
- `src/shared/interfaces/IProcessoRepository.ts`
- `src/services/firebase/FirestoreProcessoAdapter.ts`
- `src/app/(authenticated)/processos/page.tsx`
- `src/app/(authenticated)/processos/editar/[id]/page.tsx`
- `src/app/(authenticated)/processos/editar/[id]/useEditProcesso.ts`

# 4. Detalhamento Técnico

## 4.1. Camada de Serviço
O `IProcessoRepository` receberá:
```typescript
excluir(id: string, userId: string): Promise<void>;
```
O `FirestoreProcessoAdapter` implementará a exclusão deletando o documento no Firestore se o `userId` coincidir com o autor, via `deleteDoc(docRef)`.

## 4.2. ViewModel (`useEditProcesso.ts`)
- Utilizará `useForm({ resolver: zodResolver(UpdateProcessoSchema) })`.
- Terá um método `carregarProcesso` invocado ao montar, que preenche o form com `reset(processo)`.
- Terá `salvarProcesso(dados)` que chama `processoRepository.atualizar(...)`.

## 4.3. View de Edição (`editar/[id]/page.tsx`)
- Formulário idêntico ao de cadastro, mas com o título "Editar Processo".
- Campos preenchidos via `defaultValues` ou `reset` no React Hook Form.

## 4.4. Listagem (`processos/page.tsx`)
- A coluna "Ações" deve conter os ícones "Anexos", "Editar" (Pencil) e "Excluir" (Trash).
- O clique em "Excluir" chamará um modal padrão pedindo confirmação. Após confirmar, chamará `processoRepository.excluir` e fará reload na lista.
