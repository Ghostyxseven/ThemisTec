---
epic: epic-03-automacao
title: Geração de Petições via Templates
status: todo
---

# Story 43: Geração de Petições (Templates Fixos)

**Como** um advogado autônomo
**Eu quero** gerar documentos `.docx` preenchidos automaticamente com os dados dos meus clientes e processos
**Para que** eu ganhe tempo na elaboração de peças e evite erros de digitação.

## Critérios de Aceitação

1. O sistema deve permitir o download de um `.docx` processado a partir de um template salvo na tabela `document_templates`.
2. A biblioteca `docxtemplater` deve ser usada para injetar variáveis (tags de merge) no documento mantendo a formatação original.
3. A API deve cruzar o ID do processo com os dados do cliente e preencher chaves como `{{cliente_nome}}`, `{{cliente_cpf}}` e `{{processo_numero}}`.

## Limites (Harness)
- Apenas processar `.docx`. Não precisa converter para PDF neste momento.
- A requisição de geração deve ser protegida por RLS e verificar se o usuário é dono do processo e do template.
