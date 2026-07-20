# Story 09: Anexar PDF ao Processo (US09)

**Responsável:** Josiane  
**Status:** done
**Épico Relacionado:** Épico 03 - Gestão de Processos  

## 1. Contexto e Objetivo
Como advogado, quero anexar um PDF ao processo para guardar documentos importantes vinculados a cada ação.

## 2. Contratos Rigorosos (Spec-Driven Development)
- **Schema de Validação:** Utilizar os limites definidos em `src/specs/schemas/processo.schema.ts` (`UploadDocumentoSchema`, `TAMANHO_MAXIMO_ARQUIVO = 25MB`, `TIPOS_ACEITOS = ["application/pdf"]`).
- **ViewModel:** A View deve consumir apenas a ViewModel correspondente (ex: `useDocumentosProcesso`) para realizar o upload e listagem dos anexos.
- **Armazenamento (Firebase Storage):** Os arquivos PDF devem ser enviados ao Firebase Storage sob a pasta `processos/{processoId}/{uuid}.pdf`.
- **Banco de Dados (Firestore):** A URL de download gerada e os metadados do arquivo devem ser salvos no array `documentos` do documento do processo no Firestore.

## 3. Requisitos Técnicos e Visuais
1. **Página de Documentos do Processo (`/processos/documentos/[id]`):**
   * Cabeçalho exibindo informações resumidas do processo (Número do Processo e Cliente).
   * Lista de documentos já anexados com: nome do arquivo, tamanho (formatado em KB/MB), data de envio, descrição (se houver) e um botão para abrir/baixar o arquivo em nova aba.
   * Formulário ou área de drop/seleção para anexar novo arquivo PDF.
   * Campo de texto opcional para Descrição do documento (máx. 200 caracteres, validado por `UploadDocumentoSchema`).
2. **Validações de Arquivo:**
   * Apenas arquivos PDF são aceitos.
   * Tamanho máximo do arquivo: 25MB.
   * Validação tanto no cliente (antes de enviar) quanto na interface do Adapter.
3. **Feedback visual:**
   * Indicador de progresso/carregamento durante o upload.
   * Mensagens de erro em caso de falha de upload ou violação de regras de tamanho/tipo.
   * Atualização instantânea da lista de documentos ao concluir um upload com sucesso.

## 4. Harness Engineering (Regras de Entrega)
- [ ] O código não pode acusar erros no TypeScript (`npm run typecheck`).
- [ ] O código não pode acusar avisos no Linter (`npm run lint`).
- [ ] Criar a Spec correspondente e obter aprovação antes de programar.
