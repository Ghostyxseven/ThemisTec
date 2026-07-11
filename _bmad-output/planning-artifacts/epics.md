---
title: ThemisTec Epics and Requirements
status: requirements_extracted
inputDocuments: 
  - docs/PRD.md
stepsCompleted:
  - step-01-validate-prerequisites
---

# ThemisTec Epics and Stories

## 1. Functional Requirements (FRs)

FR1: Login com e-mail e senha (Firebase Auth)
FR2: Cadastro de conta com confirmação por e-mail
FR3: Recuperação de senha via link por e-mail

## 2. Non-Functional Requirements (NFRs)

NFR1: Segurança - Dados acessíveis apenas por usuários autenticados (JWT)
NFR2: Proteção de Dados - Conformidade com LGPD (coleta mínima, sem compartilhamento)
NFR3: Responsividade - Funcional em desktop e mobile

## 3. Additional Technical Requirements

- Padrão Arquitetural: MVVM (Model-View-ViewModel) com Monolito Modular
- Padrão de Projeto: Adapter (isolamento dos SDKs do Firebase)
- Validação Estrita: Uso de Zod schema (auth.schema.ts)

## 4. Requirements Coverage Map

| Requirement | Epic/Story |
|-------------|------------|
| FR1 | Epic 1 / Story 1.1, Story 1.3 |
| FR2 | Epic 1 / Story 1.1 |
| FR3 | Epic 1 / Story 1.1 |
| NFR1 | Epic 1 / Story 1.1, Story 1.3 |
| NFR3 | Epic 1 / Story 1.2 |

## 5. Epics List

### Epic 1: Autenticação

**Story 1.1: Motor de Autenticação com Firebase (Backend/Model)**
- *FRs*: FR1, FR2, FR3
- *NFRs*: NFR1
- *Responsável*: Micael

**Story 1.2: Setup Inicial do Front-end e Roteamento Base**
- *NFRs*: NFR3
- *Responsável*: Josiane

**Story 1.3: Implementação Visual da Tela de Login (Front-end)**
- *FRs*: FR1
- *Responsável*: Josiane
