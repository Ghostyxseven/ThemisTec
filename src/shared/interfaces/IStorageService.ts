export interface IStorageService {
  uploadFile(path: string, file: File): Promise<string>;
}
