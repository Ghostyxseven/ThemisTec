import { IStorageService } from "@/shared/interfaces/IStorageService";
import { getFirebaseApp } from "./firebase.client";
import { getStorage, ref, uploadBytes, getDownloadURL, FirebaseStorage } from "firebase/storage";

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
}
