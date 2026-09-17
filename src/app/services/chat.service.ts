import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs';
import { Environnement } from '../env';
import { MessageShort, MessageShortPass, Room } from '../interfaces/chat';
import { NickName } from '../interfaces/user';
import { Pagination } from '../interfaces/misc';

@Injectable({ providedIn: 'root' })

export class ChatService
{

  private baseURLchat = Environnement.apiUrl + "chat";

  private baseURLroom = Environnement.apiUrl + "room";

  constructor(private httpClient: HttpClient) { }

  getNickNameListOption(): Observable<NickName[]>{ return this.httpClient.get<NickName[]>(`${this.baseURLchat}/nickname-list`); }

  getCount(room: number): Observable<Pagination> { return this.httpClient.get<Pagination>(`${this.baseURLchat}/count/${room}`); }

  getOld(room: number, first: number, pass: string): Observable<MessageShort[]>
  {
    let msg = new MessageShortPass(); msg.password = pass;

    return this.httpClient.post<MessageShort[]>(`${this.baseURLchat}/old/${room}/${first}`, msg);
  }

  getNew(room: number, last: number, pass: string): Observable<MessageShort[]>
  {
    let msg = new MessageShortPass(); msg.password = pass;

    return this.httpClient.post<MessageShort[]>(`${this.baseURLchat}/new/${room}/${last}`, msg);
  }

  addText(room: number, last: number, msg: MessageShortPass): Observable<MessageShort[]>{ return this.httpClient.post<MessageShort[]>(`${this.baseURLchat}/add/txt/${room}/${last}`, msg); }

  addImages(room: number, last: number, msg: MessageShortPass, files: FileList): Observable<MessageShort[]>
  {
    const msg_blob = new Blob([JSON.stringify(msg)], { type: 'application/json' });

    const formData: FormData = new FormData();

    formData.append('file', msg_blob, 'message');

    for (let f = 0; f < files.length; f++) { const file = files.item(f); if (file != null) { formData.append('file', file, file.name); } }

    return this.httpClient.post<MessageShort[]>(`${this.baseURLchat}/add/img/${room}/${last}`, formData);
  }

  getListRoom(): Observable<Room[]> { return this.httpClient.get<Room[]>(`${this.baseURLroom}/list`); }

  createRoom(room: Room): Observable<Object>{ return this.httpClient.post(`${this.baseURLroom}/create`, room); }

  getRoomById(id: number): Observable<Room>{ return this.httpClient.get<Room>(`${this.baseURLroom}/form/${id}`); }

  updateRoom(id: number, room: Room): Observable<Object>{ return this.httpClient.put(`${this.baseURLroom}/update/${id}`, room); }

  deleteRoom(id: number): Observable<Object>{ return this.httpClient.delete(`${this.baseURLroom}/delete/${id}`); }

  getUsersAll(): Observable<NickName[]>{ return this.httpClient.get<NickName[]>(`${this.baseURLroom}/users-list`); }
  getUsersAllowed(id: number): Observable<NickName[]>{ return this.httpClient.get<NickName[]>(`${this.baseURLroom}/allowed-list/${id}`); }
  getUsersDisallowed(id: number): Observable<NickName[]>{ return this.httpClient.get<NickName[]>(`${this.baseURLroom}/disallowed-list/${id}`); }

  setAllowedUsers(id: number, ids: number[]): Observable<Object>{ return this.httpClient.put(`${this.baseURLroom}/set-allowed/${id}`, ids); }
  setDisallowedUsers(id: number, ids: number[]): Observable<Object>{ return this.httpClient.put(`${this.baseURLroom}/set-disallowed/${id}`, ids); }

}
