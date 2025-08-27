export interface Projeto {
  id: string;
  nome: string;
  descricao: string;
  dataInicio: string;
  dataFim: string;
  status: string;     // EM_ANDAMENTO | CONCLUIDO
  createdAt: string;  // ISO 8601
}
