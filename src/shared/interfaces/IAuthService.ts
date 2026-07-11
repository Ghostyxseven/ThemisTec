import { LoginInput } from "@/specs/schemas/auth.schema";

export interface IAuthService {
  login(dados: LoginInput): Promise<void>;
  logout(): Promise<void>;
}
