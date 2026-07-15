"use client";

import { useRouter } from "next/navigation";
import { authService } from "@/services";
import { Menu, LogOut } from "lucide-react";
import { NotificationBell } from "./NotificationBell";

interface HeaderProps {
  onOpenSidebar: () => void;
}

export function Header({ onOpenSidebar }: HeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await authService.logout();
      router.push("/login");
    } catch (error) {
      console.error("Erro ao deslogar", error);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-x-4 border-b border-slate-200/60 bg-white/90 backdrop-blur-md px-4 sm:px-6 lg:px-8">
      {/* Mobile Menu Button */}
      <button
        type="button"
        className="p-2 text-slate-500 hover:text-primary hover:bg-primary/5 rounded-xl transition-all lg:hidden"
        onClick={onOpenSidebar}
      >
        <span className="sr-only">Abrir sidebar</span>
        <Menu className="h-5 w-5" />
      </button>

      {/* Separator for mobile */}
      <div className="h-6 w-px bg-slate-200 lg:hidden" aria-hidden="true" />

      <div className="flex flex-1 items-center justify-end gap-x-3">
        <NotificationBell />

        {/* Logout */}
        <button
          onClick={() => { void handleLogout(); }}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition-all duration-200 hover:bg-slate-50 hover:border-slate-300 hover:shadow-md active:scale-95"
        >
          <LogOut className="h-4 w-4" />
          Sair
        </button>
      </div>
    </header>
  );
}
