import { FirebaseAuthAdapter } from "./firebase/FirebaseAuthAdapter";
import { FirestoreClienteAdapter } from "./firebase/FirestoreClienteAdapter";
import { FirestoreProcessoAdapter } from "./firebase/FirestoreProcessoAdapter";
import { FirestorePrazoAdapter } from "./firebase/FirestorePrazoAdapter";
import { FirebaseStorageAdapter } from "./firebase/FirebaseStorageAdapter";
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
