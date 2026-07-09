---
name: "User Story"
about: "Implementar uma funcionalidade do MVP (US01–US09)"
title: "[STORY] "
labels: ["story"]
assignees: ""
---

## User Story

**Como** [perfil do usuário],  
**quero** [ação ou funcionalidade],  
**para que** [benefício ou objetivo].

---

## User Story Relacionada

<!-- Marque qual US do PRD esta issue implementa -->
- [ ] US01 – Login com e-mail e senha
- [ ] US02 – Cadastro de conta com confirmação
- [ ] US03 – Recuperação de senha
- [ ] US04 – Cadastro de cliente (CPF único)
- [ ] US05 – Listagem paginada com busca
- [ ] US06 – Edição e exclusão de cliente
- [ ] US07 – Registro de processo vinculado a cliente
- [ ] US08 – Consulta de processos com filtros
- [ ] US09 – Anexar PDF ao processo

---

## Épico

<!-- Marque o épico correspondente -->
- [ ] EP01 – Autenticação
- [ ] EP02 – Gestão de Clientes
- [ ] EP03 – Gestão de Processos

---

## Critérios de Aceite

<!-- Liste as condições que devem ser verdadeiras para esta story ser considerada concluída -->
- [ ] 
- [ ] 
- [ ] 

---

## Contratos e Specs

<!-- Quais schemas e rotas estão envolvidos? -->

| Artefato | Localização |
|----------|------------|
| Schema Zod | `src/specs/schemas/` |
| Rota OpenAPI | `src/specs/openapi.yaml` |

---

## Notas Técnicas

<!-- Decisões de implementação relevantes, ADRs que se aplicam -->

**ADRs relacionados:**
- ADR-0007 – Padrão MVVM obrigatório
- ADR-0008 – Padrões GoF (Adapter, Singleton, Observer)

**Camadas esperadas (MVVM):**
- `View` — componente React em `src/app/`
- `ViewModel` — hook em `useNomeDaFeature.ts`
- `Model` — service em `src/services/firebase/`

---

## Checklist de Conclusão (para a IA e o dev)

- [ ] Implementação segue o padrão MVVM
- [ ] Schema Zod validado na fronteira de entrada
- [ ] `npm run typecheck` — sem erros
- [ ] `npm run lint` — sem erros
- [ ] `npm run test` — todos passando
- [ ] PR criado com `Closes #<número-desta-issue>`
