export interface CreateGatewayChargeParams {
  clienteAsaasId: string;
  valor: number;
  vencimento: string;
  descricao?: string;
  externalReference?: string;
}

export interface GatewayChargeResult {
  gatewayId: string;
  linkPagamento: string;
  payloadOriginal: unknown;
}

export interface IPaymentGateway {
  criarCliente(nome: string, cpfCnpj: string, email?: string): Promise<string>;
  criarCobranca(params: CreateGatewayChargeParams): Promise<GatewayChargeResult>;
}
