import { IPaymentGateway, CreateGatewayChargeParams, GatewayChargeResult } from "./IPaymentGateway";

interface AsaasErrorResponse {
  errors?: Array<{ description?: string }>;
}

interface AsaasCustomer {
  id: string;
}

interface AsaasCustomerSearchResponse {
  data?: AsaasCustomer[];
}

interface AsaasPaymentResponse {
  id: string;
  invoiceUrl: string;
  [key: string]: unknown;
}

export class AsaasGatewayAdapter implements IPaymentGateway {
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor() {
    this.baseUrl = process.env.ASAAS_API_URL || "https://sandbox.asaas.com/api/v3";
    this.apiKey = process.env.ASAAS_API_KEY || "";
  }

  private async request<T>(endpoint: string, method: string, body?: Record<string, unknown>): Promise<T> {
    if (!this.apiKey) {
      throw new Error("ASAAS_API_KEY nao configurada.");
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        access_token: this.apiKey,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = (await response.json()) as T | AsaasErrorResponse;

    if (!response.ok) {
      console.error("Asaas API Error:", data);
      const erro = data as AsaasErrorResponse;
      throw new Error(erro.errors?.[0]?.description || "Erro na integracao com Asaas");
    }

    return data as T;
  }

  async criarCliente(nome: string, cpfCnpj: string, email?: string): Promise<string> {
    const buscaRes = await this.request<AsaasCustomerSearchResponse>(`/customers?cpfCnpj=${cpfCnpj}`, "GET");
    const clienteExistente = buscaRes.data?.[0];
    if (clienteExistente) {
      return clienteExistente.id;
    }

    const novoRes = await this.request<AsaasCustomer>("/customers", "POST", {
      name: nome,
      cpfCnpj,
      email,
    });

    return novoRes.id;
  }

  async criarCobranca(params: CreateGatewayChargeParams): Promise<GatewayChargeResult> {
    const data = await this.request<AsaasPaymentResponse>("/payments", "POST", {
      customer: params.clienteAsaasId,
      billingType: "PIX",
      dueDate: params.vencimento,
      value: params.valor,
      description: params.descricao,
      externalReference: params.externalReference,
    });

    return {
      gatewayId: data.id,
      linkPagamento: data.invoiceUrl,
      payloadOriginal: data,
    };
  }
}
