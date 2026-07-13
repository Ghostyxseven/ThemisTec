# IMPLEMENTATION SPEC: Construir Interface do Dashboard (US11)

## 1. Arquivos Modificados/Criados

### 1.1 `src/app/dashboard/useDashboard.ts`
- **[NEW]**
- Criar o Hook ViewModel para orquestrar as estatísticas.
- Instanciar `FirebaseAuthAdapter` para recuperar o `userId`.
- Instanciar `FirestoreClienteAdapter` e `FirestoreProcessoAdapter`.
- O hook deve retornar:
  - `isLoading`: boolean
  - `errorMessage`: string | null
  - `estatisticas`: { totalClientes: number; totalProcessos: number; ativosProcessos: number } | null
- Utilizar `useEffect` para buscar as contagens ao carregar o hook.
- Implementar tratamentos de erro adequados se o usuário não estiver logado.

### 1.2 `src/app/dashboard/page.tsx`
- **[NEW]**
- Página do Dashboard contendo o layout de estatísticas.
- Deve importar e utilizar o hook `useDashboard()`.
- O layout deve ser composto por "cards" apresentando os valores recebidos de `estatisticas`.
- Apresentar skeleton loaders condicionados ao `isLoading`.
- Se `errorMessage` for truthy, exibir o erro.

### 1.3 `src/app/page.tsx`
- **[MODIFICAR]**
- Atualmente redireciona indiscriminadamente para `/login`.
- Como não há um middleware centralizado para esse teste ainda ou para não depender de uma checagem síncrona demorada aqui (já que é Client/Server, mas no App Router isso varia), ajustar a lógica para checar a autenticação (via componente Client ou Server Side que injeta estado). Se não for viável de imediato sem bugar a renderização estática, manteremos ou faremos um componente client provisório. Para o momento, apenas redirecionaremos para `/dashboard` se usarmos uma verificação simples ou deixamos como está caso precise de refatoração maior (deixarei a edição para verificação na implementação).

## 2. Validação
- Executar `npm run typecheck` e `npm run lint`.
- Testar no navegador para confirmar que os dados (cards) aparecem na rota `/dashboard`.
