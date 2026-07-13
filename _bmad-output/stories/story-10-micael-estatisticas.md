---
title: "[STORY] Consultar Estatísticas Gerais (US10)"
epic: "04"
assignee: "Micael (Backend)"
status: "todo"
---

# US10: Consultar Estatísticas Gerais (Dashboard)

## 1. Descrição
Como advogado (usuário autenticado), 
Eu quero poder buscar rapidamente o número total de clientes e processos vinculados à minha conta, bem como quantos desses processos estão ativos,
Para que eu consiga ter uma visão geral do meu volume de trabalho na página inicial do painel.

## 2. Requisitos Funcionais
- O sistema deve expor métodos nos repositórios para retornar as seguintes métricas:
  1. Total de clientes do `userId`
  2. Total de processos do `userId`
  3. Total de processos ativos (Status = "ATIVO") do `userId`
- A solução deve ser performática (preferencialmente usando Server-side Aggregation do Firestore, como `getCountFromServer`, para não precisar baixar todos os documentos).

## 3. Critérios de Aceite
- [ ] `IClienteRepository` possui a assinatura `contarClientes(userId: string): Promise<number>`
- [ ] `IProcessoRepository` possui as assinaturas `contarProcessos(userId: string): Promise<number>` e `contarProcessosAtivos(userId: string): Promise<number>`
- [ ] As implementações `FirestoreClienteAdapter` e `FirestoreProcessoAdapter` usam `getCountFromServer` corretamente para retornar as agregações.
- [ ] Apenas documentos pertencentes ao `userId` são contabilizados na agregação.
