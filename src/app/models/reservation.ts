export interface Reservation {
  id: string; // UUID gerado pelo backend
  guestName: string;
  checkInDate: string;   // formato ISO 8601: yyyy-MM-dd
  checkOutDate: string;  // deve ser maior que checkInDate
  roomNumber: number;
  totalPrice: number;
  createdAt: string;     // data da criação da reserva
}
