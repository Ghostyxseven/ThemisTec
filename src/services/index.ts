import { SupabaseAuthAdapter } from "@/features/auth/model/SupabaseAuthAdapter";
import { SupabaseClienteAdapter } from "@/features/clientes/model/SupabaseClienteAdapter";
import { SupabaseProcessoAdapter } from "@/features/processos/model/SupabaseProcessoAdapter";
import { SupabasePrazoAdapter } from "@/features/prazos/model/SupabasePrazoAdapter";
import { SupabaseStorageAdapter } from "@/features/documentos/model/SupabaseStorageAdapter";
import { IAuthService } from "@/shared/interfaces/IAuthService";
import { IClienteRepository } from "@/shared/interfaces/IClienteRepository";
import { IProcessoRepository } from "@/shared/interfaces/IProcessoRepository";
import { IPrazoRepository } from "@/shared/interfaces/IPrazoRepository";
import { IStorageService } from "@/shared/interfaces/IStorageService";

// Exportando instâncias únicas (Singletons) como um Service Locator
export const authService: IAuthService = new SupabaseAuthAdapter();
export const clienteRepository: IClienteRepository = new SupabaseClienteAdapter();
export const processoRepository: IProcessoRepository = new SupabaseProcessoAdapter();
export const prazoRepository: IPrazoRepository = new SupabasePrazoAdapter();
export const storageService: IStorageService = new SupabaseStorageAdapter();
