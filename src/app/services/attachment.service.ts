import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpResponse } from '@angular/common/http'
import { Observable, firstValueFrom } from 'rxjs';

import { Environnement } from '../env';
import { Attachment, AttachmentShort, AttachmentItem } from '../interfaces/attachment';
import { HomeInformation } from '../interfaces/misc';

@Injectable({ providedIn: 'root' })

export class AttachmentService
{

  private baseURL = Environnement.apiUrl + "attachment";

  constructor(private httpClient: HttpClient) { }

  getAttachmentList(sort: number): Observable<AttachmentShort[]>
  {
    let params = new HttpParams();

    params = params.append('sort', sort);

    return this.httpClient.get<AttachmentShort[]>(`${this.baseURL}/list`, { params: params });
  }

  getAttachmentItem(id: number): Observable<HttpResponse<Blob>>
  {
    let headers = new HttpHeaders();

    headers = headers.append('Accept', 'application/zip');

    return this.httpClient.get(`${this.baseURL}/file/${id}`, { headers: headers, observe: 'response', responseType: 'blob' });
  }

  createAttachment(file: Attachment): Observable<Object>{ return this.httpClient.post(`${this.baseURL}/create`, file); }

  getAttachmentById(id: number): Observable<AttachmentShort>{ return this.httpClient.get<AttachmentShort>(`${this.baseURL}/form/${id}`); }

  updateAttachment(id: number, file: AttachmentShort): Observable<Object>{ return this.httpClient.put(`${this.baseURL}/update/${id}`, file); }

  getAttachmentItemById(id: number): Observable<AttachmentItem>{ return this.httpClient.get<AttachmentItem>(`${this.baseURL}/formfile/${id}`); }

  uploadAttachmentItem(id: number, file: AttachmentItem): Observable<Object>{ return this.httpClient.put(`${this.baseURL}/upload/${id}`, file); }

  async uploadChunk(id: number, chunk: any, chunkIndex: number, fileName: string): Promise<HomeInformation>
  {
    const formData = new FormData();

    formData.append('chunkData', chunk);
    formData.append('chunkIndex', '' + chunkIndex);
    formData.append('fileName', fileName);

    return await firstValueFrom(this.httpClient.post<HomeInformation>(`${this.baseURL}/upload-chunk/${id}`, formData));
  }
  mergeChunks(id: number, fileName: string, chunkIndex: number, checksum: string): Observable<HomeInformation>
  {
    const formData = new FormData();

    formData.append('fileName', fileName);
    formData.append('lastChunkIndex', '' + chunkIndex);
    formData.append('checksum', checksum);

    return this.httpClient.post<HomeInformation>(`${this.baseURL}/merge-chunks/${id}`, formData);
  }

  deleteAttachment(id: number): Observable<Object>{ return this.httpClient.delete(`${this.baseURL}/delete/${id}`); }

}
