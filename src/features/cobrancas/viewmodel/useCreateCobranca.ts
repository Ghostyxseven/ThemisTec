import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateCobrancaSchema, CreateCobrancaInput, Cobranca } from "@/specs/schemas/cobranca.schema";

export function useCreateCobranca(onSuccess?: (cobranca: Cobranca) => void) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateCobrancaInput>({
    resolver: zodResolver(CreateCobrancaSchema),
  });

  const onSubmit = async (data: CreateCobrancaInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/cobrancas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.error || "Erro ao criar cobrança");
      }

      reset();
      if (onSuccess) {
        onSuccess(json.data);
      }
    } catch (err: any) {
      setError(err.message || "Erro inesperado");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isSubmitting: isSubmitting || isLoading,
    errorMessage: error,
  };
}
