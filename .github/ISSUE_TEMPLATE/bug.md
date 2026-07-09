---
name: "Bug Report"
about: "Reportar comportamento incorreto em algo já implementado"
title: "[BUG] "
labels: ["bug"]
assignees: ""
---

## Descrição do Bug

<!-- Descreva de forma clara e objetiva o que está acontecendo de errado -->

---

## Comportamento Esperado

<!-- O que deveria acontecer? -->

---

## Comportamento Atual

<!-- O que está acontecendo de fato? -->

---

## Passos para Reproduzir

1. 
2. 
3. 

---

## Contexto do Ambiente

| Campo | Valor |
|-------|-------|
| Navegador | (ex: Chrome 126, Firefox 128) |
| Dispositivo | (ex: Desktop, iPhone 14) |
| URL / Rota | (ex: `/clientes`, `/login`) |
| Usuário afetado | (ex: usuário autenticado, todos) |

---

## User Story / Funcionalidade Afetada

<!-- Qual US ou épico este bug afeta? -->
- [ ] US01–US03 – Autenticação (EP01)
- [ ] US04–US06 – Clientes (EP02)
- [ ] US07–US09 – Processos (EP03)

---

## Evidências

<!-- Cole prints, logs de console, mensagens de erro -->

```
Cole logs ou stack traces aqui
```

---

## Causa Raiz Suspeita

<!-- Se já investigou, descreva onde pode estar o problema -->
- Arquivo(s) suspeito(s):
- Função / schema envolvido:

---

## Checklist de Correção (para a IA e o dev)

- [ ] Reproduzido localmente
- [ ] Causa raiz identificada
- [ ] Correção implementada na branch `fix/nome-do-bug`
- [ ] Teste de regressão adicionado (se aplicável)
- [ ] `npm run harness` — todos os sensores passando
- [ ] PR criado com `Closes #<número-desta-issue>`
