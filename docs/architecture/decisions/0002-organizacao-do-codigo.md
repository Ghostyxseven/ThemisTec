# 2. Organização do Código

Data: 2026-06-18

## Status
Aceito

## Contexto
O projeto utilizará **Next.js**. Precisamos definir como o código será estruturado para garantir escalabilidade, clareza na separação de responsabilidades e facilitar a adoção de boas práticas, especialmente visando a implementação de uma PWA com suporte offline.

## Decisão
A estrutura de pastas do projeto seguirá o padrão `src/`:
- `src/app/` ou `src/pages/`: Para as rotas e páginas da aplicação.
- `src/components/`: Componentes reutilizáveis de UI.
- `src/lib/`: Integrações com terceiros (ex: `firebase.js`).
- `src/hooks/` ou `src/viewmodels/`: Para separação de lógica de UI (padrão MVVM).
- `src/services/`: Chamadas ao banco de dados e APIs.

## Consequências
- Melhor modularidade e testes facilitados.
- Padronização no desenvolvimento para a equipe frontend e backend.
