import { useState, useEffect } from "react";
import { supabaseClient } from "@/services/supabase/supabase.client";

export function useListCobrancas(clienteId?: string) {
  const [cobrancas, setCobrancas] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!clienteId) return;

    const fetchCobrancas = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Em um sistema real poderíamos usar o SupabaseCobrancaAdapter no servidor via Server Actions,
        // mas como este é Client Side, fazemos a chamada direta no banco respeitando RLS.
        const { data, error: sbError } = await supabaseClient
          .from("cobrancas")
          .select("*, processos(numero)")
          .eq("cliente_id", clienteId)
          .order("vencimento", { ascending: true });

        if (sbError) throw sbError;
        setCobrancas(data || []);
      } catch (err: any) {
        setError(err.message || "Erro ao carregar cobranças");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCobrancas();
  }, [clienteId]);

  return { cobrancas, isLoading, error };
}
