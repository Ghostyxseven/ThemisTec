---
title: "[STORY] Construir Interface do Dashboard (US11)"
epic: "04"
assignee: "Josiane (Frontend)"
status: "done"
---

# US11: Construir Interface do Dashboard

## 1. Descrição
Como advogado (usuário autenticado), 
Eu quero poder visualizar uma página de dashboard ao fazer login, que me mostre o número total de clientes, processos e processos ativos,
Para que eu tenha uma visão geral do meu volume de trabalho rapidamente.

## 2. Requisitos Funcionais
- O sistema deve possuir a rota `/dashboard` protegida por autenticação.
- O sistema deve carregar e exibir as seguintes estatísticas:
  1. Total de clientes vinculados ao usuário logado.
  2. Total de processos vinculados ao usuário logado.
  3. Total de processos com status "ATIVO" vinculados ao usuário logado.
- Os dados devem ser providenciados pelos repositórios já criados (`IClienteRepository` e `IProcessoRepository`).
- A rota raiz `/` deve redirecionar para `/dashboard` se o usuário estiver autenticado (ou `/login` se não estiver).

## 3. Critérios de Aceite
- [x] A página `/dashboard` renderiza corretamente e de forma responsiva.
- [x] O ViewModel `useDashboard` é responsável por orquestrar a busca dos dados.
- [x] Caso haja erro ao buscar os dados, a interface exibe uma mensagem amigável.
- [x] Durante a busca (loading), são exibidos skeleton loaders ou indicadores visuais de carregamento.
