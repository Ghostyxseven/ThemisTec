import { IStorageService } from "@/shared/interfaces/IStorageService";
import { getFirebaseApp } from "./firebase.client";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

export class FirebaseStorageAdapter implements IStorageService {
  private storage;

  constructor() {
    const app = getFirebaseApp();
    this.storage = getStorage(app);
  }

  public async uploadFile(path: string, file: File): Promise<string> {
    const storageRef = ref(this.storage, path);
    await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(storageRef);
    return downloadUrl;
  }

  public async deleteFile(path: string): Promise<void> {
    const storageRef = ref(this.storage, path);
    try {
      await deleteObject(storageRef);
    } catch (error: unknown) {
      const err = error as { code?: string; message?: string };
      if (err.code === 'storage/object-not-found') {
        // Ignora se o arquivo já não existir
        return;
      }
      throw new Error(`Erro ao deletar arquivo: ${err.message || "Erro desconhecido"}`);
    }
  }
}
