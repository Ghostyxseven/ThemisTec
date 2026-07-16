"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, AlertCircle, X, CheckCircle2 } from "lucide-react";
import { authService, prazoRepository } from "@/services";
import { Prazo } from "@/specs/schemas/prazo.schema";
import Link from "next/link";
import { getAuth } from "firebase/auth";
import { getFirebaseApp } from "@/services/firebase/firebase.client";

const isAtrasado = (dataISO: string) => {
  const today = new Date();
  today.setHours(0,0,0,0);
  const todayStr = today.toISOString().split("T")[0] || "";
  return dataISO < todayStr;
};

const isToday = (dataISO: string) => {
  const todayStr = new Date().toISOString().split("T")[0] || "";
  return dataISO === todayStr;
};

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [prazosUrgentes, setPrazosUrgentes] = useState<Prazo[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchNotificacoes = async () => {
      try {
        const userId = authService.getCurrentUserId();
        if (!userId) return;

        const todosPrazos = await prazoRepository.listarPorUsuario(userId);
        
        // Filtrar pendentes de hoje ou atrasados
        const urgentes = todosPrazos.filter(p => 
          p.status === "PENDENTE" && (isAtrasado(p.dataVencimento) || isToday(p.dataVencimento))
        );
        
        // Ordenar por data crescente
        urgentes.sort((a, b) => a.dataVencimento.localeCompare(b.dataVencimento));
        
        setPrazosUrgentes(urgentes);
        
        // Mostrar toast se houver urgentes
        if (urgentes.length > 0) {
          setShowToast(true);
          // Auto-hide toast after 6 seconds
          setTimeout(() => setShowToast(false), 6000);
        }
      } catch (error) {
        console.error("Erro ao buscar notificações", error);
      }
    };

    // Usar onAuthStateChanged para garantir que o auth inicializou
    const auth = getAuth(getFirebaseApp());
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        void fetchNotificacoes();
      }
    });

    return () => unsubscribe();
  }, []);

  // Fechar dropdown clicando fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const itemCount = prazosUrgentes.length;

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`relative p-2.5 rounded-xl transition-all ${isOpen ? 'bg-primary/10 text-primary' : 'text-slate-400 hover:text-primary hover:bg-primary/5'}`}
        >
          <Bell className="h-5 w-5" />
          {itemCount > 0 && (
            <span className="absolute top-2 right-2 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 border-2 border-white"></span>
            </span>
          )}
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white border border-slate-100 shadow-xl z-50 overflow-hidden transform origin-top-right transition-all">
            <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800">Notificações</h3>
              <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full">
                {itemCount} {itemCount === 1 ? 'pendente' : 'pendentes'}
              </span>
            </div>
            
            <div className="max-h-80 overflow-y-auto">
              {itemCount === 0 ? (
                <div className="px-4 py-8 text-center text-slate-500 text-sm flex flex-col items-center">
                  <CheckCircle2 className="h-8 w-8 text-emerald-400 mb-2 opacity-50" />
                  <p>Tudo em dia!</p>
                  <p className="text-xs text-slate-400">Nenhum prazo urgente.</p>
                </div>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {prazosUrgentes.map((prazo) => {
                    const hoje = isToday(prazo.dataVencimento);
                    return (
                      <li key={prazo.id} className="p-4 hover:bg-slate-50 transition-colors">
                        <Link href="/prazos" onClick={() => setIsOpen(false)} className="block">
                          <div className="flex items-start gap-3">
                            <div className={`mt-0.5 flex-shrink-0 h-2 w-2 rounded-full ${hoje ? 'bg-amber-500' : 'bg-red-500'}`} />
                            <div>
                              <p className="text-sm font-semibold text-slate-800 mb-0.5">
                                {prazo.titulo}
                              </p>
                              <p className="text-xs text-slate-500 font-mono mb-1">
                                {prazo.processoNumero}
                              </p>
                              <span className={`text-[10px] font-bold uppercase tracking-wider ${hoje ? 'text-amber-600' : 'text-red-600'}`}>
                                {hoje ? 'Vence Hoje' : 'Atrasado'}
                              </span>
                            </div>
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
            
            {itemCount > 0 && (
              <div className="p-2 border-t border-slate-100 bg-slate-50">
                <Link 
                  href="/prazos" 
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center py-2 text-xs font-semibold text-primary hover:text-primary-dark transition-colors"
                >
                  Ver todos na Agenda
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Floating Toast Notification */}
      {showToast && itemCount > 0 && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden w-80">
            <div className={`h-1.5 w-full ${isAtrasado(prazosUrgentes[0]?.dataVencimento || '') ? 'bg-red-500' : 'bg-amber-500'}`}></div>
            <div className="p-4 relative">
              <button 
                onClick={() => setShowToast(false)}
                className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="flex gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <AlertCircle className={`h-5 w-5 ${isAtrasado(prazosUrgentes[0]?.dataVencimento || '') ? 'text-red-500' : 'text-amber-500'}`} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Atenção aos Prazos!</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Você tem <strong>{itemCount} {itemCount === 1 ? 'prazo' : 'prazos'}</strong> exigindo sua atenção hoje.
                  </p>
                  <Link 
                    href="/prazos"
                    onClick={() => setShowToast(false)} 
                    className="inline-block mt-3 text-xs font-bold text-primary hover:text-primary-dark transition-colors"
                  >
                    Abrir Agenda &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
