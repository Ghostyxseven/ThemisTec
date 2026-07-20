# Especificação Técnica: Rework Global de UI/UX

Esta especificação (gerada pós fase de UX via BMad) lista as modificações necessárias na base de código atual do projeto para refletir o novo `DESIGN.md` e `EXPERIENCE.md`.

## 1. Variáveis Globais de CSS (`src/app/globals.css`)
- **Modificar:** A paleta padrão do Tailwind será sobrescrita. Precisamos injetar as variáveis de cores (`#1E293B`, `#8B5CF6`) e preparar as classes utilitárias para o *glassmorphism*.
- **Ações:** 
  - Adicionar `@apply bg-background text-textPrimary` no `body`.
  - Definir custom classes como `.glass-panel { @apply bg-white/70 backdrop-blur-md border border-white/20 shadow-soft; }`

## 2. Componentes Base (`src/components/ui/`)
Em vez de reescrever todas as telas agora, reescreveremos/criaremos componentes primitivos reutilizáveis:
- **Button:** 
  - Refatorar para usar as cores de Accent (`#8B5CF6`).
  - Implementar micro-animações nas classes (`transition-all active:scale-95 hover:-translate-y-0.5 hover:brightness-110`).
- **Input:** 
  - Refatorar para cantos bem arredondados (`rounded-xl`), sem fundo cinza forte, usando `border-slate-200` e anel de foco violeta (`focus:ring-2 focus:ring-violet-500/20`).
- **Card:** 
  - Implementar cantos arredondados generosos (`rounded-2xl`) com sombreamento suave (`shadow-sm`).
- **Badge/Status:**
  - Padronizar uso de cores com fundos muito claros (`bg-violet-50 text-violet-700`) e cantos redondos (`rounded-full`).

## 3. Tela de Login / Portal (`src/app/portal/page.tsx` & `src/app/portal/dashboard/page.tsx`)
- **Portal Login:** Aplicar o conceito premium. Centralizar o form num card *glassmorphism* flutuando sobre um background escuro, azulado ou com um gradiente refinado.
- **Portal Dashboard:** Usar os novos componentes de `Card` para as faturas e exibir informações em layouts mais limpos, priorizando legibilidade (fontes maiores e bom contraste).

## Procedimento de Execução (Próximos Passos)
1. Modificar o arquivo de configurações do Tailwind (`tailwind.config.ts`) se necessário, para estender as cores `brand`, `accent` e `surface`.
2. Alterar o `globals.css`.
3. Criar os componentes isolados em `src/components/ui/`.
4. Refatorar, uma a uma, as telas principais começando pelas criadas nas Stories 40 e 41.
