> REGRA OBRIGATORIA: antes de abrir este PR, crie ou localize a issue relacionada.
> PR sem issue, com template vazio, comentarios HTML ou caixas sem marcar deve ser devolvido para ajuste.

## Resumo

Explique em 1 ou 2 frases o que mudou e por que esta mudanca existe.

Exemplo:
Este PR implementa o login com e-mail e senha usando Firebase Auth. A tela valida os dados com Zod, chama a camada de servico e redireciona o usuario autenticado para o dashboard.

## Issue relacionada

Closes #

Se ainda nao houver issue, pare aqui, crie a issue primeiro e depois volte para abrir o PR.
Se for tecnicamente impossivel vincular uma issue, explique o motivo e como o trabalho sera rastreado:

## Tipo de mudanca

Marque uma ou mais opcoes:

- [ ] `feat` - Nova funcionalidade
- [ ] `fix` - Correcao de bug
- [ ] `docs` - Documentacao
- [ ] `config` - Configuracao (ESLint, tsc, CI)
- [ ] `refactor` - Refatoracao sem mudar comportamento
- [ ] `test` - Testes

## O que foi feito

- 
- 
- 

## User Stories afetadas

Marque somente as US realmente implementadas ou afetadas:

- [ ] US01 - Login
- [ ] US02 - Cadastro
- [ ] US03 - Recuperacao de senha
- [ ] US04 - Cadastro de cliente
- [ ] US05 - Consulta de clientes
- [ ] US06 - Edicao/exclusao de cliente
- [ ] US07 - Registro de processo
- [ ] US08 - Consulta de processos
- [ ] US09 - Anexar PDF
- [ ] Nao se aplica

## Como testar

Descreva o caminho manual para o revisor validar:

1. 
2. 
3. 

## Checklist do Harness

Preencha o resultado real. Se nao rodou, marque como nao executado e explique em "Observacoes".

- [ ] `npm run typecheck` passou
- [ ] `npm run lint` passou
- [ ] `npm run test` passou
- [ ] Codigo respeita os schemas Zod (`src/specs/schemas/`)
- [ ] Codigo segue MVVM (`view -> viewmodel -> model`)
- [ ] Commits seguem Conventional Commits

## Evidencias

Cole prints, logs curtos ou resultado dos comandos quando aplicavel.

```text

```

## Observacoes para o revisor

- 
