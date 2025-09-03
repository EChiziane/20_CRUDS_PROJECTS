import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, take } from 'rxjs';
import { environment } from '../../environments/environments';
import { Pedido } from '../models/pedido';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  private baseURL = environment.baseURL + "/pedidos";

  constructor(private http: HttpClient) {}

  public getPedidos(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(this.baseURL);
  }

  public getPedidoById(id: string): Observable<Pedido> {
    return this.http.get<Pedido>(`${this.baseURL}/${id}`);
  }

  public addPedido(pedido: Pedido): Observable<Pedido> {
    return this.http.post<Pedido>(this.baseURL, pedido).pipe(take(1));
  }

  public deletePedido(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseURL}/${id}`);
  }

  public updatePedido(id: string, pedido: Pedido): Observable<Pedido> {
    return this.http.put<Pedido>(`${this.baseURL}/${id}`, pedido).pipe(take(1));
  }
}
