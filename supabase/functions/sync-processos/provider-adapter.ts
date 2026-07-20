export async function fetchMovimentacoesProvider(processoIdIntegracao: string) {
  // Mock function representing the adapter for Jusbrasil/Escavador API
  console.log(`Fetching from external provider for ${processoIdIntegracao}`);
  return [
    {
      id_externo: "ext-12345",
      titulo: "Juntada de Petição",
      descricao: "Petição anexada automaticamente pelo sistema",
      data: new Date().toISOString(),
    }
  ];
}
