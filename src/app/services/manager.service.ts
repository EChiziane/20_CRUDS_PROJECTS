import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, take} from 'rxjs';
import {environment} from '../../environments/environments';
import {Manager} from '../models/WSM/manager';

@Injectable({
  providedIn: 'root'
})
export class ManagerService {

  private baseURL = environment.baseURL + '/managers';

  constructor(private http: HttpClient) {
  }

  public getManagers(): Observable<Manager[]> {
    return this.http.get<Manager[]>(this.baseURL);
  }

  public getManagerById(id: string): Observable<Manager> {
    return this.http.get<Manager>(`${this.baseURL}/${id}`);
  }

  public addManager(manager: Manager): Observable<Manager> {
    return this.http.post<Manager>(this.baseURL, manager).pipe(take(1));
  }

  public deleteManager(id: string): Observable<Manager> {
    return this.http.delete<Manager>(`${this.baseURL}/${id}`);
  }

  public updateManager(id: string, manager: Manager): Observable<Manager> {
    return this.http.put<Manager>(`${this.baseURL}/${id}`, manager).pipe(take(1));
  }
}
