# IMPLEMENTATION SPEC: Identidade Visual da Autenticação (US19)

## 1. Arquivos Modificados/Criados

### 1.1 `src/app/login/page.tsx`
- **[MODIFICAR]**
- Mudar a estrutura do `<main>` para usar um `grid` no desktop (`lg:grid lg:grid-cols-2`).
- A coluna da esquerda (ou direita) será a "Branding Area": fundo azul (`bg-gradient-to-br from-[#1a3c5e] to-[#0f2540]`), contendo o título, um parágrafo inspiracional ("A revolução digital na gestão do seu escritório de advocacia") e possivelmente um SVG jurídico.
- A coluna do formulário terá fundo branco, conteúdo centralizado (max-width), botões atualizados com transições e `focus:ring-offset-2`.

### 1.2 `src/app/register/page.tsx`
- **[MODIFICAR]**
- Aplicar o mesmo padrão visual (Split-screen) do Login, garantindo consistência.
- O card branco no mobile se fundirá com a tela, sem "borda" óbvia de card (ou com padding elegante).

### 1.3 `src/app/globals.css` (Opcional)
- Apenas se precisarmos adicionar fontes (ex: `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');`) para garantir uma tipografia impecável, caso não esteja configurada no Tailwind config.

## 2. Validação
- Abrir `/login` no desktop e verificar se a tela está dividida ao meio, com a área da marca exibindo corretamente a cor primária e o formulário do outro lado.
- Redimensionar a tela e verificar se a área de branding é ocultada no mobile, restando apenas o formulário centralizado perfeitamente.
- Realizar os testes no `/register` e garantir que o formulário de validação do Zod não quebrou visualmente (as mensagens de erro devem aparecer bonitas sob os inputs).
