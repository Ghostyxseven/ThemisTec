import { useState } from "react";
import { useRouter } from "next/navigation";
import type { PortalLoginInput } from "@/specs/schemas/portal.schema";
import { toast } from "sonner";

export function usePortalAuth() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const login = async (dados: PortalLoginInput) => {
    setLoading(true);
    try {
      const response = await fetch("/api/portal/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dados),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Erro ao fazer login");
      }

      toast.success("Acesso liberado!");
      router.push("/portal/dashboard");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { login, loading };
}
