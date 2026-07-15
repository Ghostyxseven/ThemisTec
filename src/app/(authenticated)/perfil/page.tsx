"use client";

import { useState, useEffect } from "react";
import { getAuth, updateProfile } from "firebase/auth";
import { getFirebaseApp } from "@/services/firebase/firebase.client";
import { User, Mail, Shield } from "lucide-react";

export default function PerfilPage() {
  const [userName, setUserName] = useState("Carregando...");
  const [userEmail, setUserEmail] = useState("Carregando...");
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const auth = getAuth(getFirebaseApp());
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserName(user.displayName || "Usuário");
        setUserEmail(user.email || "");
        setNewName(user.displayName || "");
      } else {
        setUserName("Visitante (Não logado)");
        setUserEmail("visitante@sem-sessao.com");
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const auth = getAuth(getFirebaseApp());
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: newName });
        setUserName(newName);
        setIsEditing(false);
      }
    } catch {
      alert("Erro ao atualizar perfil.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 px-4 py-8 md:px-8 lg:px-10">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Meu <span className="text-primary">Perfil</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Gerencie suas informações pessoais e configurações de conta.
          </p>
        </div>

        <div className="rounded-2xl bg-white border border-slate-100 shadow-soft p-6">
          <div className="flex items-center gap-6 mb-8">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary-light/10 text-primary text-3xl font-bold">
              {userName.charAt(0) ? userName.charAt(0).toUpperCase() : "U"}
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">{userName}</h2>
              <p className="text-slate-500 flex items-center gap-2 mt-1 text-sm font-medium">
                <Shield className="h-4 w-4 text-primary" /> Administrador
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Nome de Exibição
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={isEditing ? newName : userName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="block w-full rounded-xl border border-slate-200 py-2.5 pl-10 text-foreground shadow-sm focus:border-primary focus:ring-primary disabled:bg-slate-50 disabled:text-slate-500 sm:text-sm transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Endereço de E-mail
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  disabled
                  value={userEmail}
                  className="block w-full rounded-xl border border-slate-200 py-2.5 pl-10 text-foreground shadow-sm bg-slate-50 text-slate-500 sm:text-sm cursor-not-allowed"
                />
              </div>
              <p className="mt-2 text-xs text-slate-400">O e-mail não pode ser alterado por aqui.</p>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3 border-t border-slate-100 pt-6">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setNewName(userName);
                  }}
                  className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => { void handleSave(); }}
                  disabled={isLoading}
                  className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark disabled:opacity-50 transition-colors"
                >
                  {isLoading ? "Salvando..." : "Salvar Alterações"}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="rounded-xl bg-primary/10 text-primary px-4 py-2 text-sm font-semibold shadow-sm hover:bg-primary/20 transition-colors"
              >
                Editar Perfil
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
