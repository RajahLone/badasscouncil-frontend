import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'
import { Observable } from 'rxjs';
import { Environnement } from '../env';
import { Preference } from '../interfaces/misc';

@Injectable({ providedIn: 'root' })

export class PreferenceService
{

  private baseURL = Environnement.apiUrl + "preference";

  constructor(private httpClient: HttpClient) { }

  setPreference(action: number, parameters: String): Observable<Preference>
  {
    let params = new HttpParams();

    if (action > 0) { params = params.append('action', action); }
    if (parameters != null) { params = params.append('params', '' + parameters); }

    return this.httpClient.get<Preference>(`${this.baseURL}/set`, { params: params });
  }

  getPreference(action: number): Observable<Preference>
  {
    let params = new HttpParams();

    if (action > 0) { params = params.append('action', '' + action); }

    return this.httpClient.get<Preference>(`${this.baseURL}/get`, { params: params });
  }

}
