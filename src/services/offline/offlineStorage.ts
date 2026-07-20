import { get, set, update } from "idb-keyval";

export const offlineStorage = {
  async saveToQueue(endpoint: string, payload: any) {
    await update("sync_queue", (val: any[] = []) => [
      ...val,
      { endpoint, payload, timestamp: Date.now() },
    ]);
  },
  async getQueue(): Promise<any[]> {
    const q = await get("sync_queue");
    return Array.isArray(q) ? q : [];
  },
  async clearQueue() {
    await set("sync_queue", []);
  },
  async setCache(key: string, data: any) {
    await set(`cache_${key}`, data);
  },
  async getCache(key: string) {
    return await get(`cache_${key}`);
  },
};
