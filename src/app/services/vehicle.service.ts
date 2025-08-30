import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, take} from 'rxjs';
import {environment} from '../../environments/environments';
import {Vehicle} from '../models/Vehicle';


@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private baseURL = environment.baseURL + "/vehicles";

  constructor(private http: HttpClient) {
  }

  public getVehicles(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(this.baseURL);
  }

  public getVehicleById(id: string): Observable<Vehicle> {
    return this.http.get<Vehicle>(`${this.baseURL}/${id}`);
  }

  public addVehicle(vehicle: Vehicle): Observable<Vehicle> {
    return this.http.post<Vehicle>(this.baseURL, vehicle).pipe(take(1));
  }

  public updateVehicle(id: string, vehicle: Vehicle): Observable<Vehicle> {
    return this.http.put<Vehicle>(`${this.baseURL}/${id}`, vehicle).pipe(take(1));
  }

  public deleteVehicle(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseURL}/${id}`);
  }
}
