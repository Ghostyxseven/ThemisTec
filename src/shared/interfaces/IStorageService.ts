export interface IStorageService {
  /**
   * Faz o upload de um arquivo para o repositório em nuvem.
   * @param path Caminho do arquivo (ex: 'processos/ID/documento.pdf')
   * @param file Arquivo binário a ser subido.
   * @returns A URL de download pública ou assinada do arquivo.
   */
  uploadFile(path: string, file: File): Promise<string>;

  /**
   * Deleta um arquivo do repositório em nuvem.
   * @param path Caminho do arquivo a ser deletado.
   */
  deleteFile(path: string): Promise<void>;
}
