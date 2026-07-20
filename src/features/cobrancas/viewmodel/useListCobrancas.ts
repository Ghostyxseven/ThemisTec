import { useState, useEffect } from "react";
import { supabaseClient } from "@/services/supabase/supabase.client";
import type { Cobranca, CobrancaRow } from "@/specs/schemas/cobranca.schema";
import { cobrancaRowToDomain } from "@/specs/schemas/cobranca.schema";

export type CobrancaComProcesso = Cobranca & { processoNumero?: string | null };

export function useListCobrancas(clienteId?: string) {
  const [cobrancas, setCobrancas] = useState<CobrancaComProcesso[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!clienteId) return;

    const fetchCobrancas = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { data, error: sbError } = await supabaseClient
          .from("cobrancas")
          .select("*, processos(numero)")
          .eq("cliente_id", clienteId)
          .order("vencimento", { ascending: true });

        if (sbError) throw sbError;
        const mapped = (data || []).map((row) => {
          const base = cobrancaRowToDomain(row as CobrancaRow);
          return { ...base, processoNumero: row.processos?.numero ?? null };
        });
        setCobrancas(mapped);
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
