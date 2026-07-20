"use client";

import { useState, useEffect } from "react";
import { User, Mail, Shield, Building2 } from "lucide-react";
import { authService } from "@/services";
import { supabaseClient } from "@/services/supabase/supabase.client";

export function PerfilView(): React.JSX.Element {
  const [userName, setUserName] = useState("Carregando...");
  const [userEmail, setUserEmail] = useState("");
  const [userPapel, setUserPapel] = useState("Carregando...");
  const [userEscritorio, setUserEscritorio] = useState("Carregando...");
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((user) => {
      if (user) {
        setUserName(user.displayName || user.email?.split("@")[0] || "Usuário");
        setUserEmail(user.email || "");
        setNewName(user.displayName || "");
        void loadEscritorio(user.id);
      }
    });
    return () => unsubscribe();
  }, []);

  const loadEscritorio = async (userId: string): Promise<void> => {
    const { data: vinculo } = await supabaseClient
      .from("escritorio_usuarios")
      .select("papel, escritorio_id")
      .eq("user_id", userId)
      .limit(1)
      .single();

    if (vinculo) {
      setUserPapel(vinculo.papel === "admin" ? "Administrador" : "Membro");
      const { data: esc } = await supabaseClient
        .from("escritorios")
        .select("nome")
        .eq("id", vinculo.escritorio_id)
        .single();
      setUserEscritorio(esc?.nome || "Não definido");
    } else {
      setUserPapel("Sem vínculo");
      setUserEscritorio("Nenhum");
    }
  };

  const handleSave = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      await authService.updateDisplayName(newName);
      setUserName(newName);
      setIsEditing(false);
    } catch {
      setErrorMessage("Erro ao atualizar perfil.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 px-4 py-8 md:px-8 lg:px-10">
      <div className="max-w-3xl mx-auto space-y-6 animate-fade-in-up">
        <div>
          <h1 className="page-title">Meu Perfil</h1>
          <p className="page-subtitle">Gerencie suas informações pessoais</p>
        </div>

        {errorMessage && (
          <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        <div className="rounded-2xl bg-white border border-slate-200/60 shadow-soft p-6">
          <div className="flex items-center gap-5 mb-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 text-2xl font-bold">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">{userName}</h2>
              <div className="flex items-center gap-4 mt-1">
                <p className="text-sm text-slate-500 flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5 text-violet-500" /> {userPapel}
                </p>
                <p className="text-sm text-slate-500 flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-blue-500" /> {userEscritorio}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Nome de Exibição</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <User className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={isEditing ? newName : userName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="block w-full rounded-xl border border-slate-300 py-2.5 pl-10 text-sm text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 disabled:bg-slate-50 disabled:text-slate-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">E-mail</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="h-4 w-4 text-slate-400" />
                </div>
                <input type="email" disabled value={userEmail} className="block w-full rounded-xl border border-slate-300 py-2.5 pl-10 text-sm bg-slate-50 text-slate-500 cursor-not-allowed" />
              </div>
              <p className="mt-1.5 text-xs text-slate-400">O e-mail é gerenciado pelo administrador da plataforma.</p>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3 border-t border-slate-100 pt-6">
            {isEditing ? (
              <>
                <button type="button" onClick={() => { setIsEditing(false); setNewName(userName); }} className="px-4 py-2 rounded-xl border border-slate-300 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">Cancelar</button>
                <button type="button" onClick={() => { void handleSave(); }} disabled={isLoading} className="px-4 py-2 rounded-xl bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors">{isLoading ? "Salvando..." : "Salvar"}</button>
              </>
            ) : (
              <button type="button" onClick={() => setIsEditing(true)} className="px-4 py-2 rounded-xl border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">Editar Perfil</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
