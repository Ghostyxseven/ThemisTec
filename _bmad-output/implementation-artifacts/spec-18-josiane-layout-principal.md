# IMPLEMENTATION SPEC: Layout Principal e Navegação (US18)

## 1. Arquivos Modificados/Criados

### 1.1 `src/components/layout/Sidebar.tsx`
- **[NOVO]**
- Componente responsável pelo menu de navegação lateral.
- Deve conter a logo do ThemisTec no topo.
- Deve conter links de navegação para: `/dashboard`, `/clientes`, `/processos`.
- Deve indicar visualmente o link ativo usando `usePathname`.
- Deve ser responsivo (escondido ou menu hambúrguer no mobile).

### 1.2 `src/components/layout/Header.tsx`
- **[NOVO]**
- Componente de cabeçalho.
- Deve ter um botão de "Sair" (Logout) integrado ao `FirebaseAuthAdapter` (ou `IAuthService`).
- No mobile, deve exibir o botão do menu hambúrguer para abrir a Sidebar.

### 1.3 `src/app/(authenticated)/layout.tsx`
- **[NOVO]**
- Layout para as páginas protegidas.
- A estrutura do layout deve ser um container flexível onde a `Sidebar` fica na lateral esquerda e o `Header` fica no topo do conteúdo principal (`children`).

### 1.4 `src/app/(authenticated)/*`
- **[MODIFICAR/MOVER]**
- Mover as pastas `dashboard`, `clientes`, e `processos` da raiz de `src/app/` para dentro do grupo de rotas `src/app/(authenticated)/`.
- Isso garante que o layout do Shell envolva essas páginas automaticamente, mas mantenha as URLs limpas (e.g., `/dashboard`).

## 2. Validação
- Executar a aplicação e acessar `/dashboard`.
- Validar se o header e a sidebar aparecem corretamente.
- Testar a responsividade no modo mobile do navegador.
- Clicar em "Sair" e confirmar se o usuário é deslogado.
