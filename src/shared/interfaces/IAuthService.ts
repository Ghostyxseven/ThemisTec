import { LoginInput, RegisterInput } from "@/specs/schemas/auth.schema";

export interface IAuthService {
  login(dados: LoginInput): Promise<void>;
  register(dados: RegisterInput): Promise<void>;
  logout(): Promise<void>;
}
