import { IStorageService } from "@/shared/interfaces/IStorageService";
import { getFirebaseApp } from "@/services/firebase/firebase.client";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject, FirebaseStorage } from "firebase/storage";

export class FirebaseStorageAdapter implements IStorageService {
  private storage: FirebaseStorage;

  constructor() {
    const app = getFirebaseApp();
    this.storage = getStorage(app);
  }

  public async uploadFile(path: string, file: File): Promise<string> {
    try {
      const storageRef = ref(this.storage, path);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(snapshot.ref);
      return downloadUrl;
    } catch {
      throw new Error("Falha ao fazer upload do arquivo. Tente novamente mais tarde.");
    }
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
