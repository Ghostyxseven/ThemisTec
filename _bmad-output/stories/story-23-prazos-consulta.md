---
title: "[STORY] Consulta de Prazos (US23)"
epic: "06"
assignee: "Equipe"
status: "done"
---

# US23: Consulta de Prazos (Lista/Agenda)

## 1. Descrição
Como advogado, 
Eu quero visualizar todos os meus prazos pendentes ordenados por proximidade da data de vencimento em uma página dedicada,
Para que eu saiba exatamente o que preciso fazer hoje, amanhã ou na próxima semana.

## 2. Requisitos Funcionais
- O sistema deve possuir uma nova página principal `/prazos` acessível pelo menu lateral (Sidebar).
- Esta página deve buscar na coleção `prazos` apenas os prazos atrelados ao `userId` autenticado.
- A lista de prazos deve ser ordenada por `dataVencimento` crescente (mais próximos primeiro).
- Prazos atrasados (data de vencimento < hoje) devem ter um indicativo visual de emergência (vermelho).
- Deve ser possível marcar um prazo como "CONCLUÍDO" diretamente nesta tela (atualizando o status no banco).

## 3. Critérios de Aceite
- [x] O componente `Sidebar` (Layout) ganha um novo link "Agenda / Prazos".
- [x] A página `/prazos` lista os dados corretamente.
- [x] Indicadores visuais mostram urgência baseada na data atual.
- [x] O repositório possui método para alterar status de um prazo.
- [x] A UI permite concluir um prazo com um clique/confirmação.
