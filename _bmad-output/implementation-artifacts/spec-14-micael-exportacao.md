# Spec de Implementação: US14 - Serviço de Exportação CSV

## 1. O que Fazer
Implementar o serviço genérico `ExportService` no frontend (arquitetura Firebase Client) para agrupar as informações de `Processos` retornadas pelos Repositórios e formatá-las como CSV para posterior download pela interface do usuário.

## 2. Onde Fazer
1. Criar novo arquivo: `src/services/export/ExportService.ts`
2. Criar novo arquivo de interface (opcional, mas recomendado pela arquitetura): `src/shared/interfaces/IExportService.ts`
3. Criar os testes unitários: `src/tests/services/ExportService.test.ts`

## 3. Como Fazer (Passo a Passo)

### Passo 1: Interface `IExportService.ts`
- Definir o contrato:
  ```typescript
  import { Processo } from "@/specs/schemas/processo.schema";
  export interface IExportService {
    gerarCsvProcessos(processos: Processo[]): string;
  }
  ```

### Passo 2: Implementação `ExportService.ts`
- Importar a interface e os modelos.
- O CSV deve incluir as seguintes colunas (no mínimo):
  - Número do Processo
  - Tipo
  - Status
  - Cliente (Nome)
  - Data de Abertura
  - Honorários (R$)
  - Status do Pagamento
- Montar o cabeçalho: `"Número;Tipo;Status;Cliente;Data Abertura;Honorários;Status Pagamento"` (Usar `;` para compatibilidade com Excel em PT-BR).
- Fazer um `map` na lista de processos e gerar as linhas.
- Retornar a `string` final em formato CSV.

### Passo 3: Testes
- Instanciar a classe e passar um array de `Processo` mockado.
- Validar se a string gerada contém os cabeçalhos corretos.
- Validar se os valores são formatados corretamente (especialmente honorários).

## 4. O que NÂO Fazer
- Não modificar telas ou botões nesta US. Isso será feito na US15.
- Não implementar lógica de download do Blob na classe `ExportService`, pois o download deve ocorrer no componente de UI para contornar bloqueios de pop-up e ter acesso direto à window. O Serviço deve retornar a string CSV.
