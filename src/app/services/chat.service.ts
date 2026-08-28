import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs';
import { Environnement } from '../env';
import { MessageShort, MessageShortPass, Room } from '../interfaces/chat';
import { NickName } from '../interfaces/user';

@Injectable({ providedIn: 'root' })

export class ChatService
{

  private baseURLchat = Environnement.apiUrl + "chat";

  private baseURLroom = Environnement.apiUrl + "room";

  constructor(private httpClient: HttpClient) { }

  getNickNameListOption(): Observable<NickName[]>{ return this.httpClient.get<NickName[]>(`${this.baseURLchat}/nickname-list`); }

  getNew(room: number, last: number, pass: string): Observable<MessageShort[]>
  {
    let msg = new MessageShortPass(); msg.password = pass;

    return this.httpClient.post<MessageShort[]>(`${this.baseURLchat}/new/${room}/${last}`, msg);
  }

  addNew(room: number, last: number, msg: MessageShortPass): Observable<MessageShort[]>{ return this.httpClient.post<MessageShort[]>(`${this.baseURLchat}/add/${room}/${last}`, msg); }

  getListRoom(): Observable<Room[]> { return this.httpClient.get<Room[]>(`${this.baseURLroom}/list`); }

  createRoom(room: Room): Observable<Object>{ return this.httpClient.post(`${this.baseURLroom}/create`, room); }

  getRoomById(id: number): Observable<Room>{ return this.httpClient.get<Room>(`${this.baseURLroom}/form/${id}`); }

  updateRoom(id: number, room: Room): Observable<Object>{ return this.httpClient.put(`${this.baseURLroom}/update/${id}`, room); }

  deleteRoom(id: number): Observable<Object>{ return this.httpClient.delete(`${this.baseURLroom}/delete/${id}`); }

}
