"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { LayoutDashboard, Users, Scale, ChevronDown, Calendar, User as UserIcon, LogOut, WalletCards, Files, CalendarCheck, Settings, Building2, ShieldCheck } from "lucide-react";
import { authService } from "@/services";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Clientes", href: "/clientes", icon: Users },
  { name: "Processos", href: "/processos", icon: Scale },
  { name: "Prazos", href: "/prazos", icon: CalendarCheck },
  { name: "Agenda", href: "/agenda", icon: Calendar },
  { name: "Financeiro", href: "/financeiro", icon: WalletCards },
  { name: "Documentos", href: "/documentos", icon: Files },
  { name: "Escritório", href: "/configuracoes/equipe", icon: Building2 },
  { name: "Configurações", href: "/configuracoes", icon: Settings },
];

const SUPER_ADMIN_EMAIL = "cardosomicael245@gmail.com";

export function Sidebar({ isOpen, onClose }: SidebarProps): React.JSX.Element {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState("Carregando...");
  const [userInitial, setUserInitial] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async (): Promise<void> => {
    try {
      await authService.logout();
      router.push("/login");
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((user) => {
      if (user) {
        const name = user.displayName || user.email?.split("@")[0] || "Usuário";
        setUserName(name);
        setUserInitial(name.charAt(0).toUpperCase());
        setUserEmail(user.email || "");
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <button
          type="button"
          aria-label="Fechar menu lateral"
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        aria-label="Menu lateral"
        className={`
          fixed inset-y-0 left-0 z-50 flex w-[264px] flex-col
          bg-gradient-to-b from-slate-900 to-slate-950
          shadow-xl transition-transform duration-300 ease-in-out
          lg:static lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo */}
        <div className="flex h-16 shrink-0 items-center gap-3 px-6 border-b border-white/[0.06]">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600">
            <Scale className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold text-white tracking-tight">
            Themis<span className="text-blue-400">Tec</span>
          </span>
        </div>

        {/* Navigation */}
        <nav aria-label="Navegação principal" className="flex flex-1 flex-col overflow-y-auto px-3 py-6">
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-[0.15em] mb-3 px-3">
            Menu Principal
          </p>
          <ul role="list" className="space-y-0.5">
            {navigation.map((item) => {
              const isActive = pathname?.startsWith(item.href);
              const Icon = item.icon;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={() => onClose()}
                    className={`
                      relative flex items-center gap-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150
                      ${
                        isActive
                          ? "bg-blue-600/10 text-blue-400"
                          : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-200"
                      }
                    `}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-[3px] bg-blue-500 rounded-r-full" />
                    )}
                    <Icon
                      className={`h-[18px] w-[18px] shrink-0 ${
                        isActive ? "text-blue-400" : "text-slate-500"
                      }`}
                      aria-hidden="true"
                    />
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Super Admin link - só aparece para o admin da plataforma */}
          {userEmail === SUPER_ADMIN_EMAIL && (
            <div className="mt-6 pt-4 border-t border-white/[0.06]">
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-[0.15em] mb-3 px-3">
                Plataforma
              </p>
              <Link
                href="/admin"
                onClick={() => onClose()}
                className={`
                  relative flex items-center gap-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150
                  ${
                    pathname?.startsWith("/admin")
                      ? "bg-blue-600/10 text-blue-400"
                      : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-200"
                  }
                `}
              >
                {pathname?.startsWith("/admin") && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-[3px] bg-blue-500 rounded-r-full" />
                )}
                <ShieldCheck className={`h-[18px] w-[18px] shrink-0 ${pathname?.startsWith("/admin") ? "text-blue-400" : "text-slate-500"}`} aria-hidden="true" />
                <span>Super Admin</span>
              </Link>
            </div>
          )}
        </nav>

        {/* User Profile */}
        <div className="px-3 pb-4">
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              aria-expanded={showDropdown}
              aria-controls="menu-usuario"
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left hover:bg-white/[0.04] border border-transparent hover:border-white/[0.06] transition-all cursor-pointer"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600/20 text-blue-400 text-sm font-bold ring-1 ring-blue-500/30">
                {userInitial || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-200 truncate">{userName}</p>
                <p className="text-[11px] text-slate-500">Advogado</p>
              </div>
              <ChevronDown className={`h-4 w-4 shrink-0 text-slate-500 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div id="menu-usuario" className="absolute bottom-[calc(100%+4px)] left-0 w-full rounded-lg bg-slate-800 border border-white/10 shadow-2xl overflow-hidden z-50 py-1">
                <Link 
                  href="/perfil"
                  onClick={() => setShowDropdown(false)}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors"
                >
                  <UserIcon className="h-4 w-4" />
                  Meu Perfil
                </Link>
                <button 
                  onClick={() => { void handleLogout(); }}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Sair
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
