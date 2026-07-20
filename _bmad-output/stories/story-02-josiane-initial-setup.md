# Story 02: Setup Inicial do Front-end e Roteamento Base

**Responsável:** Josiane  
**Status:** done
**Épico Relacionado:** Épico 01 - Autenticação / Infraestrutura  

## 1. Contexto e Objetivo
Para que a equipe de back-end pudesse iniciar o desenvolvimento dos adapters de autenticação, precisávamos de uma base sólida no front-end. O objetivo desta história foi realizar a configuração inicial do Next.js (App Router), instalar as dependências visuais (Tailwind CSS) e criar as páginas e layouts estáticos iniciais do projeto.

## 2. Contratos Rigorosos (Spec-Driven Development)
Embora esta task seja de infraestrutura de front-end, ela segue os padrões de código e arquitetura:
- **Padrão de UI:** Utilizar Tailwind CSS para componentização visual sem arquivos CSS externos poluindo o projeto.
- **Roteamento:** Garantir que o `App Router` do Next.js esteja sendo utilizado de forma correta, separando Layouts e Pages.

## 3. Requisitos Técnicos Entregues
A Josiane foi responsável por:

1. **Configuração do Projeto:**
   - Inicializar o repositório com `create-next-app`.
   - Configurar fontes modernas e paleta de cores base no `tailwind.config.ts`.
   - Limpar o boilerplate padrão do Next.js.

2. **Criação da Casca Visual (Views Iniciais):**
   - Criar as rotas iniciais, especialmente o esqueleto da pasta `src/app/login/page.tsx` para que o Micael pudesse plugar o motor de autenticação depois.
   - Definir os estilos globais no `globals.css`.

3. **Integração Básica:**
   - Garantir que a build e os imports do TypeScript (path aliases como `@/components`) estivessem funcionando para o resto do time.

## 4. Harness Engineering (Regras de Entrega)
- [x] O comando `npm run build` deve gerar a versão de produção sem erros estruturais.
- [x] O Tailwind deve estar compilando perfeitamente sem classes inúteis.
- [x] **REGRA OBRIGATÓRIA:** A PR deve ser associada a uma Issue no momento do merge (ex: `Closes #N`).
