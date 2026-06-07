import {
  HttpErrorResponse,
  HttpHandler,
  HttpInterceptorFn,
  HttpRequest,
  HttpStatusCode,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { catchError, from, switchMap, throwError } from 'rxjs';
import { environment } from '../../../../enviroments/environment';
import { addHeader } from '../../../utils/http-request-helper/http-request-helper';
import { MessageService } from 'primeng/api';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const msalService = inject(MsalService);
  const messageService = inject(MessageService);

  return from(msalService.acquireTokenSilent({ scopes: environment.apiScopes })).pipe(
    switchMap((response) => {
      req = addHeader(req, 'Authorization', `Bearer ${response.accessToken}`);
      return next(req);
    }),
    catchError((err) => {
      messageService.add({
        severity: 'error',
        summary: 'An error occured',
        detail: err?.error?.detail ?? 'Something went wrong while fetching employee schedule.',
      });

      if (err instanceof HttpErrorResponse) {
        if (err.status === 0) {
          console.error('Network error or server unreachable');
          messageService.add({
            severity: 'error',
            summary: 'Connection Error',
            detail: 'Unable to connect to the server.',
          });
        }

        if (err.status === HttpStatusCode.Unauthorized) {
          msalService.logoutRedirect();
        }
      }

      return throwError(() => err);
    }),
  );
};
