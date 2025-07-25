import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, take} from 'rxjs';
import {environment} from '../../environments/environments';
import {Sprint} from '../models/CSM/sprint';

@Injectable({
  providedIn: 'root'
})
export class SprintService {

  private baseURL = environment.baseURL + "/sprints";

  constructor(private http: HttpClient) {
  }

  public getSprints(): Observable<Sprint[]> {
    return this.http.get<Sprint[]>(this.baseURL);
  }

  public getSprintById(id: string): Observable<Sprint> {
    return this.http.get<Sprint>(`${this.baseURL}/${id}`);
  }

  public addSprint(sprint: Sprint): Observable<Sprint> {

    console.log(sprint + "create");
    return this.http.post<Sprint>(this.baseURL, sprint).pipe(take(1));
  }

  public deleteSprint(id: string): Observable<Sprint> {
    return this.http.delete<Sprint>(`${this.baseURL}/${id}`);
  }

  public updateSprint(id: string, sprint: Sprint): Observable<Sprint> {
    console.log(sprint + "update");
    return this.http.put<Sprint>(`${this.baseURL}/${id}`, sprint).pipe(take(1));
  }
}
