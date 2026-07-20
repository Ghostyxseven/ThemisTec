import { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import type { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { authService, processoRepository, movimentacaoRepository } from "@/services";
import { UpdateProcessoSchema, UpdateProcessoInput } from "@/specs/schemas/processo.schema";
import type { Movimentacao } from "@/specs/schemas/movimentacao.schema";

interface EditProcessoViewModel {
  register: UseFormRegister<UpdateProcessoInput>;
  handleSubmit: (event?: React.BaseSyntheticEvent) => Promise<void>;
  errors: FieldErrors<UpdateProcessoInput>;
  setValue: UseFormSetValue<UpdateProcessoInput>;
  isSubmitting: boolean;
  isLoading: boolean;
  errorMessage: string | null;
  clienteId: string | null;
  movimentacoes: Movimentacao[];
}

export function useEditProcesso(processoId: string): EditProcessoViewModel {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [clienteId, setClienteId] = useState<string | null>(null);
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<UpdateProcessoInput>({
    resolver: zodResolver(UpdateProcessoSchema),
  });

  const carregarProcesso = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const userId = await authService.waitForAuth();
      if (!userId) throw new Error("Usuário não autenticado");

      const [processo, movs] = await Promise.all([
        processoRepository.buscarPorId(processoId, userId),
        movimentacaoRepository.listar(userId, processoId).catch(() => [])
      ]);

      if (processo.clienteId) setClienteId(processo.clienteId);
      setMovimentacoes(movs);
      
      reset({
        status: processo.status,
        descricao: processo.descricao || "",
        valorHonorarios: processo.valorHonorarios,
        statusPagamento: processo.statusPagamento,
        tipo: processo.tipo,
      });
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMessage(error.message || "Erro ao carregar dados do processo.");
    } finally {
      setIsLoading(false);
    }
  }, [processoId, reset]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void carregarProcesso();
  }, [carregarProcesso]);

  const onSubmit = async (dados: UpdateProcessoInput): Promise<void> => {
    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      
      const userId = await authService.waitForAuth();
      if (!userId) throw new Error("Sessão expirada. Faça login novamente.");

      await processoRepository.atualizar(processoId, dados, userId);
      
      router.push("/processos");
      router.refresh();
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMessage(error.message || "Falha ao atualizar processo.");
      setIsSubmitting(false);
    }
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    setValue,
    isSubmitting,
    isLoading,
    errorMessage,
    clienteId,
    movimentacoes,
  };
}
