import type { ReactElement } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtVerify } from "jose";
import { ExternalLink, FileText, LogOut, ReceiptText, WalletCards } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { SupabasePortalAdapter } from "@/features/portal-cliente/model/SupabasePortalAdapter";
import type { Cobranca } from "@/specs/schemas/cobranca.schema";

type PortalCobranca = Cobranca & {
  processoNumero?: string | null;
};

const JWT_SECRET = new TextEncoder().encode(
  process.env.SUPABASE_JWT_SECRET || "sua_chave_secreta_padrao_para_desenvolvimento"
);

const processoStatusClasses: Record<string, string> = {
  em_andamento: "bg-violet-50 text-violet-700 ring-violet-200",
  concluido: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  arquivado: "bg-slate-100 text-slate-700 ring-slate-200",
};

const cobrancaStatusClasses: Record<string, string> = {
  PAGA: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  VENCIDA: "bg-red-50 text-red-700 ring-red-200",
  CANCELADA: "bg-slate-100 text-slate-700 ring-slate-200",
  PENDENTE: "bg-amber-50 text-amber-700 ring-amber-200",
};

const formatCurrency = (value: number | string): string =>
  Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

const formatDate = (value: string): string => new Date(value).toLocaleDateString("pt-BR");

export default async function PortalDashboardPage(): Promise<ReactElement> {
  const cookieStore = await cookies();
  const token = cookieStore.get("portal_token")?.value;

  if (!token) {
    redirect("/portal");
  }

  let payload;
  try {
    const { payload: jwtPayload } = await jwtVerify(token, JWT_SECRET);
    payload = jwtPayload;
  } catch {
    redirect("/portal");
  }

  const clienteId = payload.sub as string;
  const nome = payload.nome as string;

  const adapter = new SupabasePortalAdapter();
  const processos = await adapter.listarProcessos(clienteId);
  const rawCobrancas: unknown = await adapter.listarCobrancas(clienteId);
  const cobrancas = Array.isArray(rawCobrancas) ? (rawCobrancas as PortalCobranca[]) : [];

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 flex flex-col gap-4 rounded-2xl border border-white/60 bg-white/80 p-5 shadow-soft backdrop-blur md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-violet-700">Portal do Cliente</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-normal text-textPrimary">
              Meu Portal
            </h1>
            <p className="mt-1 text-textSecondary">Ola, {nome}</p>
          </div>
          <form action="/api/portal/logout" method="POST">
            <Button type="submit" variant="outline" size="sm">
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Sair
            </Button>
          </form>
        </header>

        <div className="grid grid-cols-1 gap-6">
          <section>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <FileText className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-textPrimary">Meus Processos</h2>
                <p className="text-sm text-textSecondary">
                  {processos.length} registro(s) encontrado(s)
                </p>
              </div>
            </div>

            <div className="grid gap-4">
              {processos.length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="flex flex-col items-center p-8 text-center">
                    <FileText className="mb-3 h-9 w-9 text-slate-300" aria-hidden="true" />
                    <p className="text-sm text-textSecondary">
                      Voce nao possui processos cadastrados no momento.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                processos.map((proc) => (
                  <Card key={proc.id} hoverable>
                    <CardContent className="p-5">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-xs font-medium uppercase text-textSecondary">
                            Processo
                          </p>
                          <h3 className="mt-1 text-lg font-semibold text-textPrimary">
                            {proc.numero || "Sem numero"}
                          </h3>
                          <div className="mt-3 flex flex-wrap gap-2 text-sm text-textSecondary">
                            <span>Tipo: {proc.tipo}</span>
                            <span className="hidden text-slate-300 sm:inline">/</span>
                            <span>Aberto em: {formatDate(proc.dataAbertura)}</span>
                          </div>
                        </div>
                        <span
                          className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-medium ring-1 ${
                            processoStatusClasses[proc.status] ??
                            processoStatusClasses.em_andamento
                          }`}
                        >
                          {proc.status.replace("_", " ")}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </section>

          <section>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <WalletCards className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-textPrimary">Minhas Faturas</h2>
                <p className="text-sm text-textSecondary">
                  {cobrancas.length} cobranca(s) encontrada(s)
                </p>
              </div>
            </div>

            <div className="grid gap-4">
              {cobrancas.length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="flex flex-col items-center p-8 text-center">
                    <ReceiptText className="mb-3 h-9 w-9 text-slate-300" aria-hidden="true" />
                    <p className="text-sm text-textSecondary">
                      Nenhuma cobranca em aberto no momento.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                cobrancas.map((cob) => (
                  <Card key={cob.id} hoverable>
                    <CardHeader className="pb-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <CardTitle>{formatCurrency(cob.valor)}</CardTitle>
                          <p className="mt-1 text-sm text-textSecondary">
                            Vencimento: {formatDate(`${cob.vencimento}T12:00:00Z`)}
                          </p>
                          {cob.processoNumero && (
                            <p className="mt-1 text-sm text-textSecondary">
                              Ref: Proc. {cob.processoNumero}
                            </p>
                          )}
                        </div>
                        <span
                          className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-medium ring-1 ${
                            cobrancaStatusClasses[cob.status] ?? cobrancaStatusClasses.PENDENTE
                          }`}
                        >
                          {cob.status}
                        </span>
                      </div>
                    </CardHeader>
                    {cob.status === "PENDENTE" && cob.linkPagamento && (
                      <CardContent className="pt-0">
                        <a
                          href={cob.linkPagamento}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-xl bg-violet-50 px-3 py-2 text-sm font-medium text-violet-700 transition-all hover:-translate-y-0.5 hover:bg-violet-100 focus:outline-none focus:ring-2 focus:ring-violet-500/70 focus:ring-offset-2"
                        >
                          Pagar via Pix / Boleto
                          <ExternalLink className="h-4 w-4" aria-hidden="true" />
                        </a>
                      </CardContent>
                    )}
                  </Card>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
