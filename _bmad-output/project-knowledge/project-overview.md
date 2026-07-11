# Project Overview: ThemisTec

## Executive Summary
ThemisTec é uma aplicação web voltada para a gestão jurídica para advogados autônomos.
Este documento reflete a estrutura atual da aplicação, com foco especial no motor de autenticação (Epic 01).

## Tech Stack Summary

| Categoria      | Tecnologia      | Versão | Justificativa |
|----------------|-----------------|--------|---------------|
| Framework      | Next.js         | 15.x   | App Router, SSR, Performance |
| Linguagem      | TypeScript      | 5.x    | Tipagem estática, segurança |
| Estilização    | Tailwind CSS    | 3.x    | Utility-first, produtividade |
| Autenticação   | Firebase Auth   | 11.x   | Autenticação como serviço |
| Formulários    | Zod             | 3.x    | Validação de esquemas |
| Linting/Code   | ESLint, Prettier| -      | Padronização de código |

## Repository Structure
- **Tipo:** Monolith
- **Arquitetura Base:** MVVM (Model-View-ViewModel)

## Links Rápidos
- [Arquitetura](./architecture.md)
- [Árvore de Código](./source-tree-analysis.md)
- [Guia de Desenvolvimento](./development-guide.md)
