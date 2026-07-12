/**
 * firebase.client.ts
 *
 * Padrão Singleton (ADR-0008) — garante que o FirebaseApp seja
 * inicializado uma única vez por sessão, evitando erros de
 * "FirebaseApp already exists" no Next.js SSR/CSR.
 */

import { initializeApp, getApps, getApp } from "firebase/app";
import type { FirebaseApp } from "firebase/app";
import { 
  Firestore, 
  initializeFirestore, 
  persistentLocalCache, 
  persistentMultipleTabManager 
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env["NEXT_PUBLIC_FIREBASE_API_KEY"],
  authDomain: process.env["NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"],
  projectId: process.env["NEXT_PUBLIC_FIREBASE_PROJECT_ID"],
  storageBucket: process.env["NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"],
  messagingSenderId: process.env["NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"],
  appId: process.env["NEXT_PUBLIC_FIREBASE_APP_ID"],
};

/**
 * Retorna a instância única do FirebaseApp.
 */
export function getFirebaseApp(): FirebaseApp {
  if (getApps().length > 0) {
    return getApp();
  }
  return initializeApp(firebaseConfig);
}

let firestoreInstance: Firestore | null = null;

/**
 * Retorna a instância do Firestore configurada com suporte a persistência
 * local (offline) usando múltiplas abas se suportado pelo navegador.
 */
export function getFirestoreDb(): Firestore {
  if (firestoreInstance) return firestoreInstance;

  const app = getFirebaseApp();
  
  // No Firebase 9+, initializeFirestore permite definir o cache no momento da criação
  firestoreInstance = initializeFirestore(app, {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager()
    })
  });

  return firestoreInstance;
}
