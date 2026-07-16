import { FirebaseAuthAdapter } from "@/features/auth/model/FirebaseAuthAdapter";
import { FirestoreClienteAdapter } from "@/features/clientes/model/FirestoreClienteAdapter";
import { FirestoreProcessoAdapter } from "@/features/processos/model/FirestoreProcessoAdapter";
import { FirestorePrazoAdapter } from "@/features/prazos/model/FirestorePrazoAdapter";
import { FirebaseStorageAdapter } from "@/features/documentos/model/FirebaseStorageAdapter";
import { IAuthService } from "@/shared/interfaces/IAuthService";
import { IClienteRepository } from "@/shared/interfaces/IClienteRepository";
import { IProcessoRepository } from "@/shared/interfaces/IProcessoRepository";
import { IPrazoRepository } from "@/shared/interfaces/IPrazoRepository";
import { IStorageService } from "@/shared/interfaces/IStorageService";

// Exportando instâncias únicas (Singletons) como um Service Locator
export const authService: IAuthService = new FirebaseAuthAdapter();
export const clienteRepository: IClienteRepository = new FirestoreClienteAdapter();
export const processoRepository: IProcessoRepository = new FirestoreProcessoAdapter();
export const prazoRepository: IPrazoRepository = new FirestorePrazoAdapter();
export const storageService: IStorageService = new FirebaseStorageAdapter();
