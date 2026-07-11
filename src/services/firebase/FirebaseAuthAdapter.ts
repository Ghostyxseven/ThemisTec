import { IAuthService } from "@/shared/interfaces/IAuthService";
import { LoginInput } from "@/specs/schemas/auth.schema";
import { getFirebaseApp } from "./firebase.client";
import { getAuth, signInWithEmailAndPassword, Auth } from "firebase/auth";

export class FirebaseAuthAdapter implements IAuthService {
  private auth: Auth;

  constructor() {
    const app = getFirebaseApp();
    this.auth = getAuth(app);
  }

  public async login(dados: LoginInput): Promise<void> {
    try {
      await signInWithEmailAndPassword(this.auth, dados.email, dados.senha);
    } catch (error: any) {
      this.handleAuthError(error);
    }
  }

  public async logout(): Promise<void> {
    await this.auth.signOut();
  }

  private handleAuthError(error: any): never {
    if (
      error.code === "auth/user-not-found" ||
      error.code === "auth/wrong-password" ||
      error.code === "auth/invalid-credential"
    ) {
      throw new Error("E-mail ou senha incorretos.");
    }
    throw new Error("Falha na autenticação. Tente novamente mais tarde.");
  }
}
