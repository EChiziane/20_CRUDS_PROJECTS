export interface Sprint {
  code: string;
  name: string;
  description: string;
  id: string; // Opcional, caso uses id no backend
  status: string;
  createdAt: string;   // Data de criação do usuário (em formato ISO 8601)
}
