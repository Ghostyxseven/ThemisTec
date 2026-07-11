# Project Architecture

## Executive Summary
O sistema utiliza **Next.js (App Router)** no front-end e **Firebase Auth** no back-end.
A arquitetura fundamental é o **MVVM (Model-View-ViewModel)** com forte uso de **Inversão de Dependência**.

## Padrão Arquitetural: MVVM (ADR-0007)

### 1. Model (Camada de Serviço)
Representado pelas classes de integração com serviços externos.
- **Motor Construído:** `FirebaseAuthAdapter.ts` e `firebase.config.ts`
- **Objetivo:** Ocultar a complexidade do SDK modular do Firebase (`signInWithEmailAndPassword`, `createUserWithEmailAndPassword`).
- **Interfaces:** O modelo expõe contratos rigorosos (`IAuthService`) que garantem que as outras camadas não conheçam detalhes da biblioteca do Firebase.

### 2. ViewModel (Hooks Customizados)
Representado por arquivos como `useLogin.ts` e `useRegister.ts`.
- **Objetivo:** Orquestrar a ponte entre a View e o Model.
- **Função:** Capturar as tentativas de ação da View, processar validações iniciais (Zod) e acionar a classe do adaptador do Model (`authService.login()`).
- **Estado:** Mantém os estados lógicos (`isLoading`, `errorMessage`) sem tocar em UI.

### 3. View (Componentes React)
Representado pelas rotas Next.js (`page.tsx`).
- **Objetivo:** Exibir formulários e feedback visual.
- **Isolamento:** Nenhuma View importa bibliotecas do Firebase nem faz regras de negócio. Elas apenas consomem propriedades reativas e chamam funções injetadas pelo ViewModel.

## Diagrama de Integração

```mermaid
flowchart TD
    A[View (page.tsx)] -->|Aciona| B[ViewModel (useLogin.ts)]
    B -->|Valida Dados| C[Zod Schema]
    C -->|Dados Válidos| B
    B -->|Usa Interface| D(IAuthService)
    D -->|Implementado por| E[FirebaseAuthAdapter]
    E -->|Chama SDK| F[(Firebase)]
```
