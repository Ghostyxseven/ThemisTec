# Spec 23: Consulta de Prazos (Lista/Agenda)

## 1. Objetivo
Descrever a implementação da tela principal de gestão de prazos (Agenda Jurídica), onde o usuário poderá consultar, filtrar e interagir com as datas críticas (marcar como concluído).

## 2. Escopo
- Adição da rota e link no componente de `Sidebar` (Agenda Jurídica).
- Página principal `/prazos` com listagem de todos os prazos do advogado, ordenados por proximidade.
- Identificação visual para urgência (Atrasados e Vencendo Hoje).
- Implementação de funcionalidade para mudar o status de um prazo para "CONCLUIDO".

## 3. Detalhamento Técnico

### 3.1. Navegação (Sidebar)
- Incluir o item de navegação para a rota `/prazos` usando o ícone `Calendar`.

### 3.2. Listagem de Prazos (Repositório)
- O `FirestorePrazoAdapter` deve implementar o método `listarPorUsuario(userId)` realizando uma query na coleção `prazos`, ordenada ascendente por `dataVencimento`.
- O `FirestorePrazoAdapter` também deve implementar `marcarConcluido(userId, prazoId)` para atualizar a propriedade `status`.

### 3.3. Interface Gráfica (Listagem)
- O arquivo `prazos/page.tsx` exibirá uma tabela de prazos ou um "Empty State" elegante caso a agenda esteja vazia.
- **Lógica Visual de Datas:**
  - Se dataVencimento < dataAtual: Mostrar como Atrasado (Vermelho/Alerta).
  - Se dataVencimento == dataAtual: Mostrar como "HOJE" (Âmbar).
- Ação na tabela (botão "Concluir") deve acionar a atualização do status chamando o hook `useListPrazos`.

### Arquivos Modificados/Criados
1. `src/components/layout/Sidebar.tsx` [MODIFY]
2. `src/app/(authenticated)/prazos/page.tsx` [NEW]
3. `src/app/(authenticated)/prazos/useListPrazos.ts` [NEW]
4. `src/services/firebase/FirestorePrazoAdapter.ts` [MODIFY]

## 4. Testes e Validação
- Validar renderização do Empty State quando a coleção está vazia.
- Inserir um prazo manualmente com data de ontem e garantir que ele renderiza como Atrasado.
- Inserir prazo para hoje e garantir visualização de advertência (Hojee).
- Clicar em concluir um prazo e verificar se desaparece a opção, atualizando seu status.
