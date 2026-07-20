"use client";

import { useEffect, useState } from "react";
import { supabaseClient } from "@/services/supabase/supabase.client";
import { Button } from "@/components/ui/Button";

type Membro = {
  id: string;
  user_id: string;
  papel: string;
  criado_em: string;
};

export default function EquipePage() {
  const [membros, setMembros] = useState<Membro[]>([]);
  const [loading, setLoading] = useState(true);
  const [emailConvite, setEmailConvite] = useState("");

  useEffect(() => {
    async function loadEquipe() {
      const { data, error } = await supabaseClient
        .from("escritorio_usuarios")
        .select("*");
        
      if (!error && data) {
        setMembros(data);
      }
      setLoading(false);
    }
    loadEquipe();
  }, []);

  const handleConvidar = async () => {
    // Para fins de POC: na vida real isso dispara um magic link de convite.
    alert(`Convite enviado para ${emailConvite} (Simulação)`);
    setEmailConvite("");
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-100">Equipe e Convites</h1>
          <p className="text-zinc-400">Gerencie os membros do seu escritório.</p>
        </div>
      </div>

      <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-xl font-medium text-zinc-100 mb-4">Adicionar Novo Membro</h2>
        <div className="flex space-x-4">
          <input
            type="email"
            value={emailConvite}
            onChange={(e) => setEmailConvite(e.target.value)}
            placeholder="e-mail do colega"
            className="flex-1 rounded-xl bg-zinc-800/50 border border-zinc-700 px-4 py-2 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-600"
          />
          <Button onClick={handleConvidar} variant="primary">Enviar Convite</Button>
        </div>
      </div>

      <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-xl font-medium text-zinc-100 mb-4">Membros Atuais</h2>
        {loading ? (
          <p className="text-zinc-500">Carregando...</p>
        ) : membros.length === 0 ? (
          <p className="text-zinc-500">Nenhum membro encontrado.</p>
        ) : (
          <div className="space-y-4">
            {membros.map((m) => (
              <div key={m.id} className="flex justify-between items-center bg-zinc-800/30 p-4 rounded-xl border border-zinc-800/80">
                <div>
                  <p className="font-medium text-zinc-200">{m.user_id}</p>
                  <p className="text-sm text-zinc-500">Membro desde {new Date(m.criado_em).toLocaleDateString()}</p>
                </div>
                <span className="px-3 py-1 bg-zinc-700/50 text-zinc-300 rounded-full text-xs font-semibold uppercase tracking-wider">
                  {m.papel}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
