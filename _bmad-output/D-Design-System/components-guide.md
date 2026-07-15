# Design System: Guia de Componentes

> Documentação dos componentes de UI reutilizáveis do ThemisTec.
> Cada componente é atômico, acessível e segue os tokens definidos em `tokens.md`.

---

## Princípios de Design

1. **Clareza acima de tudo** — O advogado precisa encontrar informações rápido, sem ruído visual.
2. **Consistência** — Mesmas cores, sombras e espaçamentos em todas as telas.
3. **Micro-interações** — Feedbacks visuais sutis (hover, focus, loading) que transmitem profissionalismo.
4. **Responsividade** — Mobile-first. Funciona igualmente bem no celular e no desktop.

---

## Paleta de Cores

| Nome | Hex | Classe Tailwind | Aplicação |
|------|-----|-----------------|-----------|
| Primary | `#2563EB` | `bg-primary` / `text-primary` | Botões, links, branding |
| Primary Dark | `#1D4ED8` | `bg-primary-dark` | Hover de botões primários |
| Accent | `#EAB308` | `bg-accent` / `text-accent` | Destaques, badges, alertas |
| Background | `#F8FAFC` | `bg-background` | Fundo geral |
| Foreground | `#0F172A` | `text-foreground` | Texto principal |
| Sucesso | `#22C55E` | `text-green-500` | Toasts de sucesso |
| Erro | `#EF4444` | `text-red-500` | Mensagens de erro |
| Warning | `#F59E0B` | `text-amber-500` | Avisos |

---

## Componentes

### 1. Button (`src/components/ui/Button.tsx`)

Botão reutilizável com variantes, tamanhos e estado de loading.

#### Props

| Prop | Tipo | Default | Descrição |
|------|------|---------|-----------|
| `variant` | `"primary" \| "secondary" \| "outline" \| "ghost"` | `"primary"` | Estilo visual |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Tamanho |
| `isLoading` | `boolean` | `false` | Exibe spinner e desabilita |

#### Variantes

| Variante | Visual | Uso |
|----------|--------|-----|
| **primary** | Fundo azul, texto branco | Ações principais (Salvar, Entrar) |
| **secondary** | Fundo dourado/accent, texto branco | Ações secundárias |
| **outline** | Borda azul, fundo transparente | Ações terciárias (Cancelar) |
| **ghost** | Sem borda/fundo, texto escuro | Ações sutis (links internos) |

#### Exemplo de Uso
```tsx
import { Button } from "@/components/ui/Button";

<Button variant="primary" size="lg" isLoading={isSubmitting}>
  Salvar Cliente
</Button>
```

---

### 2. Input (`src/components/ui/Input.tsx`)

Campo de texto estilizado com suporte a labels, ícones e validação.

#### Props

| Prop | Tipo | Default | Descrição |
|------|------|---------|-----------|
| `label` | `string` | — | Label exibida acima do campo |
| `error` | `string` | — | Mensagem de erro (borda vermelha) |
| `icon` | `ReactNode` | — | Ícone posicionado à esquerda |

#### Estados Visuais

| Estado | Comportamento |
|--------|---------------|
| **Default** | Borda `slate-300`, fundo branco |
| **Focus** | Anel azul `ring-primary`, borda transparente |
| **Error** | Borda vermelha, anel vermelho no foco, mensagem abaixo |
| **Disabled** | Opacidade 50%, cursor bloqueado |

#### Exemplo de Uso
```tsx
import { Input } from "@/components/ui/Input";

<Input
  label="E-mail"
  type="email"
  placeholder="seu@email.com"
  error={errors.email?.message}
/>
```

---

### 3. Card (`src/components/ui/Card.tsx`)

Container com sombra suave, bordas arredondadas e micro-animação opcional.

#### Subcomponentes

| Componente | Descrição |
|------------|-----------|
| `Card` | Container principal |
| `CardHeader` | Cabeçalho com borda inferior sutil |
| `CardTitle` | Título em negrito (h3) |
| `CardContent` | Área de conteúdo com padding |
| `CardFooter` | Rodapé para ações |

#### Props do Card

| Prop | Tipo | Default | Descrição |
|------|------|---------|-----------|
| `hoverable` | `boolean` | `false` | Ativa efeito de elevação no hover |

#### Exemplo de Uso
```tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

<Card hoverable>
  <CardHeader>
    <CardTitle>Maria Silva</CardTitle>
  </CardHeader>
  <CardContent>
    <p>CPF: 123.456.789-00</p>
    <p>3 processos ativos</p>
  </CardContent>
</Card>
```

---

## Efeitos e Animações

| Efeito | Classe Tailwind | Uso |
|--------|-----------------|-----|
| **Glassmorphism** | `bg-white/80 backdrop-blur-md` | Headers fixos, modais |
| **Hover Scale** | `hover:scale-105 transition-transform` | Cards interativos |
| **Hover Elevação** | `hover:-translate-y-1 hover:shadow-card` | Cards com `hoverable` |
| **Active Scale** | `active:scale-95` | Botões ao clicar |
| **Transição Padrão** | `transition-all duration-200` | Todos os elementos interativos |
