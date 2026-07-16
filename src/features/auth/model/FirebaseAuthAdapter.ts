import { IAuthService } from "@/shared/interfaces/IAuthService";
import { FirebaseError } from "firebase/app";
import { LoginInput, RegisterInput, ResetPasswordInput } from "@/specs/schemas/auth.schema";
import { getFirebaseApp } from "@/services/firebase/firebase.client";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  sendPasswordResetEmail,
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
    } catch (error: unknown) {
      this.handleAuthError(error as FirebaseError);
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
    } catch (error: unknown) {
      this.handleAuthError(error as FirebaseError);
    }
  }

  public async resetPassword(dados: ResetPasswordInput): Promise<void> {
    try {
      await sendPasswordResetEmail(this.auth, dados.email);
    } catch (error: unknown) {
      this.handleAuthError(error as FirebaseError);
    }
  }

  public async logout(): Promise<void> {
    await this.auth.signOut();
  }

  public getCurrentUserId(): string | null {
    return this.auth.currentUser?.uid ?? null;
  }

  private handleAuthError(error: FirebaseError): never {
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
