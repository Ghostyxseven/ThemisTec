# Development Guide

## Pré-requisitos
- Node.js >= 18
- NPM >= 9

## Instalação e Execução Local

```bash
# Instalar dependências
npm install

# Rodar em ambiente de desenvolvimento
npm run dev
```

## Configuração de Ambiente
O motor de autenticação (Micael - Epic 01) requer que as variáveis do Firebase estejam configuradas no `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=sua_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=seu_app_id
```

## Estrutura de Autenticação
A camada de autenticação foi construída em TypeScript modular:
- Modificações nas interfaces de contrato (ex: `IAuthService`) devem ser seguidas de atualizações na classe `FirebaseAuthAdapter`.
- O adaptador garante que a aplicação não fique acoplada ao Firebase, permitindo a substituição futura caso necessário.
