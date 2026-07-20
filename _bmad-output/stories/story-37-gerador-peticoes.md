# Story 37: Gerador Automático de Petições e Documentos

## Contexto e Valor de Negócio
**Epic:** Epic 04 - Automação Avançada (Feature Extra MVP)
**User Story:** Como advogado autônomo, eu quero gerar petições e procurações automaticamente a partir de um template `.docx`, para economizar tempo no preenchimento de dados repetitivos (qualificação do cliente, etc).

## Acceptance Criteria
- [ ] O sistema deve permitir que o usuário faça o upload de um arquivo `.docx` contendo tags estruturadas (ex: `{{nome_cliente}}`).
- [ ] O sistema deve exibir uma tela onde o usuário seleciona um Cliente e um Template.
- [ ] Ao clicar em "Gerar", o sistema deve baixar um novo arquivo `.docx` com as tags substituídas pelos dados do banco de dados.
- [ ] A arquitetura deve seguir o padrão MVVM estabelecido (Adapter, ViewModel, View).

## Requisitos Técnicos
- Utilizar `docxtemplater`, `pizzip` e `file-saver` no front-end.
- Criar a tabela `document_templates` no Supabase com suporte a RLS (Row Level Security).
- A interface deve ser incorporada na área `(authenticated)`.
