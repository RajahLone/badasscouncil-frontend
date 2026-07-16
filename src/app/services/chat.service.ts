import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { Environnement } from '../env';
import { MessageShort } from '../interfaces/chat';
import { NickName } from '../interfaces/user';

@Injectable({ providedIn: 'root' })

export class ChatService
{

  private baseURL = Environnement.apiUrl + "chat";

  constructor(private httpClient: HttpClient) { }

  getNickNameListOption(): Observable<NickName[]>{ return this.httpClient.get<NickName[]>(`${this.baseURL}/nickname-list`); }

  getNew(last: number): Observable<MessageShort[]> { return this.httpClient.get<MessageShort[]>(`${this.baseURL}/new/${last}`); }

  addNew(last: number, msg: MessageShort): Observable<MessageShort[]>{ return this.httpClient.post<MessageShort[]>(`${this.baseURL}/add/${last}`, msg); }

}
