---
tipo: "Story"
épico: "EP03"
id: "STORY-24"
título: "Josiane e a edição/exclusão de processos"
status: "DONE"
---

# A História de Josiane e a edição de processos

Josiane tem usado a ThemisTec para gerenciar seus processos. No entanto, ela percebeu que às vezes comete erros de digitação ao cadastrar o número do processo, ou o status do processo muda de "Em Andamento" para "Concluído", e ela precisa atualizar essa informação. Além disso, se ela cadastra um processo duplicado, ela gostaria de poder apagá-lo.

Ela quer ter opções rápidas na tabela de processos para Editar e Excluir cada registro, assim como ela já tem na gestão de clientes.

## A Necessidade Real
1. Um botão na listagem de processos que abra a tela de edição preenchida com os dados daquele processo.
2. Um botão para excluir o processo (com uma janela de confirmação de segurança).

## O Valor
- Mantém o sistema atualizado e livre de dados sujos.
- Traz tranquilidade para a advogada corrigir erros sem precisar chamar o suporte ou recadastrar tudo.

## O Que Precisa Ser Feito (Critérios de Aceite)
- A tela de listagem de processos deve ter botões "Editar" e "Excluir" em cada linha.
- A exclusão deve exigir uma confirmação do usuário e remover o documento do banco.
- A edição deve reaproveitar o schema de atualização (UpdateProcessoSchema).
- O processo só pode ser editado/excluído por quem o criou.
