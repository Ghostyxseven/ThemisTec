# SPEC: Setup Inicial do Front-end e Roteamento Base

**Referência:** Story 1.2 (Josiane)  
**Status:** Implementado ✅  

## 1. Definição do Problema
O projeto requeria a inicialização da fundação front-end para que as implementações lógicas (como a de autenticação) pudessem ser posteriormente acopladas às telas. Havia a necessidade de estruturar o Next.js com Tailwind sem código legado/desnecessário.

## 2. Abordagem Arquitetural
A inicialização seguiu o padrão do **App Router** do Next.js (versão 13+).

### 2.1. Limpeza do Boilerplate
- O arquivo `src/app/page.tsx` original deve ser substituído por uma estrutura em branco ou por um layout mínimo, eliminando componentes padrão (como o logo da Vercel).
- Limpeza do `src/app/globals.css` para manter apenas as diretivas fundamentais do Tailwind:
  ```css
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
  ```

### 2.2. Configuração de Estilo (Tailwind)
O arquivo `tailwind.config.ts` precisava ser limpo e as fontes padrão do projeto, caso definidas no UX, inseridas no tema extendido.

### 2.3. Roteamento (Esqueleto)
Criação dos diretórios de rotas que a arquitetura previa no início (ex: `src/app/login/page.tsx`). O foco era apenas exportar componentes React (Views) básicos que renderizassem uma `div` em branco para não travar a compilação do TypeScript de quem puxasse o código (ex: Micael).

## 3. Integração com a Árvore de Código
Essas alterações pavimentaram o caminho para que o ViewModel pudesse ser importado posteriormente em arquivos limpos, garantindo que o `npm run build` fluísse sem erros relativos a páginas faltantes ou CSS corrompido.

---
> **Nota de Arquitetura:** A implementação desta especificação foi a primeira "mão de tinta" no projeto, validando se a pipeline de transpilação (TS) e estilos do repositório estava saudável.
