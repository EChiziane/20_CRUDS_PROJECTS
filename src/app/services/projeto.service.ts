import { Injectable } from '@angular/core';
import {Observable, take} from 'rxjs';
import {environment} from '../../environments/environments';
import {HttpClient} from '@angular/common/http';
import {Projeto} from '../models/Projeto';

@Injectable({
  providedIn: 'root'
})
export class ProjetoService {

  private readonly baseURL = `${environment.baseURL}/projetos`;

  constructor(private http: HttpClient) {}

  public getProjetos(): Observable<Projeto[]> {
    return this.http.get<Projeto[]>(this.baseURL);
  }

  public getProjetoById(id: string): Observable<Projeto> {
    return this.http.get<Projeto>(`${this.baseURL}/${id}`);
  }

  public addProjeto(projeto: Projeto): Observable<Projeto> {
    return this.http.post<Projeto>(this.baseURL, projeto).pipe(take(1));
  }

  public updateProjeto(id: string, projeto: Projeto): Observable<Projeto> {
    return this.http.put<Projeto>(`${this.baseURL}/${id}`, projeto).pipe(take(1));
  }

  public deleteProjeto(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseURL}/${id}`);
  }
}
