"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { authService } from "@/services";
import { Menu, LogOut, Search } from "lucide-react";
import { NotificationBell } from "./NotificationBell";
import type { AuthUser } from "@/shared/interfaces/IAuthService";

interface HeaderProps {
  onOpenSidebar: () => void;
}

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/clientes": "Clientes",
  "/processos": "Processos",
  "/prazos": "Prazos Jurídicos",
  "/agenda": "Agenda",
  "/financeiro": "Financeiro",
  "/documentos": "Documentos",
  "/perfil": "Meu Perfil",
};

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

export function Header({ onOpenSidebar }: HeaderProps): React.JSX.Element {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async (): Promise<void> => {
    try {
      await authService.logout();
      router.push("/login");
    } catch (error) {
      console.error("Erro ao deslogar", error);
    }
  };

  const currentPage = Object.entries(PAGE_TITLES).find(([path]) => pathname?.startsWith(path))?.[1] ?? "";
  const firstName = user?.displayName?.split(" ")[0] ?? user?.email?.split("@")[0] ?? "";

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center border-b border-slate-200/80 bg-white/95 backdrop-blur-sm px-4 sm:px-6 lg:px-8">
      {/* Mobile Menu Button */}
      <button
        type="button"
        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors lg:hidden"
        onClick={onOpenSidebar}
        aria-label="Abrir menu lateral"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Separator for mobile */}
      <div className="h-6 w-px bg-slate-200 mx-3 lg:hidden" aria-hidden="true" />

      {/* Page Context + Greeting */}
      <div className="hidden lg:flex flex-col">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-900">
            {getGreeting()}{firstName ? `, ${firstName}` : ""}
          </span>
          {firstName && <span className="text-lg">👋</span>}
        </div>
        {currentPage && (
          <span className="text-xs text-slate-400">{currentPage}</span>
        )}
      </div>

      {/* Mobile page title */}
      <div className="lg:hidden">
        <span className="text-sm font-semibold text-slate-900">{currentPage || "ThemisTec"}</span>
      </div>

      {/* Right side */}
      <div className="flex flex-1 items-center justify-end gap-x-2">
        {/* Quick Search - Desktop */}
        <button
          onClick={() => router.push("/documentos")}
          className="hidden md:flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-400 transition-colors hover:border-slate-300 hover:bg-white"
        >
          <Search className="h-4 w-4" />
          <span>Buscar...</span>
          <kbd className="hidden lg:inline-flex h-5 items-center rounded border border-slate-200 bg-white px-1.5 text-[10px] font-medium text-slate-400">⌘K</kbd>
        </button>

        <NotificationBell />

        {/* Logout */}
        <button
          onClick={() => { void handleLogout(); }}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:border-slate-300 active:scale-95"
          title="Sair do sistema"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Sair</span>
        </button>
      </div>
    </header>
  );
}
