export interface Customer {
  id: string; // UUID gerado pelo backend
  name: string;
  email: string;
  phone: string;
  address: string;
  registrationDate: string; // ISO 8601
}
