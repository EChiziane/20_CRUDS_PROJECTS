import { Injectable } from "@angular/core";
import {environment} from '../../environments/environments';
import {HttpClient} from '@angular/common/http';
import {Observable, take} from 'rxjs';
import {BankAccount} from '../models/bankAccount';

@Injectable({
  providedIn: 'root'
})
export class BankAccountService {

  private baseURL = environment.baseURL + "/bank-accounts";

  constructor(private http: HttpClient) {}

  public getBankAccounts(): Observable<BankAccount[]> {
    return this.http.get<BankAccount[]>(this.baseURL);
  }

  public getBankAccountById(id: string): Observable<BankAccount> {
    return this.http.get<BankAccount>(`${this.baseURL}/${id}`);
  }

  public addBankAccount(bankAccount: BankAccount): Observable<BankAccount> {
    console.log(bankAccount, "create");
    return this.http.post<BankAccount>(this.baseURL, bankAccount).pipe(take(1));
  }

  public deleteBankAccount(id: string): Observable<BankAccount> {
    return this.http.delete<BankAccount>(`${this.baseURL}/${id}`);
  }

  public updateBankAccount(id: string, bankAccount: BankAccount): Observable<BankAccount> {
    console.log(bankAccount, "update");
    return this.http.put<BankAccount>(`${this.baseURL}/${id}`, bankAccount).pipe(take(1));
  }
}
