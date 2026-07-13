# IMPLEMENTATION SPEC: Botão e Fluxo de Exportação (US15)

## 1. Arquivos Modificados

### 1.1 `src/shared/interfaces/IExportService.ts` e `src/services/export/ExportService.ts`
- **[MODIFICAR]**
- Como a Issue pede botão tanto em Cliente quanto Processo, mas a US14 focou em Processo, precisaremos adicionar:
  - `gerarCsvClientes(clientes: Cliente[]): string;` na Interface.
  - A implementação dessa função retornando um cabeçalho `"Nome;CPF;Telefone;E-mail\n"` seguido pelas linhas formatadas.

### 1.2 `src/app/clientes/useListClientes.ts`
- **[MODIFICAR]**
- Importar e instanciar `ExportService`.
- Adicionar o estado `isExporting` (boolean).
- Criar a função `exportarCsv`:
  - Utilizar o `ExportService.gerarCsvClientes(dados)`.
  - Criar um `Blob` com `type: 'text/csv;charset=utf-8;'`.
  - Criar uma tag `<a>`, configurar `href = URL.createObjectURL(blob)`, configurar `download = 'clientes.csv'`, clicar nela programaticamente e revogar o object URL.
- Retornar `exportarCsv` e `isExporting` no hook.

### 1.3 `src/app/clientes/page.tsx`
- **[MODIFICAR]**
- Receber `exportarCsv` e `isExporting` do hook.
- Renderizar um botão "Exportar CSV" ao lado do botão "+ Novo Cliente".

### 1.4 `src/app/processos/useListProcessos.ts`
- **[MODIFICAR]**
- Importar e instanciar `ExportService`.
- Adicionar o estado `isExporting` (boolean).
- Criar a função `exportarCsv`:
  - Utilizar o `ExportService.gerarCsvProcessos(dados)`.
  - Mesma lógica de criação do Blob e download programático (nome: `processos.csv`).
- Retornar `exportarCsv` e `isExporting`.

### 1.5 `src/app/processos/page.tsx`
- **[MODIFICAR]**
- Renderizar um botão "Exportar CSV" ao lado de "+ Novo Processo".

## 2. Validação
- Clicar no botão e verificar se o arquivo CSV é baixado.
- Validar integridade do TypeScript (`npm run typecheck`).
