import { Injectable } from '@angular/core';
import {environment} from '../../environments/environments';
import {HttpClient} from '@angular/common/http';
import {Observable, take} from 'rxjs';
import {Employee} from '../models/employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private baseURL = environment.baseURL + "/employees";

  constructor(private http: HttpClient) {}

  public getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.baseURL);
  }

  public getEmployeeById(id: string): Observable<Employee> {
    return this.http.get<Employee>(`${this.baseURL}/${id}`);
  }

  public addEmployee(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>(this.baseURL, employee).pipe(take(1));
  }

  public updateEmployee(id: string, employee: Employee): Observable<Employee> {
    return this.http.put<Employee>(`${this.baseURL}/${id}`, employee).pipe(take(1));
  }

  public deleteEmployee(id: string): Observable<Employee> {
    return this.http.delete<Employee>(`${this.baseURL}/${id}`);
  }
}
