# Story 03: Implementação Visual da Tela de Login (Front-end)

**Responsável:** Josiane  
**Status:** done
**Épico Relacionado:** Épico 01 - Autenticação  

## 1. Contexto e Objetivo
O motor de autenticação (Backend/Model) feito no Épico 01 já está 100% pronto e documentado. O objetivo desta história é que a Josiane construa a **View** (casca visual) da tela de login e conecte essa View ao ViewModel já existente (`useLogin.ts`), sem alterar as regras de negócio de baixo nível.

## 2. Contratos Rigorosos (Spec-Driven Development)
Conforme nossa arquitetura, nenhuma tela pode reinventar regras de validação. O Front-end deve respeitar:
- **Schema de Validação:** O arquivo `src/specs/schemas/auth.schema.ts`. O Zod será a única fonte da verdade para saber se um e-mail é válido ou se a senha é forte.
- **ViewModel:** A tela deve consumir exclusivamente o hook `useLogin()`, extraindo dele as funções de login e os estados reativos (`isLoading`, `errorMessage`).

## 3. Requisitos Técnicos e Visuais
A Josiane deverá implementar no arquivo `src/app/login/page.tsx`:

1. **Formulário Reativo:**
   - Utilizar a biblioteca `react-hook-form` em conjunto com `@hookform/resolvers/zod` para injetar as regras do `auth.schema.ts` no formulário.

2. **Campos Obrigatórios:**
   - Input de **E-mail** (tipo e-mail).
   - Input de **Senha** (tipo password).
   - **Requisito visual de UX:** O input de senha deve ter um botão de "olhinho" para alternar entre ver/ocultar a senha digitada.

3. **Feedback ao Usuário:**
   - Se o usuário digitar algo errado (ex: senha muito curta), exibir a mensagem de erro que vem automaticamente do Zod abaixo do input, com texto vermelho (`text-red-500`).
   - Enquanto o `useLogin` estiver no estado `isLoading == true`, o botão de "Entrar" deve mudar o texto para "Carregando..." e ficar desabilitado (disabled) para evitar cliques duplos.
   - Exibir no topo da tela qualquer erro de servidor (`errorMessage`) retornado pelo hook.

4. **Estilização:** 
   - Utilizar TailwindCSS seguindo o design limpo e moderno da ThemisTec.

## 4. Harness Engineering (Regras de Entrega)
Antes de enviar o código, a Josiane deve garantir que os sensores automáticos (Feedback Loop) estejam verdes:
- [x] O código não pode acusar nenhum erro no TypeScript (`npm run typecheck`).
- [x] O código não pode acusar avisos no Linter (`npm run lint`).
- [ ] **REGRA DE OURO:** Nenhum Pull Request pode ser criado no Github sem antes criar uma **Issue**. O PR deve obrigatoriamente conter a frase `Closes #N` onde N é o número da Issue criada.
