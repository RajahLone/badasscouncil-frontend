import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { Environnement } from '../env';
import { HomeInformation, Quote } from '../interfaces/misc';
import { Captcha } from '../interfaces/account';
import { UserCount } from '../interfaces/user';

@Injectable({ providedIn: 'root' })

export class MiscService
{

  private baseURL = Environnement.apiUrl + "misc";

  constructor(private httpClient: HttpClient) { }

  getMessage(): Observable<HomeInformation>{ return this.httpClient.get<HomeInformation>(`${this.baseURL}/welcome`); }

  getCaptcha(type: String): Observable<Captcha>{ return this.httpClient.get<Captcha>(`${this.baseURL}/question/${type}`); }

  getUserCount(): Observable<UserCount>{ return this.httpClient.get<UserCount>(`${this.baseURL}/count/members`); }

  getQuote(): Observable<Quote>{ return this.httpClient.get<Quote>(`${this.baseURL}/quote`); }

}
