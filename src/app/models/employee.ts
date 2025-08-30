export interface Employee {
  id: string;
  name: string;
  position: string;
  salary: number;
  hireDate: string;   // formato ISO (yyyy-MM-dd)
  department: string;
  createdAt: string;  // formato ISO 8601
}
