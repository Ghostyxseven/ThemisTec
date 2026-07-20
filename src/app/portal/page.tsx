"use client";

import type { ReactElement } from "react";
import { CalendarDays, IdCard, LockKeyhole, Scale } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PortalLoginSchema, type PortalLoginInput } from "@/specs/schemas/portal.schema";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { usePortalAuth } from "@/features/portal-cliente/viewmodel/usePortalAuth";

export default function PortalLoginPage(): ReactElement {
  const { login, loading } = usePortalAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PortalLoginInput>({
    resolver: zodResolver(PortalLoginSchema),
  });

  return (
    <main className="flex min-h-screen items-center justify-center bg-primary p-4 text-white">
      <div className="w-full max-w-md">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-violet-200 shadow-soft ring-1 ring-white/15">
            <Scale className="h-7 w-7" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-semibold tracking-normal">Portal do Cliente</h1>
          <p className="mt-2 max-w-sm text-sm leading-6 text-slate-300">
            Acompanhe processos e faturas em um ambiente seguro da ThemisTec.
          </p>
        </div>

        <Card className="glass-panel border-white/20 bg-white/90 text-textPrimary">
          <CardContent className="p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <LockKeyhole className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-textPrimary">Acesso restrito</h2>
                <p className="text-sm text-textSecondary">Use seus dados cadastrados.</p>
              </div>
            </div>

            <form
              onSubmit={(event) => {
                void handleSubmit(login)(event);
              }}
              className="space-y-4"
            >
              <Input
              id="cpf"
              label="CPF"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              placeholder="000.000.000-00"
              icon={<IdCard className="h-4 w-4" aria-hidden="true" />}
              error={errors.cpf?.message}
              {...register("cpf")}
            />

              <Input
              id="dataNascimento"
              label="Data de nascimento"
              type="date"
              icon={<CalendarDays className="h-4 w-4" aria-hidden="true" />}
              error={errors.dataNascimento?.message}
              {...register("dataNascimento")}
            />

              <Button type="submit" isLoading={loading} className="w-full">
                {loading ? "Acessando" : "Acessar portal"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
