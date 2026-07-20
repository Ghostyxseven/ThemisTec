# Implementation Spec 43: Geração de Petições (Templates Fixos)

## 1. Contexto
Implementar a funcionalidade da Story 43 usando `docxtemplater` para preencher documentos Word com dados do banco.

## 2. Arquivos Modificados/Criados

- **`src/lib/templates/docx-generator.ts` [NOVO]**: Função que recebe um `ArrayBuffer` de um `.docx` e um objeto de dados, e retorna o `ArrayBuffer` do arquivo processado.
- **`src/app/api/templates/generate/route.ts` [NOVO]**: Rota POST que recebe `{ templateId, processoId }`.
  - Busca as chaves no banco (`supabase.from('processos').select('..., clientes(...)')`).
  - Baixa o template do Supabase Storage.
  - Processa usando `docx-generator.ts`.
  - Retorna o arquivo (Blob) pro cliente baixar.

## 3. Dependências Adicionais
- Instalar `docxtemplater` e `pizzip` via npm.

## 4. Validação
- Verificar se tags não preenchidas não quebram o parser (configurar o docxtemplater para ignorar tags vazias).
