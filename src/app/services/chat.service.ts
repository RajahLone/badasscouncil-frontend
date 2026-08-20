import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { Environnement } from '../env';
import { MessageShort, Room } from '../interfaces/chat';
import { NickName } from '../interfaces/user';

@Injectable({ providedIn: 'root' })

export class ChatService
{

  private baseURLchat = Environnement.apiUrl + "chat";

  private baseURLroom = Environnement.apiUrl + "room";

  constructor(private httpClient: HttpClient) { }

  getNickNameListOption(): Observable<NickName[]>{ return this.httpClient.get<NickName[]>(`${this.baseURLchat}/nickname-list`); }

  getNew(room: number, last: number): Observable<MessageShort[]> { return this.httpClient.get<MessageShort[]>(`${this.baseURLchat}/new/${room}/${last}`); }

  addNew(room: number, last: number, msg: MessageShort): Observable<MessageShort[]>{ return this.httpClient.post<MessageShort[]>(`${this.baseURLchat}/add/${room}/${last}`, msg); }

  getListRoom(): Observable<Room[]> { return this.httpClient.get<Room[]>(`${this.baseURLroom}/list`); }

  createRoom(room: Room): Observable<Object>{ return this.httpClient.post(`${this.baseURLroom}/create`, room); }

  getRoomById(id: number): Observable<Room>{ return this.httpClient.get<Room>(`${this.baseURLroom}/form/${id}`); }

  updateRoom(id: number, room: Room): Observable<Object>{ return this.httpClient.put(`${this.baseURLroom}/update/${id}`, room); }

  deleteRoom(id: number): Observable<Object>{ return this.httpClient.delete(`${this.baseURLroom}/delete/${id}`); }

}
