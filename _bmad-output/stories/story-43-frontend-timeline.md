# Story 43: Atualização da Timeline de Processos (Frontend)

**Épico:** 08 - Integração com Tribunais
**Estimativa:** Baixa
**Responsável:** Josiane

## Descrição
Como advogado (usuário final),
Eu quero ver as movimentações sincronizadas automaticamente destacadas na timeline do meu processo,
Para que eu consiga diferenciar facilmente os andamentos gerados pelo sistema e os que eu inseri manualmente.

## Critérios de Aceite
- **Dado** a interface de visualização de movimentações do Processo
- **Quando** a movimentação tiver `origemCaptura === "automatica"`
- **Então** ela deve apresentar uma badge visual (ex: ícone "Bot" ou "Automático").
- **E** a edição de texto para esses registros deve ser desabilitada (garantindo integridade do dado capturado).
