import { LoginInput, RegisterInput, ResetPasswordInput } from "@/specs/schemas/auth.schema";

export interface AuthUser {
  id: string;
  email: string | null;
  displayName: string | null;
}

export interface IAuthService {
  login(dados: LoginInput): Promise<void>;
  register(dados: RegisterInput): Promise<void>;
  resetPassword(dados: ResetPasswordInput): Promise<void>;
  updatePassword(password: string): Promise<void>;
  logout(): Promise<void>;
  waitForAuth(): Promise<string | null>;
  getCurrentUser(): Promise<AuthUser | null>;
  updateDisplayName(displayName: string): Promise<void>;
  onAuthStateChanged(callback: (user: AuthUser | null) => void): () => void;
}
