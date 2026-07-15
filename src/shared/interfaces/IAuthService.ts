import { LoginInput, RegisterInput, ResetPasswordInput } from "@/specs/schemas/auth.schema";

export interface IAuthService {
  login(dados: LoginInput): Promise<void>;
  register(dados: RegisterInput): Promise<void>;
  resetPassword(dados: ResetPasswordInput): Promise<void>;
  logout(): Promise<void>;
  getCurrentUserId(): string | null;
  waitForAuth(): Promise<string | null>;
}
