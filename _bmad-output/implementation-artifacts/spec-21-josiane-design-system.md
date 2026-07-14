# Spec 21: Criação do Design System Moderno

## 1. Objetivo
Implementar um sistema de design moderno e vibrante para a plataforma ThemisTec, que inclua uma paleta de cores aprimorada, tipografia moderna (Inter), utilitários baseados em TailwindCSS (incluindo glassmorphism, micro-animações, temas light/dark suaves) e a criação da fundação dos componentes de UI na pasta `src/components/ui`.

## 2. Escopo
- Modificar `tailwind.config.ts` para registrar novos tokens de cores, fontes, box-shadows e utilitários de animação.
- Modificar `src/app/globals.css` para definir os tokens CSS primários.
- Criar a documentação de tokens em `design-artifacts/D-Design-System/tokens.md`.
- Criar os componentes base:
  - `src/components/ui/Button.tsx`
  - `src/components/ui/Input.tsx`
  - `src/components/ui/Card.tsx`
- Refatorar arquivos de layout para absorver os tokens (se necessário e pertinente à fundação).

## 3. Detalhamento Técnico

### Cores (Tokens a serem injetados)
- **Primary:** Azul vibrante moderno (`#2563EB` -> `blue-600` base, com variações).
- **Secondary / Accent:** Dourado/Amarelo (`#EAB308` -> `yellow-500` ou similar).
- **Backgrounds:** Variações entre `#F8FAFC` (Slate-50) e `#FFFFFF`.
- **Text:** Slate escuro (`#0F172A` para headings, `#334155` para corpo).

### Micro-animações e Efeitos
- Transições padrão de `150ms` a `300ms` `ease-in-out`.
- Efeitos de hover `scale-105` ou `translate-y-1` suaves nos cards e botões.
- Glassmorphism para os modais ou headers fixos (`bg-white/80 backdrop-blur-md`).

### Arquivos a Serem Modificados/Criados
1. `tailwind.config.ts` [MODIFY]
2. `src/app/globals.css` [MODIFY]
3. `design-artifacts/D-Design-System/tokens.md` [NEW]
4. `src/components/ui/Button.tsx` [NEW]
5. `src/components/ui/Input.tsx` [NEW]
6. `src/components/ui/Card.tsx` [NEW]

## 4. Testes e Validação
- Rodar `npm run dev` para assegurar que não há quebra nas configurações do Tailwind.
- Utilizar os componentes no layout principal para validar consistência.
