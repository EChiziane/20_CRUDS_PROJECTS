export interface Customer {

  id: string;
  name: string;
  contact: string;
  address: string;
  status: 'ATIVO' | 'INATIVO';
  valve: number;
  monthsInDebt: number;
  createdAt: string;
}
