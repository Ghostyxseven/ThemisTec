import type { ReactNode } from "react";
import { WifiOff } from "lucide-react";
import Link from "next/link";

export default function OfflinePage(): ReactNode {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <div className="flex flex-col items-center gap-6 max-w-sm">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
          <WifiOff className="h-10 w-10 text-slate-400" />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-foreground">Sem conexão</h1>
          <p className="mt-2 text-sm text-slate-500">
            Você está offline. As páginas que você visitou recentemente ainda
            estão disponíveis. Verifique sua conexão e tente novamente.
          </p>
        </div>

        <Link
          href="/"
          className="rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary-dark"
        >
          Tentar novamente
        </Link>
      </div>
    </main>
  );
}
