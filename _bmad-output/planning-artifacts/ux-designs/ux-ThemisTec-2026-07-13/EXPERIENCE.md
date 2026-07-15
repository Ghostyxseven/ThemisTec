---
status: final
updated: 2026-07-13
---

# Foundation

O ThemisTec é uma aplicação web responsiva (Desktop-first, mas que adapta suas listagens e menus para Mobile via PWA e design responsivo do Tailwind). A identidade visual de toda a aplicação está referenciada no contrato irmão `DESIGN.md`.

# Information Architecture

A hierarquia de navegação principal (presente na Sidebar) consiste em:
- **Dashboard (`/dashboard`):** Visão geral, métricas rápidas e alertas.
- **Clientes (`/clientes`):** Listagem de clientes com paginação e barra de busca.
- **Processos (`/processos`):** Acompanhamento de ações judiciais e status.
- *(Futuro) Financeiro, Agenda e Configurações.*

# Voice and Tone

O tom de comunicação no ThemisTec é **Profissional, Claro e Respeitoso**.
Não há espaço para linguagem informal excessiva ou jargões jurídicos desnecessários na interface (a interface deve facilitar a gestão, não complicá-la).
Mensagens de erro não culpam o usuário (ex: em vez de "Você digitou a senha errada", use "E-mail ou senha inválidos").

# Component Patterns

- **Tabelas de Listagem:** Possuem busca no topo e paginação no rodapé. Quando vazias, exibem o `EmptyState` component.
- **Empty States:** Um ícone ilustrativo cinza, um título em negrito explicando que não há dados, e um botão de ação primária (ex: "Cadastrar primeiro cliente").
- **Confirmações Destrutivas:** Ações de exclusão exigem um modal de confirmação com um botão destrutivo (vermelho).

# State Patterns

- **Loading:** Para carregamentos de página inteira (SSG/SSR), usamos esqueletos (Skeletons). Para submissões de botão, o botão entra no estado `disabled` e troca o texto por "Carregando..." ou exibe um spinner.
- **Empty:** Todo conteúdo iterativo (tabelas, listas de anexo) deve ter um tratamento amigável de lista vazia.
- **Error:** Erros globais via Toast/Snackbar; erros de input inline abaixo do campo (`text-red-600`).

# Interaction Primitives

- Navegação entre rotas deve ser instantânea (Client-side routing do Next.js).
- Menu mobile ("hamburger") desliza da esquerda para a direita (Drawer pattern), com fundo semitransparente escurecido.

# Accessibility Floor

- Todos os formulários possuem `labels` claras (não dependem apenas do placeholder).
- As cores de botão (Primary) sobre texto branco atendem à relação de contraste exigida pela WCAG (nível AA).
- Navegação via tab (teclado) tem o foco visível (`focus-visible:ring`).

# Key Flows

1. **Autenticação:** O advogado acessa a tela de Login (com branding reforçado) e entra com e-mail/senha usando o Firebase Auth. Em caso de falha, é alertado de forma não-intrusiva.
2. **Navegação Principal:** O advogado, já logado, utiliza a barra lateral para transitar rapidamente entre seus Processos e Clientes, visualizando Badges semânticos que informam imediatamente o status de cada item na tabela.
