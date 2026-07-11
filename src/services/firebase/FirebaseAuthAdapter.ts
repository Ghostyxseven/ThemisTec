import { IAuthService } from "@/shared/interfaces/IAuthService";
import { LoginInput, RegisterInput } from "@/specs/schemas/auth.schema";
import { getFirebaseApp } from "./firebase.client";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  Auth,
} from "firebase/auth";

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

  public async register(dados: RegisterInput): Promise<void> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        dados.email,
        dados.senha
      );

      await updateProfile(userCredential.user, {
        displayName: dados.nome,
      });

      await sendEmailVerification(userCredential.user);
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
    if (error.code === "auth/email-already-in-use") {
      throw new Error("Este e-mail já está cadastrado.");
    }

    if (error.code === "auth/weak-password") {
      throw new Error("A senha fornecida é muito fraca.");
    }

    throw new Error("Falha na autenticação. Tente novamente mais tarde.");
  }
}
