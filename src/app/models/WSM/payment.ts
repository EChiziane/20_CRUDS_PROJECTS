export interface Payment {
  id: string;
  customerId: string;
  customerName: string;
  amount: number;
  numMonths: number;
  referenceMonth: string;
  paymentMethod: string;
  confirmed: boolean;
  paymentDate: string;
}



