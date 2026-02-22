import { inject, Injectable } from '@angular/core';
import { environment } from '../../../enviroments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthUserDetails } from '../../models/auth/auth-user-details.model';

@Injectable({
  providedIn: 'root',
})
export class AuthDetailsService {
  private readonly identityApi = `${environment.employeeApiBaseUrl}/Identity`;

  private readonly httpClient = inject(HttpClient);

  getMyUserDetails(): Observable<AuthUserDetails> {
    return this.httpClient.get<AuthUserDetails>(`${this.identityApi}/me`);
  }
}
