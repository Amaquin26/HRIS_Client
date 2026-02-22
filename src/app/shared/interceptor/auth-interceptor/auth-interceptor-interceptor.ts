import {
  HttpErrorResponse,
  HttpHandler,
  HttpInterceptorFn,
  HttpRequest,
  HttpStatusCode,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { catchError, from, switchMap, throwError } from 'rxjs';
import { environment } from '../../../../enviroments/environment';
import { addHeader } from '../../../utils/http-request-helper/http-request-helper';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const msalService = inject(MsalService);

  return from(msalService.acquireTokenSilent({ scopes: environment.apiScopes })).pipe(
    switchMap((response) => {
      req = addHeader(req, 'Authorization', `Bearer ${response.accessToken}`);
      return next(req);
    }),
    catchError((err) => {
      if (err instanceof HttpErrorResponse && err.status === HttpStatusCode.Unauthorized) {
        msalService.logoutRedirect();
      }
      return throwError(() => err);
    }),
  );
};
