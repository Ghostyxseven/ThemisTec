---
title: "[STORY] Cadastro de Prazos (US22)"
epic: "06"
assignee: "Equipe"
status: "done"
---

# US22: Cadastro de Prazos e Audiências

## 1. Descrição
Como advogado, 
Eu quero poder registrar um prazo judicial ou uma audiência e vinculá-lo a um processo existente,
Para que eu consiga centralizar e organizar minhas responsabilidades temporais no sistema.

## 2. Requisitos Funcionais
- O sistema deve permitir a criação de um "Prazo" contendo: Título (obrigatório), Descrição (opcional), Data e Hora de Vencimento (obrigatório) e Processo Vinculado (obrigatório).
- O sistema deve salvar este prazo em uma coleção `prazos` no banco de dados, associada ao `userId` do advogado.
- A interface de criação de prazo pode ser acessada pela tela de listagem de prazos (nova) ou diretamente dentro da visualização de um Processo específico.

## 3. Critérios de Aceite
- [x] O schema `PrazoSchema` (Zod) é criado e validado.
- [x] O repositório `IPrazoRepository` e sua implementação `FirestorePrazoAdapter` conseguem gravar um prazo no Firestore.
- [x] O formulário de criação contém validação de datas (não permitir data no passado para um prazo novo).
