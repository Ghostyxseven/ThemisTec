# IMPLEMENTATION SPEC: Configuração do Service Worker e Cache (US16)

## 1. Arquivos Modificados/Criados

### 1.1 `next.config.mjs`
- **[NOVO]**
- Criar o arquivo e integrar o wrapper `withPWA` fornecido pela biblioteca `@ducanh2912/next-pwa`.
- Configurar para não gerar PWA durante o modo de desenvolvimento (`disable: process.env.NODE_ENV === 'development'`).

### 1.2 `public/manifest.json`
- **[NOVO]**
- Criar o arquivo de Web App Manifest especificando o nome da aplicação ("ThemisTec"), as cores de tema (e.g. `#1a3c5e`), modo de display (`standalone`), e configurar um ícone padrão (usaremos svg ou placeholders padrão).

### 1.3 `src/app/layout.tsx`
- **[MODIFICAR]**
- Adicionar no objeto de `Metadata` do Next.js as propriedades de `manifest: "/manifest.json"` e tema.
- Inserir a tag `<meta name="theme-color" content="#1a3c5e" />` no head.

### 1.4 `package.json`
- **[MODIFICAR]** (via CLI)
- Executar a instalação da dependência: `npm i @ducanh2912/next-pwa`.

## 2. Validação
- Executar `npm run build` e verificar se o `sw.js` e o `workbox-*.js` são gerados na pasta `public/` ou na saída.
- Subir a aplicação em dev ou prod, abrir as DevTools > Application > Service Workers e validar que o script foi ativado.
- Realizar teste offline: marcar a network como "Offline" nas DevTools e atualizar a página (o esqueleto App Shell deve carregar).
