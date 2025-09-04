export interface BankAccount {
  id: string;
  accountNumber: string;
  accountHolder: string;
  balance: number;
  creditLimit: number;
  openingDate: string;  // ISO 8601
  createdAt: string;    // ISO 8601
}
