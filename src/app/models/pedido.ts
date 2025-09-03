export interface Pedido {
  id: string;
  dataPedido: string;    // ISO 8601
  valorTotal: number;
  status: string;
  clienteId: string;
  createdAt: string;
}
