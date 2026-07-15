import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Environnement } from '../env';
import { Account, RefreshToken, NewPassword } from '../interfaces/account';
import { User } from '../interfaces/user';

@Injectable({ providedIn: 'root' })

export class AccountService
{

  private baseURLsig = Environnement.apiUrl + "sign";

  private baseURLacc = Environnement.apiUrl + "account";

  private accountSubject: BehaviorSubject<Account | null>;

  public account: Observable<Account | null>;

  private refreshToken: RefreshToken = new RefreshToken();

  constructor(private router : Router, private httpClient: HttpClient)
  {
    let text: string | any = '';
    try { text = sessionStorage.getItem('account'); } catch (err) { text = null; }
    if (text == null) { text = JSON.stringify(new Account()); }

    this.accountSubject = new BehaviorSubject(JSON.parse(text));
    this.account = this.accountSubject.asObservable();
  }

  public isLogged():boolean { if (this.accountSubject.value) { if (this.accountSubject.value.role === "") { return false; } return true; } return false; }
  public getUserId():number { if (this.accountSubject.value) { return this.accountSubject.value.userId; } return 0; }
  public getLoginName():string { if (this.accountSubject.value) { return this.accountSubject.value.loginName; } return ""; }
  public getNickName():string { if (this.accountSubject.value) { return this.accountSubject.value.nickName; } return ""; }
  public getRole():string { if (this.accountSubject.value) { return this.accountSubject.value.role; } return ""; }
  public getSessionTimeout():number { if (this.accountSubject.value) { return this.accountSubject.value.sessionTimeout; } return 15; }
  public getAccessToken():string { if (this.accountSubject.value) { return this.accountSubject.value.accessToken; } return ""; }
  private getRefreshToken():string { if (this.accountSubject.value) { return this.accountSubject.value.refreshToken; } return ""; }

  signIn(usr: Account): Observable<Account>
  {
    return this.httpClient.post<Account>(`${this.baseURLsig}/in`, usr).pipe(map(u => { sessionStorage.setItem('account', JSON.stringify(u)); this.accountSubject.next(u); return u; }));
  }
  updateToken()
  {
    this.refreshToken.accessToken = "";
    this.refreshToken.refreshToken = this.getRefreshToken();

    return this.httpClient.post<RefreshToken>(`${this.baseURLsig}/refresh`, this.refreshToken).pipe(map(u => { if ((u != null) && (this.accountSubject.value != null)) { this.accountSubject.value.accessToken = u.accessToken; } }));
  }

  signOut()
  {
    this.httpClient.post<User>(`${this.baseURLsig}/out`, null);

    sessionStorage.removeItem('account');
    this.accountSubject.next(null);
  }
  silentOut()
  {
    sessionStorage.removeItem('account');
    this.accountSubject.next(null);

    if ((this.router.url === '/') || (this.router.url === '/home')) { window.location.reload(); } else { this.router.navigate(['/']); }
  }

  getAccount(): Observable<User>{ return this.httpClient.get<User>(`${this.baseURLacc}/form`); }

  updateAccount(user: User): Observable<Object>{ return this.httpClient.put(`${this.baseURLacc}/update`, user); }

  updatePassword(newpass: NewPassword) { return this.httpClient.post<NewPassword>(`${this.baseURLacc}/newmdp`, newpass); }

}
