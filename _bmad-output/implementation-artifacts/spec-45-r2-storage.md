# Especificação Técnica: Armazenamento Seguro e Isolado com Cloudflare R2

## Arquivos Afetados
- `src/services/storage/IStorageService.ts` [NOVO]
- `src/services/storage/CloudflareR2Adapter.ts` [NOVO]
- `src/app/actions/storageActions.ts` [NOVO]

## Detalhamento
### 1. `IStorageService.ts`
Define o contrato de serviço com os métodos `getUploadUrl`, `getDownloadUrl` e `deleteFile`.

### 2. `CloudflareR2Adapter.ts`
Implementa `IStorageService` usando `@aws-sdk/client-s3` e `@aws-sdk/s3-request-presigner`. Ele pegará credenciais do `process.env`.

### 3. `storageActions.ts`
Server Actions que o frontend vai chamar. Fará a checagem da sessão e montará a chave do arquivo do S3 baseada no ID do usuário da sessão, antes de pedir a URL para o adapter.
