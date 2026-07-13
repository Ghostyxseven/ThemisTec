# IMPLEMENTATION SPEC: Estilização de Tabelas e Cards (US20)

## 1. Arquivos a serem modificados

### 1.1 `src/app/(authenticated)/dashboard/page.tsx`
- **[MODIFICAR]**
- Refatorar a classe base dos 3 Cards: `bg-white shadow-sm rounded-xl border border-gray-100 p-6 transition-all hover:shadow-md`.
- Dar destaque aos ícones envolvendo-os em `rounded-full` com cores sólidas claras (`bg-blue-50 text-blue-600`).
- Usar tipografia forte para os números num tamanho maior (ex: `text-4xl font-bold tracking-tight text-gray-900`).

### 1.2 `src/app/(authenticated)/clientes/page.tsx`
- **[MODIFICAR]**
- Remover linhas divisórias pesadas. Usar `divide-y divide-gray-100`.
- Aumentar o `padding` de cada `<td>` (ex: `px-6 py-5`).
- Implementar "Avatar" placeholder (iniciais do nome) ao lado do Nome do Cliente para dar identidade à listagem.
- Ajustar os botões de ação ("Editar" e "Excluir") para ícones menores ou badges de ação mais discretos (ex: texto `text-sm font-medium` sem borda, apenas hover text-color).

### 1.3 `src/app/(authenticated)/processos/page.tsx`
- **[MODIFICAR]**
- Seguir o mesmo layout de tabelas de Clientes.
- Refatorar o renderizador de Status (`Em Andamento`, `Concluído`, `Arquivado`) e Status de Pagamento (`Pago`, `Pendente`, `Atrasado`).
- O Badge deve ser: `inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium`.
- Adicionar uma "bolinha" SVG indicativa antes do texto do badge.
- Ajustar o Empty State (Quando array é zero) aplicando um SVG premium em vez de apenas o `folder_open`.

## 2. Validação
- Rodar a aplicação (`npm run dev`) e navegar pelas rotas: `/dashboard`, `/clientes` e `/processos`.
- Garantir que as tabelas se mantêm responsivas (scroll horizontal em telas pequenas: `overflow-x-auto`).
- Validar as cores dos badges para estarem perfeitamente legíveis (WCAG constrast ratio).
