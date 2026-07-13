"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Scale } from "lucide-react";

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
          className="fixed inset-0 z-40 bg-gray-900/80 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-[#0f2540] text-gray-300 shadow-xl transition-transform duration-300 ease-in-out lg:static lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex h-16 shrink-0 items-center px-6 border-b border-white/5 bg-[#1a3c5e]">
          <span className="text-xl font-bold tracking-widest text-white">Themis<span className="text-[#c9a84c]">Tec</span></span>
        </div>

        <nav className="flex flex-1 flex-col overflow-y-auto px-4 py-6">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <div className="text-xs font-semibold leading-6 text-gray-400 uppercase tracking-wider mb-2 px-2">Menu Principal</div>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname?.startsWith(item.href);
                  const Icon = item.icon;
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        onClick={() => onClose()}
                        className={`
                          group flex gap-x-3 rounded-md p-2.5 text-sm font-medium leading-6 transition-colors
                          ${
                            isActive
                              ? "bg-white/10 text-white"
                              : "text-gray-300 hover:bg-white/5 hover:text-white"
                          }
                        `}
                      >
                        <Icon className={`h-5 w-5 shrink-0 ${isActive ? "text-white" : "text-gray-400 group-hover:text-white"}`} aria-hidden="true" />
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}
