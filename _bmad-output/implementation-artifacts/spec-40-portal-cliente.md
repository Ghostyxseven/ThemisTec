# Especificação Técnica: Portal do Cliente (Story 40)

## Resumo
A implementação do Portal do Cliente cria uma área white-label para que clientes acessem seus processos e documentos, usando autenticação simplificada (CPF + Data de Nascimento) sem exigir e-mail ou senha pré-cadastrada.

## Arquitetura (MVVM)

### 1. Model (Data / Adapter)
`src/features/portal-cliente/model/SupabasePortalAdapter.ts`
Esta classe será responsável pela persistência e leitura, atuando como um Data Access Object (DAO) focado no escopo do cliente.
**Métodos principais:**
- `autenticar(cpf: string, dataNascimento: string): Promise<{ token: string, cliente: Cliente }>`
- `listarProcessos(clienteId: string): Promise<Processo[]>`
- `listarDocumentos(processoId: string, clienteId: string): Promise<Documento[]>`

### 2. ViewModel
`src/features/portal-cliente/viewmodel/usePortalAuth.ts`
Gerencia o estado de autenticação do lado do cliente (cookies/localStorage) e interage com o Adapter (ou API Route).

`src/features/portal-cliente/viewmodel/usePortalProcessos.ts`
Gerencia o carregamento e estado dos processos do cliente.

### 3. View (Componentes e Telas)
- **Tela de Login:** `src/app/portal/page.tsx`
  - Formulário com os campos CPF e Data de Nascimento.
  - Validação via Zod (reutilizando a lógica de CPF do cliente.schema).
- **Tela de Dashboard:** `src/app/portal/dashboard/page.tsx`
  - Lista de processos em formato mobile-first (cards).
- **Detalhes do Processo:** `src/app/portal/dashboard/processo/[id]/page.tsx`
  - Exibe movimentações e os documentos públicos atrelados.

### 4. API Routes (Backend/Segurança)
Como clientes não utilizam o Auth nativo do Supabase (Email/Senha), precisaremos de:
- `src/app/api/portal/auth/route.ts`: Para receber o POST do login, buscar o cliente no banco `clientes` usando a key `service_role` e, se válido, emitir um JWT customizado criptografado (salvo como HttpOnly cookie).
- Middleware do Next.js `src/middleware.ts` (ou similar) precisará ignorar as checagens do Supabase Auth para a rota `/portal/dashboard` e, em vez disso, verificar o cookie do JWT customizado.

## Tratamento de Dados (Zod Schemas)
Criaremos um schema específico para o login do portal:
```ts
// src/specs/portal.schema.ts
import { z } from "zod";
import { validarCPF } from "@/shared/utils/validadores"; // já existente

export const portalLoginSchema = z.object({
  cpf: z.string().refine(validarCPF, "CPF inválido"),
  dataNascimento: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato inválido"),
});
```

## Próximos Passos
1. Implementar a validação e o token via `jose` na API Route.
2. Criar a tela de login (`/portal`).
3. Criar a Dashboard e Adapter.
