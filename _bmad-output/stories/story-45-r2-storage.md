# Story: Armazenamento Seguro no R2 com Multi-tenancy

## Contexto
O ThemisTec necessita armazenar PDFs e documentos dos advogados. Para evitar custos altos e vendor lock-in e usar a infraestrutura do Cloudflare (R2), precisamos implementar o sistema de storage. Como é um sistema multi-tenant, é essencial que os arquivos sejam estritamente isolados por advogado, sem vazamento de dados.

## Requisitos
- Utilizar o Cloudflare R2 via API compatível com S3 (AWS SDK).
- Gerar URLs Pré-Assinadas (Presigned URLs) no backend (Next.js Server Actions) para upload e download.
- Validar a sessão do usuário no backend antes de assinar a URL.
- Utilizar prefixos nas chaves do R2 (ex: `user-id/client-id/...`) para que a estrutura garanta que o arquivo pertença ao usuário logado.

## Critérios de Aceite
- [ ] O `IStorageService` deve ser criado conforme a arquitetura.
- [ ] O `CloudflareR2Adapter` deve implementar a interface corretamente.
- [ ] O Server Action `storageActions.ts` deve validar a sessão do `authService`.
- [ ] O upload deve ocorrer com chaves padronizadas (UUID do advogado como pasta raiz).
