import { Injectable } from '@angular/core';
import {environment} from '../../environments/environments';
import {HttpClient} from '@angular/common/http';
import {Observable, take} from 'rxjs';
import {Customer} from '../models/customer';

@Injectable({
  providedIn: 'root'
})

export class CustomerService {

  private baseURL = environment.baseURL + "/customers";

  constructor(private http: HttpClient) { }

  public getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.baseURL);
  }

  public getCustomerById(id: string): Observable<Customer> {
    return this.http.get<Customer>(`${this.baseURL}/${id}`);
  }

  public addCustomer(customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(this.baseURL, customer).pipe(take(1));
  }

  public updateCustomer(id: string, customer: Customer): Observable<Customer> {
    return this.http.put<Customer>(`${this.baseURL}/${id}`, customer).pipe(take(1));
  }

  public deleteCustomer(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseURL}/${id}`).pipe(take(1));
  }
}


