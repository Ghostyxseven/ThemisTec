"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Scale, ChevronDown } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Clientes", href: "/clientes", icon: Users },
  { name: "Processos", href: "/processos", icon: Scale },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
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
        <nav className="flex flex-1 flex-col overflow-y-auto px-4 py-6">
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
                      group flex items-center gap-x-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200
                      ${
                        isActive
                          ? "bg-primary-light text-white shadow-lg shadow-primary-light/30"
                          : "text-indigo-200/70 hover:bg-white/5 hover:text-white"
                      }
                    `}
                  >
                    <Icon
                      className={`h-5 w-5 shrink-0 transition-colors ${
                        isActive ? "text-white" : "text-indigo-300/50 group-hover:text-white"
                      }`}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom section - Promo card */}
        <div className="px-4 pb-4 space-y-4">
          {/* Help Card */}
          <div className="rounded-xl bg-white/5 backdrop-blur-sm p-4 border border-white/5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light/20 mb-3">
              <Users className="h-5 w-5 text-primary-light" />
            </div>
            <p className="text-sm font-semibold text-white leading-tight">
              Gerencie seus clientes de forma eficiente
              <span className="text-primary-light ml-1">✦</span>
            </p>
            <p className="text-xs text-indigo-300/50 mt-1.5 leading-relaxed">
              Organize, acompanhe e mantenha tudo em dia.
            </p>
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-white/5 transition-colors cursor-pointer">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-sm ring-2 ring-emerald-500/30">
              N
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">Nome do Usuário</p>
              <div className="flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-400"></div>
                <p className="text-xs text-indigo-300/50">Administrador</p>
              </div>
            </div>
            <ChevronDown className="h-4 w-4 text-indigo-300/30" />
          </div>
        </div>
      </div>
    </>
  );
}
