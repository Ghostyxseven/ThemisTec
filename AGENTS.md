# ThemisTec Agent Rules

## Regra obrigatoria: issue antes de Pull Request

Antes de criar qualquer Pull Request, a IA deve confirmar que existe uma issue relacionada.

Fluxo obrigatorio:

1. Procurar issue existente que corresponda ao trabalho.
2. Se nao existir, criar a issue antes do PR.
3. Abrir o PR somente depois da issue existir.
4. Colocar `Closes #<numero-da-issue>` no corpo do PR quando o PR tiver como destino a branch padrao (`main`).
5. Se o PR nao puder fechar a issue automaticamente, explicar no PR como a issue sera fechada.

Nao abra PR com template vazio, sem issue relacionada ou com textos de exemplo.

## Checklist antes de criar PR

- Issue existe no GitHub.
- PR aponta para a branch correta.
- Corpo do PR foi preenchido com conteudo real.
- O campo `Issue relacionada` tem `Closes #N` ou uma justificativa objetiva.
- A secao `Como testar` tem passos reais.
- O checklist do harness mostra o resultado real ou explica por que nao foi executado.
