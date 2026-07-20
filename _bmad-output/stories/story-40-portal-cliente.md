# Story 40: Portal do Cliente (White-label)

**Status:** ready-for-dev

## Story

**Como** cliente de um advogado (ou escritório),
**quero** acessar uma área restrita informando apenas meu CPF e Data de Nascimento,
**para que** eu possa visualizar o andamento do meu próprio processo e os documentos públicos que o advogado disponibilizou, sem precisar ligar ou mandar mensagem para o escritório.

## Critérios de aceitação

- [ ] Rota `/portal` deve apresentar um formulário simples pedindo CPF e Data de Nascimento.
- [ ] O login deve buscar na tabela de clientes. Se bater CPF e Data de Nascimento, cria uma sessão (JWT customizado via API Route ou Supabase Auth Anonymous associado ao cliente).
- [ ] O cliente, logado, visualiza um painel (Dashboard) com a lista dos seus processos.
- [ ] O cliente deve conseguir abrir um processo e visualizar o histórico de movimentações públicas.
- [ ] O cliente deve conseguir visualizar documentos atrelados ao processo que não estejam marcados como "privados".
- [ ] Um cliente NÃO PODE, sob nenhuma hipótese, ver processos ou documentos de outros clientes (Isolamento via validação no backend/adapter).
- [ ] A arquitetura deve seguir MVVM, com `SupabasePortalAdapter` gerenciando as buscas do lado do cliente.
- [ ] Layout mobile-first, já que o cliente provavelmente acessará pelo celular.

## Notas Técnicas

- Como os clientes na base atual não possuem obrigatoriamente e-mail, e o Supabase Auth exige e-mail/senha, a autenticação usará uma API Route no Next.js (`/api/portal/auth`) que valida o CPF e Data de Nascimento contra a tabela `clientes`.
- Após a validação, a API gera um token JWT (usando `jose` ou similar) que é salvo nos cookies (HttpOnly).
- Os Adapters do Portal (`SupabasePortalAdapter`) usarão o `supabaseClient` do lado do servidor (ou service_role em rotas protegidas da API, ou client padrão autenticado pelo JWT) para buscar as informações, garantindo a segurança e aplicando filtros rígidos pelo `cliente_id` recuperado do token.
