import { Injectable } from '@angular/core';
import {Observable, take} from 'rxjs';
import {Product} from '../models/product';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private readonly baseURL = `${environment.baseURL}/products`;

  constructor(private http: HttpClient) {
  }

  public getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.baseURL);
  }

  public getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.baseURL}/${id}`);
  }

  public createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.baseURL, product).pipe(take(1));
  }

  public updateProduct(id: string, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.baseURL}/${id}`, product).pipe(take(1));
  }

  public deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseURL}/${id}`).pipe(take(1));
  }
}
