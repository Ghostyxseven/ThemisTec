# 7. Adoção do Padrão MVVM (Model-View-ViewModel)

Data: 2026-06-18

## Status
Aceito

## Contexto
O desenvolvimento Frontend em Next.js e React pode rapidamente gerar componentes complexos se a lógica de negócios e as regras de renderização ficarem no mesmo arquivo. Para manter o projeto organizado e fácil de dar manutenção pela equipe, precisamos definir um padrão de arquitetura no front-end.

## Decisão
A equipe adotará a arquitetura inspirada no **MVVM (Model-View-ViewModel)**. No contexto do React/Next.js:
- **Model:** Interação com o Firebase (Firestore, Auth), regras de dados.
- **View:** Componentes React (`.tsx`) que lidam apenas com apresentação (UI).
- **ViewModel:** Custom Hooks (`useLogin`, `useClientes`) que agem como intermediários, mantendo o estado e a lógica de negócios fora da View.

## Consequências
- Views ficam mais limpas e focadas puramente na UI (o que ajuda muito no design visual premium exigido).
- ViewModels podem ser testadas independentemente da renderização.
- Separação de responsabilidades melhora o trabalho em equipe entre Dev Front-end e Dev Back-end.
