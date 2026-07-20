# Spec 43: Atualização da Timeline de Processos (Frontend)

## Arquivos a Modificar
1. **`src/components/ui/Timeline.tsx` (ou componente similar de view de Movimentações)**
   - Modificar a renderização do item da lista.
   - Incluir verificação condicional: `movimentacao.origemCaptura === "automatica"`.
   - Inserir badge do Tailwind: `<span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Captura Automática</span>`.
   - Se automática, desabilitar ou ocultar o botão de edição.

## Validação
- Executar `npm run typecheck`.
- Visualizar mock de movimentação automática na interface localmente.
