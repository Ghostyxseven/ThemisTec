# Design Tokens: ThemisTec

Este documento serve como referência única (Single Source of Truth) para os design tokens usados no projeto.

## Cores (Colors)

| Token | CSS Variable | Hex | Tailwind Class | Uso |
| --- | --- | --- | --- | --- |
| **Primary** | `--color-primary` | `#2563EB` | `bg-primary`, `text-primary` | Botões principais, links, branding. |
| **Primary Dark** | `--color-primary-dark` | `#1D4ED8` | `bg-primary-dark` | Hover de botões primários. |
| **Accent** | `--color-accent` | `#EAB308` | `bg-accent`, `text-accent` | Destaques, alertas, badges. |
| **Background** | `--background` | `#F8FAFC` | `bg-background` | Fundo geral da aplicação. |
| **Foreground** | `--foreground` | `#0F172A` | `text-foreground` | Texto principal, títulos. |

## Tipografia (Typography)

| Tipo | Fonte | Tailwind Class | Uso |
| --- | --- | --- | --- |
| **Sans** | `Inter` | `font-sans` | Fonte global para corpo e títulos. |

## Sombras (Shadows)

| Token | Valor Tailwind | Tailwind Class | Uso |
| --- | --- | --- | --- |
| **Soft** | `0 4px 20px -2px rgba(0, 0, 0, 0.05)` | `shadow-soft` | Cards básicos, containers sutis. |
| **Card** | `0 10px 30px -5px rgba(0, 0, 0, 0.08)` | `shadow-card` | Modais, popovers, dropdowns. |

## Espaçamento e Bordas (Radii)

| Token | CSS Variable | Rem | Uso |
| --- | --- | --- | --- |
| **Small** | `--radius-sm` | `0.25rem` | Inputs pequenos, badges. |
| **Medium** | `--radius-md` | `0.5rem` | Botões, inputs normais. |
| **Large** | `--radius-lg` | `0.75rem` | Cards, modais. |
