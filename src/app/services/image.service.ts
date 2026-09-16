import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'
import { Observable } from 'rxjs';
import { Environnement } from '../env';
import { Preference } from '../interfaces/misc';

@Injectable({ providedIn: 'root' })

export class ImageService
{

  private baseURL = Environnement.apiUrl + "image";

  constructor(private httpClient: HttpClient) { }

  getThumbnail(msg: number, img: number): Observable<string> { return this.httpClient.get(`${this.baseURL}/thumbnail/${msg}/${img}`, { responseType: 'text' }); }

  getPlain(msg: number, img: number): void { window.open(`${this.baseURL}/plain/${msg}/${img}`, '_blank'); }

}
