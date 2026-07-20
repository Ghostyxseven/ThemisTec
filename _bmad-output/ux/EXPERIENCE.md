---
status: final
---
# ThemisTec: Experience & Behavior Specification

## Foundation
The application targets web and responsive mobile platforms, catering to lawyers (heavy users) and clients (casual users). The visual identity is mapped in `DESIGN.md`. All behaviors specified here must leverage the aesthetic tokens outlined there (e.g., `{colors.accent}` for focus rings). 

## Information Architecture
- **Sidebar Navigation (Advogado):** A collapsible, slim left sidebar housing Dashboard, Clientes, Processos, Faturamento e Configurações.
- **Top Navigation (Cliente):** A minimalist top navbar for the Portal do Cliente, emphasizing content and a clean layout.
- **Card-Based Content:** Dense information (like process details and timelines) is encapsulated in rounded cards to group context logically.

## Voice and Tone
- **Professional, yet approachable:** The system should guide the user securely. 
- **Error states:** Do not blame the user. Say "Não foi possível conectar" em vez de "Você errou a senha".

## Component Patterns
- **Inputs & Forms:** Labels sit above fields. On focus, the input should animate smoothly to display a violet ring. Validation messages appear underneath with a gentle slide-down animation.
- **Data Tables:** Hovering over a row subtly dims other rows or highlights the focused row. Actions (Editar/Deletar) appear via a dropdown (kebab menu) to keep the UI clean.
- **Modals:** Entrance uses a scale-up + fade-in micro-animation. The background blurs (`backdrop-blur-sm`).

## State Patterns
- **Empty States:** Every list or table without data must display an illustration/icon with a clear CTA (e.g., "Nenhum cliente cadastrado. [Novo Cliente]").
- **Loading States:** Avoid full-screen spinners. Use skeleton loaders for data blocks to minimize layout shifts (CLS).
- **Success States:** Toast notifications in the bottom-right corner.

## Interaction Primitives
- **Hover:** All interactive elements must react to hover. Buttons should lift (`translate-y-[-2px]`) and slightly increase brightness.
- **Click/Tap:** Buttons must provide active state feedback (`scale-95`).
- **Focus:** Complete keyboard accessibility. Focus rings must be highly visible (`ring-2 ring-violet-500 offset-2`).

## Key Flows
- **Visualização de Processo (Advogado):** Ao clicar num processo, o layout desliza ou expande, mostrando o cabeçalho no topo (com breadcrumbs), as faturas na lateral e o timeline de andamentos ocupando o eixo central. 
- **Portal do Cliente:** O fluxo de login usa uma animação fluida para revelar o dashboard após a validação. A tabela de processos e faturas usa o "glassmorphism" para dar uma sensação moderna e segura.
