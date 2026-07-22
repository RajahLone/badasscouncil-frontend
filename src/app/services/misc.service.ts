import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { Environnement } from '../env';
import { HomeInformation } from '../interfaces/misc';
import { Captcha } from '../interfaces/account';

@Injectable({ providedIn: 'root' })

export class MiscService
{

  private baseURL = Environnement.apiUrl + "misc";

  constructor(private httpClient: HttpClient) { }

  getMessage(): Observable<HomeInformation>{ return this.httpClient.get<HomeInformation>(`${this.baseURL}/welcome`); }

  getCaptcha(type: String): Observable<Captcha>{ return this.httpClient.get<Captcha>(`${this.baseURL}/question/${type}`); }

}
