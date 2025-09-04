import { Reservation } from "../models/reservation";
import {Observable, take} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environments';

export class ReservationService {

  private baseURL = environment.baseURL + "/reservations";

  constructor(private http: HttpClient) { }

  public getReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(this.baseURL);
  }

  public getReservationById(id: string): Observable<Reservation> {
    return this.http.get<Reservation>(`${this.baseURL}/${id}`);
  }

  public addReservation(reservation: Reservation): Observable<Reservation> {
    return this.http.post<Reservation>(this.baseURL, reservation).pipe(take(1));
  }

  public updateReservation(id: string, reservation: Reservation): Observable<Reservation> {
    return this.http.put<Reservation>(`${this.baseURL}/${id}`, reservation).pipe(take(1));
  }

  public deleteReservation(id: string): Observable<Reservation> {
    return this.http.delete<Reservation>(`${this.baseURL}/${id}`);
  }
}
