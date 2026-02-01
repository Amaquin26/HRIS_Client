import { inject, Injectable } from '@angular/core';
import { environment } from '../../../enviroments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EmployeeStatus } from '../../models/employee/employee-status.model';

@Injectable({
  providedIn: 'root',
})
export class EmployeeStatusService {
  private readonly employeeStatusApi = `${environment.employeeApiBaseUrl}/EmployeeStatus`;

  private readonly httpClient = inject(HttpClient);

  getEmployeeStatuses(): Observable<EmployeeStatus[]> {
    return this.httpClient.get<EmployeeStatus[]>(`${this.employeeStatusApi}`);
  }
}
