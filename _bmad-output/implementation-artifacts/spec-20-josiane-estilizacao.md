# Spec: Estilização de Tabelas, Cards e Empty States (Josiane)

## Escopo
A interface das listagens (Clientes, Processos) e Dashboard não possui estilização visual apropriada, parecendo tabelas HTML cruas ou listas brancas.
Esta especificação orienta a criação de tabelas modernas (com paginação/empty states) e badges de status.

## Passos para o Desenvolvedor
1. Refatorar a listagem em `/clientes` e `/processos` para usar tabelas TailwindCSS.
2. Criar um componente genérico `<Badge />` com suporte a variantes (success, warning, error, info).
3. Criar um componente `<EmptyState />` que aceite um ícone, título e descrição para exibir quando `data.length === 0`.
4. Utilizar `lucide-react` para ilustrações leves nos Empty States.
5. Garantir responsividade (no mobile, as tabelas devem permitir overflow-x ou se transformarem em cards empilhados).

## Critérios de Aceite Atendidos
- As tabelas devem estar estilizadas e legíveis.
- Badges devem refletir os status (ex: "Em Andamento", "Encerrado", "Inadimplente").
- O layout não pode "quebrar" em telas pequenas.
