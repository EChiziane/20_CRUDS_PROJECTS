import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, take } from 'rxjs';
import { environment } from '../../environments/environments';
import {Recibo} from '../models/CSM/Recibo';


@Injectable({
  providedIn: 'root'
})
export class ReciboService {

  private baseURL = environment.baseURL + "/recibos";

  constructor(private http: HttpClient) { }

  public getRecibos(): Observable<Recibo[]> {
    return this.http.get<Recibo[]>(this.baseURL);
  }

  public getReciboById(id: string): Observable<Recibo> {
    return this.http.get<Recibo>(`${this.baseURL}/${id}`);
  }

  public addRecibo(recibo: Recibo): Observable<Recibo> {
    console.log(recibo, "create");
    return this.http.post<Recibo>(this.baseURL, recibo).pipe(take(1));
  }

  public deleteRecibo(id: string): Observable<Recibo> {
    return this.http.delete<Recibo>(`${this.baseURL}/${id}`);
  }

  public updateRecibo(id: string, recibo: Recibo): Observable<Recibo> {
    console.log(recibo, "update");
    return this.http.put<Recibo>(`${this.baseURL}/${id}`, recibo).pipe(take(1));
  }
}
