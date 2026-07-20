# Story 41: Infraestrutura de Sincronização de Processos

**Épico:** 08 - Integração com Tribunais
**Estimativa:** Média
**Responsável:** Micael

## Descrição
Como desenvolvedor backend (Micael),
Eu quero criar uma infraestrutura de sincronização (Supabase Edge Function) e atualizar os schemas,
Para que possamos capturar e salvar automaticamente novas movimentações processuais de provedores externos.

## Critérios de Aceite
- **Dado** o schema de Movimentação
- **Quando** ocorrer uma nova atualização
- **Então** o Zod deve aceitar os campos opcionais `origem_captura` e `id_integracao`.

- **Dado** o Supabase
- **Quando** o job de sincronização rodar
- **Então** ele deve buscar as movimentações (via um Mock Adapter) e salvá-las na tabela correspondente associada ao processo correto.
