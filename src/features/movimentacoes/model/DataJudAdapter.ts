/**
 * DataJudAdapter — Integração real com a API Pública do CNJ (DataJud)
 * Documentação: https://datajud-wiki.cnj.jus.br/api-publica/
 * 
 * A API usa Elasticsearch e é pública (chave fixa disponível na wiki).
 */

// Chave pública da API DataJud (disponível em datajud-wiki.cnj.jus.br/api-publica/acesso)
const DATAJUD_API_KEY = "ApiKey cDZHYzlZa0JadVREZDR4cUF6a0sfM0RJN0FBZmFjR2ZFZ0xkM2RVN200MQ==";
const DATAJUD_BASE_URL = "https://api-publica.datajud.cnj.jus.br";

// Mapeamento do dígito do segmento de justiça para o tribunal
// Número CNJ: NNNNNNN-DD.AAAA.J.TR.OOOO
// J = segmento de justiça, TR = tribunal
const TRIBUNAIS_MAP: Record<string, string> = {
  // Justiça Estadual (8)
  "8.01": "api_publica_tjac", "8.02": "api_publica_tjal", "8.03": "api_publica_tjap",
  "8.04": "api_publica_tjam", "8.05": "api_publica_tjba", "8.06": "api_publica_tjce",
  "8.07": "api_publica_tjdft", "8.08": "api_publica_tjes", "8.09": "api_publica_tjgo",
  "8.10": "api_publica_tjma", "8.11": "api_publica_tjmt", "8.12": "api_publica_tjms",
  "8.13": "api_publica_tjmg", "8.14": "api_publica_tjpa", "8.15": "api_publica_tjpb",
  "8.16": "api_publica_tjpr", "8.17": "api_publica_tjpe", "8.18": "api_publica_tjpi",
  "8.19": "api_publica_tjrj", "8.20": "api_publica_tjrn", "8.21": "api_publica_tjrs",
  "8.22": "api_publica_tjro", "8.23": "api_publica_tjrr", "8.24": "api_publica_tjsc",
  "8.25": "api_publica_tjse", "8.26": "api_publica_tjsp", "8.27": "api_publica_tjto",
  // Justiça Federal (4)
  "4.01": "api_publica_trf1", "4.02": "api_publica_trf2", "4.03": "api_publica_trf3",
  "4.04": "api_publica_trf4", "4.05": "api_publica_trf5", "4.06": "api_publica_trf6",
  // Justiça do Trabalho (5)
  "5.01": "api_publica_trt1", "5.02": "api_publica_trt2", "5.03": "api_publica_trt3",
  "5.04": "api_publica_trt4", "5.05": "api_publica_trt5", "5.06": "api_publica_trt6",
  "5.07": "api_publica_trt7", "5.08": "api_publica_trt8", "5.09": "api_publica_trt9",
  "5.10": "api_publica_trt10", "5.11": "api_publica_trt11", "5.12": "api_publica_trt12",
  "5.13": "api_publica_trt13", "5.14": "api_publica_trt14", "5.15": "api_publica_trt15",
  "5.16": "api_publica_trt16", "5.17": "api_publica_trt17", "5.18": "api_publica_trt18",
  "5.19": "api_publica_trt19", "5.20": "api_publica_trt20", "5.21": "api_publica_trt21",
  "5.22": "api_publica_trt22", "5.23": "api_publica_trt23", "5.24": "api_publica_trt24",
  // Tribunais Superiores
  "2.00": "api_publica_stf",
  "3.00": "api_publica_stj",
  "6.00": "api_publica_tst",
  "7.00": "api_publica_stm",
  "9.00": "api_publica_tse",
};

export interface MovimentacaoDataJud {
  dataHora: string;
  nome: string;
  complemento?: string;
}

export interface ProcessoDataJud {
  numero: string;
  classe: string;
  assunto: string;
  orgaoJulgador: string;
  dataAjuizamento: string;
  movimentos: MovimentacaoDataJud[];
}

/**
 * Extrai o código do tribunal a partir do número CNJ.
 * Formato CNJ: NNNNNNN-DD.AAAA.J.TR.OOOO
 */
function extrairTribunal(numeroCNJ: string): string | null {
  // Remove tudo que não é número ou ponto/traço
  const limpo = numeroCNJ.replace(/[^\d.-]/g, "");
  // Formato: 0000000-00.0000.0.00.0000
  const partes = limpo.split(".");
  if (partes.length < 4) return null;
  
  const justica = partes[2]; // J (dígito da justiça)
  const tribunal = partes[3]; // TR (tribunal)
  
  const chave = `${justica}.${tribunal}`;
  return TRIBUNAIS_MAP[chave] || null;
}

/**
 * Busca um processo pelo número CNJ na API pública do DataJud.
 */
export async function buscarProcessoCNJ(numeroCNJ: string): Promise<ProcessoDataJud | null> {
  const endpoint = extrairTribunal(numeroCNJ);
  if (!endpoint) {
    throw new Error(`Não foi possível identificar o tribunal para o número: ${numeroCNJ}`);
  }

  // Limpar o número CNJ (remover pontuação para busca)
  const numeroLimpo = numeroCNJ.replace(/[^\d]/g, "");

  const url = `${DATAJUD_BASE_URL}/${endpoint}/_search`;
  const body = {
    query: {
      match: {
        numeroProcesso: numeroLimpo,
      },
    },
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: DATAJUD_API_KEY,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Erro na API DataJud (${response.status}): ${response.statusText}`);
  }

  const data = await response.json() as {
    hits: {
      total: { value: number };
      hits: Array<{
        _source: {
          numeroProcesso: string;
          classe: { nome: string };
          assuntos: Array<{ nome: string }>;
          orgaoJulgador: { nome: string };
          dataAjuizamento: string;
          movimentos: Array<{
            dataHora: string;
            nome: string;
            complementosTabelados?: Array<{ nome: string; valor: string }>;
          }>;
        };
      }>;
    };
  };

  if (!data.hits || data.hits.total.value === 0) {
    return null;
  }

  const firstHit = data.hits.hits[0];
  if (!firstHit) return null;
  const hit = firstHit._source;

  return {
    numero: hit.numeroProcesso,
    classe: hit.classe?.nome || "Não informada",
    assunto: hit.assuntos?.[0]?.nome || "Não informado",
    orgaoJulgador: hit.orgaoJulgador?.nome || "Não informado",
    dataAjuizamento: hit.dataAjuizamento || "",
    movimentos: (hit.movimentos || []).map((m) => ({
      dataHora: m.dataHora,
      nome: m.nome,
      complemento: m.complementosTabelados?.map((c) => `${c.nome}: ${c.valor}`).join("; "),
    })),
  };
}

/**
 * Busca apenas movimentações novas (após uma determinada data).
 */
export async function buscarMovimentacoesNovas(
  numeroCNJ: string,
  aposData?: string
): Promise<MovimentacaoDataJud[]> {
  const processo = await buscarProcessoCNJ(numeroCNJ);
  if (!processo) return [];

  if (!aposData) return processo.movimentos;

  const dataLimite = new Date(aposData);
  return processo.movimentos.filter((m) => new Date(m.dataHora) > dataLimite);
}
