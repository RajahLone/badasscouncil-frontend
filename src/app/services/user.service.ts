import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'
import { Observable } from 'rxjs';
import { Environnement } from '../env';
import { User, UserShort } from '../interfaces/user';
import { Pagination } from '../interfaces/misc';

@Injectable({ providedIn: 'root' })

export class UserService
{

  private baseURL = Environnement.apiUrl + "user";

  constructor(private httpClient: HttpClient) { }

  getPagination(nameFilter: string, statusFilter: number, page: number): Observable<Pagination>
  {
    let params = new HttpParams();

    params = params.append('name', nameFilter);
    params = params.append('status', statusFilter);
    params = params.append('page', page);

    return this.httpClient.get<Pagination>(`${this.baseURL}/pagination`, { params: params });
  }
  getUserList(nameFilter: string, statusFilter: number, sort: number, page: number, size: number): Observable<UserShort[]>
  {
    let params = new HttpParams();

    params = params.append('name', nameFilter);
    params = params.append('status', statusFilter);
    params = params.append('sort', sort);
    params = params.append('page', page);
    params = params.append('size', size);

    return this.httpClient.get<User[]>(`${this.baseURL}/list`, { params: params });
  }

  getUserListOptions(): Observable<UserShort[]>{ return this.httpClient.get<UserShort[]>(`${this.baseURL}/option-list`); }

  createUser(user: User): Observable<Object>{ return this.httpClient.post(`${this.baseURL}/create`, user); }

  getUserById(id: number): Observable<User>{ return this.httpClient.get<User>(`${this.baseURL}/form/${id}`); }

  updateUser(id: number, user: User): Observable<Object>{ return this.httpClient.put(`${this.baseURL}/update/${id}`, user); }

  deleteUser(id: number): Observable<Object>{ return this.httpClient.delete(`${this.baseURL}/delete/${id}`); }

}
