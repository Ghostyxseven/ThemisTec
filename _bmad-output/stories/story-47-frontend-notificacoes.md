# Story 47: Central de Notificações In-App (UI)

**Épico:** 10 - Notificações
**Estimativa:** Baixa (Já pré-implementado)
**Responsável:** Josiane

## Descrição
Como advogado,
Eu quero ter um alerta visual no menu superior (Sininho) sempre que houver prazos vencendo ou atrasados,
Para que eu não precise navegar até a agenda para descobrir o que é urgente.

## Critérios de Aceite
- **Dado** o Navbar superior (`Header.tsx`)
- **Quando** existirem prazos com data de vencimento <= Hoje
- **Então** o ícone de Sino deve exibir uma badge vermelha indicando o número de pendências.
- **E** um painel suspenso (dropdown) deve exibir os títulos e números dos processos urgentes.
- **E** ao carregar o sistema, se houver prazos urgentes, um Toast (aviso flutuante) deve saltar na tela para chamar atenção imediata.
