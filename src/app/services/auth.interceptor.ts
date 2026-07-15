import { catchError, switchMap } from 'rxjs/operators';
import { throwError } from "rxjs";
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse, HttpHeaders, HttpXsrfTokenExtractor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AccountService } from './account.service';

@Injectable()

export class AuthInterceptor implements HttpInterceptor
{

  private authToken: string = "";

  private isRefreshing = false;

  constructor(private csrfTokenExtrator: HttpXsrfTokenExtractor, private accountService: AccountService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>>
  {
    const modified = request.clone({ headers: this.addExtraHeaders(request.headers, (request.method == "POST" || request.method == "PUT" || request.method == "DELETE")), withCredentials: true });

    return next.handle(modified).pipe(
      catchError((error) => { if (error instanceof HttpErrorResponse && !request.url.includes('/sign/in') && error.status === 403) { return this.handle401Error(request, next); } return throwError(() => error); })
      );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler)
  {
    if (!this.isRefreshing)
    {
      this.isRefreshing = true;

      if (this.accountService.isLogged())
      {
        return this.accountService.updateToken().pipe(
          switchMap(() => {
            this.isRefreshing = false;
            const modified = request.clone({ headers: this.addExtraHeaders(request.headers, (request.method == "POST" || request.method == "PUT" || request.method == "DELETE")), withCredentials: true });
            return next.handle(modified);
            }),
          catchError((error) => {
            this.isRefreshing = false;
            if (error.status == '403') { this.accountService.silentOut(); }
            return throwError(() => error);
            })
          );
      }
    }

    return next.handle(request);
  }

  private addExtraHeaders(headers: HttpHeaders, postput: boolean): HttpHeaders
  {
    const authToken = this.accountService.getAccessToken();

    headers = headers.set('Authorization', "Bearer " + authToken);

    const csrfToken = this.csrfTokenExtrator.getToken() as string;

    if (postput && (csrfToken != null))
    {
      headers = headers.set('X-XSRF-TOKEN', csrfToken);
    }

    return headers;
  }
}
