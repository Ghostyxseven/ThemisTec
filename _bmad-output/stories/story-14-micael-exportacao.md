---
epic: Epic 02 - Dashboard e Exportação
story_id: US14
title: Serviço de Exportação CSV (Backend)
assignee: Micael (Backend)
status: IN_PROGRESS
---

# US14 - Serviço de Exportação CSV/PDF (Backend)

## Contexto
O advogado precisa exportar seus dados de processos e clientes para enviar a contadores ou salvar em backup. O backend deve prover um serviço capaz de agregar esses dados e gerar um formato exportável (CSV). 

Devido à arquitetura do sistema utilizar exclusivamente o SDK Client do Firebase (sem Server-Side Authentication via cookies), a "Server Action" pensada inicialmente deve ser implementada como um **Serviço de Exportação Client-Side** ou **Service Layer** que busca os dados através dos Repositórios já autenticados e converte a resposta para CSV.

## Requisitos
1. Criar um serviço (ex: `ExportService.ts`).
2. O serviço deve ter um método para exportar os processos em CSV.
3. Deve consultar o `IProcessoRepository` para listar todos os processos do usuário logado.
4. Formatar campos (como statusPagamento, valorHonorarios, datas) para um CSV legível.
5. Retornar os dados do CSV (como `Blob` ou `string`) para que o frontend (Josiane, US15) possa efetuar o download.

## Critérios de Aceite
- [ ] O serviço de exportação existe.
- [ ] O CSV gerado contém cabeçalhos adequados.
- [ ] Campos financeiros são formatados e exportados corretamente.
- [ ] Testes automatizados ou validações de tipagem garantem a estrutura.
