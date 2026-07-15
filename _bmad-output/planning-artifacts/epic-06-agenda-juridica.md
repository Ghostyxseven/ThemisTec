---
epic: "06"
title: "Módulo de Agenda Jurídica e Rastreamento de Prazos"
status: "todo"
---

# Épico 06: Agenda Jurídica e Rastreamento de Prazos

## 1. Descrição
Como advogado autônomo,
Eu quero ter uma agenda e um rastreador de prazos integrados aos meus processos,
Para que eu nunca perca uma audiência ou o fim de um prazo judicial importante, evitando prejuízos para meus clientes e para meu escritório.

## 2. Motivação e Valor
Advogados lidam com um volume altíssimo de datas críticas (audiências, prazos para contestação, recursos, etc.). Perder um prazo é uma falha grave (e muitas vezes fatal) na advocacia. Ter um módulo de Agenda atrelado diretamente à base de processos reduz a necessidade de depender de calendários externos (como Google Calendar) que ficam descolados do contexto do processo.

## 3. Escopo e User Stories (Fase 2)
- **US22**: Cadastro de Prazos (Vincular data, título e descrição a um processo).
- **US23**: Consulta de Prazos (Painel de calendário ou lista ordenada por proximidade).

## 4. Estratégia de Implementação (Arquitetura)
Será criada uma nova coleção `prazos` no Firestore, ao invés de aninhar prazos dentro do array do processo.
Motivo: Facilita consultas globais (ex: "Me dê todos os prazos do usuário X nos próximos 7 dias, independente de qual processo seja").

### Modelo de Dados Sugerido (Prazo)
- `id`: string
- `processoId`: string
- `processoNumero`: string (desnormalizado para UI rápida)
- `titulo`: string
- `descricao`: string (opcional)
- `dataVencimento`: string (ISO)
- `status`: "PENDENTE" | "CONCLUIDO"
- `userId`: string
- `criadoEm`: string
- `atualizadoEm`: string
