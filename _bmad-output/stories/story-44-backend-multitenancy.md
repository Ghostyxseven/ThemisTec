# Story 44: Migração de Schemas para Multi-tenancy

**Épico:** 09 - Multi-tenancy
**Estimativa:** Alta
**Responsável:** Micael

## Descrição
Como desenvolvedor backend (Micael),
Eu quero introduzir a entidade `Organizacao` e migrar todos os schemas para utilizar `tenantId`,
Para que os dados não fiquem mais presos apenas a um único `userId`, permitindo o compartilhamento em equipe.

## Critérios de Aceite
- **Dado** o schema de Autenticação / Perfil
- **Quando** o usuário logar
- **Então** ele deve estar associado a uma ou mais Organizações.
- **E** todos os schemas (Processos, Clientes, Movimentações) devem aceitar o atributo `tenantId: string`.
