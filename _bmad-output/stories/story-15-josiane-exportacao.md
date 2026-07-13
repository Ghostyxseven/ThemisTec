# [STORY] Botão e Fluxo de Exportação (US15)

**Issue:** #36
**Responsável:** Josiane (Frontend)
**Épico:** 06 (Geração de Relatórios)

## Descrição
Como advogado autônomo, quero poder exportar a listagem de clientes e processos exibida na tela em formato CSV, para que eu possa gerar relatórios gerenciais e acompanhamentos no Excel.

## Critérios de Aceite
1. O cabeçalho da página de Clientes (`/clientes`) deve conter um botão "Exportar CSV".
2. O cabeçalho da página de Processos (`/processos`) deve conter um botão "Exportar CSV".
3. Clicar no botão deve acionar o `ExportService` (US14) para gerar a string do CSV correspondente à lista.
4. O componente deve forçar o download automático do arquivo `.csv` pelo navegador.
5. Em caso de erro, um feedback (toast ou errorMessage) deve ser apresentado.
