"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { LayoutDashboard, Users, Scale, ChevronDown, Calendar, User as UserIcon, LogOut } from "lucide-react";
import { authService } from "@/services";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Clientes", href: "/clientes", icon: Users },
  { name: "Processos", href: "/processos", icon: Scale },
  { name: "Agenda Jurídica", href: "/prazos", icon: Calendar },
];

export function Sidebar({ isOpen, onClose }: SidebarProps): React.JSX.Element {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState("Carregando...");
  const [userInitial, setUserInitial] = useState("");
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
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        aria-label="Menu lateral"
        className={`
          fixed inset-y-0 left-0 z-50 flex w-64 flex-col
          bg-gradient-to-b from-sidebar-from to-sidebar-to
          shadow-2xl transition-transform duration-300 ease-in-out
          lg:static lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo */}
        <div className="flex h-16 shrink-0 items-center gap-3 px-6 border-b border-white/5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-light/20">
            <Scale className="h-5 w-5 text-primary-light" />
          </div>
          <span className="text-lg font-bold tracking-wide text-white">
            Themis<span className="text-primary-light">Tec</span>
          </span>
        </div>

        {/* Navigation */}
        <nav aria-label="Navegação principal" className="flex flex-1 flex-col overflow-y-auto px-4 py-6">
          <div className="text-[10px] font-semibold text-indigo-300/40 uppercase tracking-[0.15em] mb-4 px-3">
            Menu Principal
          </div>
          <ul role="list" className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname?.startsWith(item.href);
              const Icon = item.icon;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={() => onClose()}
                    className={`
                      relative group flex items-center gap-x-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300 overflow-hidden
                      ${
                        isActive
                          ? "bg-primary-light/15 text-white font-semibold"
                          : "text-indigo-200/70 hover:bg-white/5 hover:text-white"
                      }
                    `}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-light shadow-[0_0_8px_rgba(255,255,255,0.1)] rounded-r-full"></div>
                    )}
                    <Icon
                      className={`h-5 w-5 shrink-0 transition-all duration-300 group-hover:scale-110 ${
                        isActive ? "text-primary-light drop-shadow-md" : "text-indigo-300/50 group-hover:text-white"
                      }`}
                      aria-hidden="true"
                    />
                    <span className="truncate">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom section - Promo card */}
        <div className="px-4 pb-4 space-y-4">

          {/* User Profile */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              aria-expanded={showDropdown}
              aria-controls="menu-usuario"
              onClick={() => setShowDropdown(!showDropdown)}
              className="group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 text-emerald-400 font-bold text-sm ring-2 ring-emerald-500/30 group-hover:ring-emerald-400/50 transition-all duration-300">
                {userInitial || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate group-hover:text-emerald-50 transition-colors">{userName}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                  </div>
                  <p className="text-[11px] font-medium tracking-wide text-indigo-300/60 uppercase">Administrador</p>
                </div>
              </div>
              <ChevronDown className={`h-4 w-4 shrink-0 text-indigo-300/40 transition-transform duration-300 group-hover:text-indigo-200 ${showDropdown ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div id="menu-usuario" className="absolute bottom-[calc(100%+8px)] left-0 w-full rounded-xl bg-sidebar-to border border-white/10 shadow-2xl overflow-hidden z-50 py-1">
                <Link 
                  href="/perfil"
                  onClick={() => setShowDropdown(false)}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-indigo-200 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <UserIcon className="h-4 w-4" />
                  Meu Perfil
                </Link>
                <button 
                  onClick={() => { void handleLogout(); }}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-colors"
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
