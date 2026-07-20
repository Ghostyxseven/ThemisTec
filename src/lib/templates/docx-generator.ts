import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';

export function generateDocx(templateBuffer: ArrayBuffer, data: Record<string, any>): ArrayBuffer {
  // Carrega o arquivo binário do Word
  const zip = new PizZip(templateBuffer);
  
  // Inicializa o docxtemplater (ignora erros de tags não preenchidas)
  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
    nullGetter: () => "" // Se a tag não existir no data, fica vazio em vez de erro
  });

  // Seta as variáveis (tags)
  doc.render(data);

  // Gera o novo buffer de saída
  const out = doc.getZip().generate({
    type: 'arraybuffer',
    compression: 'DEFLATE',
  });

  return out;
}
