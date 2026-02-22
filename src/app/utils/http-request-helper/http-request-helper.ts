import { HttpRequest } from '@angular/common/http';

export function addHeader<T>(req: HttpRequest<T>, name: string, value: string): HttpRequest<T> {
  return req.clone({
    setHeaders: {
      [name]: value,
    },
  });
}
