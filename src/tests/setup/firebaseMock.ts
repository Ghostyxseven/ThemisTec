import { vi } from "vitest";

// Mock da biblioteca firebase/firestore
vi.mock("firebase/firestore", () => {
  return {
    collection: vi.fn(),
    doc: vi.fn((_db, collectionName, id) => {
      if (id) {
        return { id, path: `${collectionName}/${id}` };
      }
      return { id: "mocked-auto-id", path: `${collectionName}/mocked-auto-id` };
    }),
    setDoc: vi.fn(),
    getDocs: vi.fn(),
    getDoc: vi.fn(),
    updateDoc: vi.fn(),
    query: vi.fn(),
    where: vi.fn(),
    orderBy: vi.fn(),
    initializeFirestore: vi.fn(),
    getFirestore: vi.fn(),
  };
});

// Mock do nosso client do firebase
vi.mock("@/services/firebase/firebase.client", () => {
  return {
    getFirestoreDb: vi.fn(() => ({})), // Retorna um objeto fake para o Firestore
    getFirebaseApp: vi.fn(() => ({})),
  };
});
