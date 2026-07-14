"use client";

import { useRouter } from "next/navigation";
import { FirebaseAuthAdapter } from "@/services/firebase/FirebaseAuthAdapter";
import { IAuthService } from "@/shared/interfaces/IAuthService";
import { Menu, Bell, LogOut } from "lucide-react";

const authService: IAuthService = new FirebaseAuthAdapter();

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
        {/* Notification Bell */}
        <button
          type="button"
          className="relative p-2.5 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary-light ring-2 ring-white"></span>
        </button>

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
