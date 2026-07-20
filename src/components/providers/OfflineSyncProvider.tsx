"use client";
import { useEffect } from "react";
import { toast } from "sonner";
import { offlineStorage } from "@/services/offline/offlineStorage";
import { clienteRepository } from "@/services";

export function OfflineSyncProvider() {
  useEffect(() => {
    async function syncData() {
      const queue = await offlineStorage.getQueue();
      if (!queue || queue.length === 0) return;
      
      toast.info("Sincronizando dados offline...");
      let successCount = 0;

      for (const item of queue) {
        try {
          if (item.endpoint === "clientes_criar") {
            await clienteRepository.criar(item.payload, item.payload.user_id);
            successCount++;
          }
        } catch (err) {
          console.error("Failed to sync item:", item, err);
        }
      }

      await offlineStorage.clearQueue();
      if (successCount > 0) {
        toast.success(`Sincronização concluída! $successCount registro(s) salvo(s).`);
      }
    }

    window.addEventListener("online", syncData);
    
    // Attempt sync on mount if online
    if (typeof navigator !== "undefined" && navigator.onLine) {
      syncData();
    }

    return () => {
      window.removeEventListener("online", syncData);
    };
  }, []);

  return null;
}
