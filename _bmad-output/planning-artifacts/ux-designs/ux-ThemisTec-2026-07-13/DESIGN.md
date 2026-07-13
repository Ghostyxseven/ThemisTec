---
status: final
updated: 2026-07-13
colors:
  primary:
    base: "#1a3c5e"
    dark: "#0f2540"
  accent:
    gold: "#c9a84c"
  neutral:
    background: "#f9fafb"
    surface: "#ffffff"
    text-main: "#111827"
    text-muted: "#6b7280"
    border: "#e5e7eb"
  semantic:
    success: "#16a34a"
    error: "#dc2626"
    warning: "#ca8a04"
    info: "#2563eb"
typography:
  family:
    main: "Inter, system-ui, sans-serif"
rounded:
  sm: "0.125rem"
  md: "0.375rem"
  lg: "0.5rem"
  xl: "0.75rem"
  full: "9999px"
spacing:
  container: "2rem"
  component: "1rem"
---

# Brand & Style

A identidade visual do ThemisTec transmite seriedade, confiança, estabilidade e sofisticação, atributos essenciais para o mercado jurídico (advogados autônomos e pequenos escritórios).

# Colors

A paleta de cores foca em um azul corporativo profundo, complementado por toques de dourado (que remete à balança da justiça e status premium).
O restante da aplicação mantém fundos neutros (`gray-50`) e superfícies limpas (`white`) para reduzir a fadiga visual durante leitura de longos processos.

# Typography

Utilizamos a fonte **Inter** pela sua altíssima legibilidade em telas e interfaces ricas em dados, garantindo que textos longos de processos e clientes sejam lidos confortavelmente.

# Layout & Spacing

O layout segue um padrão clássico de Dashboard:
- **Sidebar (Esquerda):** Fixa, de largura 288px (`w-72`), com navegação primária.
- **Header (Topo):** Fixo, altura 64px (`h-16`), para busca, notificações e ações de perfil.
- **Área de Conteúdo (Main):** Fluida, ocupando o restante do espaço.
- **Padding Interno:** Telas devem possuir margens de respiro (padrão `px-4 sm:px-6 lg:px-8 py-8`).

# Elevation & Depth

- **Cards e Modais:** Sombras leves (`shadow-sm` ou `shadow-md`) para destacar áreas de conteúdo sobre o fundo `gray-50`.
- **Dropdowns e Popovers:** Sombra profunda (`shadow-lg` ou `shadow-xl`) para garantir que flutuem acima do conteúdo principal.

# Components

## Buttons
- **Primary:** Fundo azul `bg-[#1a3c5e]`, texto branco, bordas arredondadas `rounded-lg`, hover `bg-[#0f2540]`.
- **Secondary:** Outline com borda `gray-300`, texto `gray-700`, hover `bg-gray-50`.

## Inputs
- **Base:** Fundo branco, borda `gray-300` e cantos arredondados.
- **Focus:** Ao focar, o anel brilha em azul (`ring-[#1a3c5e]`).
- **Error:** Borda vermelha `ring-red-300`, com texto de erro em `text-red-600`.

## Badges
- Pílulas para exibir status de clientes ou processos. Fundo e cor de texto baseados no status (Verde para sucesso/ativo, Cinza para inativo, Amarelo para pendente).

# Do's and Don'ts

- **DO:** Use a cor Primary para a ação principal de cada tela (ex: "Salvar Cliente", "Novo Processo").
- **DO:** Use ícones do `lucide-react` para complementar textos de ações.
- **DON'T:** Não utilize o Dourado (`accent`) para fundos largos. Ele é exclusivo para detalhes sutis ou destaques mínimos.
- **DON'T:** Não use mais de uma variação de fonte. Mantenha-se na família Inter.
