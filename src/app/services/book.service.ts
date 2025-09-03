import { Injectable } from '@angular/core';
import { Book } from '../models/book';
import {Observable, take} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private baseURL = environment.baseURL + '/books';

  constructor(private http: HttpClient) {}

  public getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.baseURL);
  }

  public getBookById(id: string): Observable<Book> {
    return this.http.get<Book>(`${this.baseURL}/${id}`);
  }

  public addBook(book: Book): Observable<Book> {
    return this.http.post<Book>(this.baseURL, book).pipe(take(1));
  }

  public updateBook(id: string, book: Book): Observable<Book> {
    return this.http.put<Book>(`${this.baseURL}/${id}`, book).pipe(take(1));
  }

  public deleteBook(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseURL}/${id}`);
  }
}
