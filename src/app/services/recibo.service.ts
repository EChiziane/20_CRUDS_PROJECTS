import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, take } from 'rxjs';
import { environment } from '../../environments/environments';
import {Recibo} from '../models/WSM/Recibo';


@Injectable({
  providedIn: 'root'
})
export class ReciboService {

  baseURL = environment.baseURL + "/recibos";

  constructor(private http: HttpClient) { }

  public getRecibos(): Observable<Recibo[]> {
    return this.http.get<Recibo[]>(this.baseURL);
  }

 public getDownloadUrl(id: string): Observable<Recibo>{
    return this.http.get<Recibo> (`${this.baseURL}/download/${id}`);
  }

  downloadRecibo(id: string) {
    return this.http.get(`http://localhost:8080/recibos/download/${id}`, {
      responseType: 'blob' // 👈 Isto diz ao Angular que é um ficheiro, não JSON
    });
  }


  public getReciboById(id: string): Observable<Recibo> {
    return this.http.get<Recibo>(`${this.baseURL}/${id}`);
  }

  public addRecibo(payment: any): Observable<Recibo> {
    console.log(payment, "create");
    return this.http.post<Recibo>(`${this.baseURL}`,payment).pipe(take(1));
  }

  public deleteRecibo(id: string): Observable<Recibo> {
    return this.http.delete<Recibo>(`${this.baseURL}/${id}`);
  }

  public updateRecibo(id: string, recibo: Recibo): Observable<Recibo> {
    console.log(recibo, "update");
    return this.http.put<Recibo>(`${this.baseURL}/${id}`, recibo).pipe(take(1));
  }
}
