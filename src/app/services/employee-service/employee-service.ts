import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, skip } from 'rxjs';
import { PaginatedItems } from '../../models/pagination/paginated-items.model';
import { EntraUser } from '../../models/entra-user/entra-user.model';
import { PaginationQuery } from '../../models/pagination/pagination-query.model';
import { environment } from '../../../enviroments/environment';
import { AddEmployeeRecord } from '../../models/employee/add-employee-record';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private readonly employeeApi = `${environment.employeeApiBaseUrl}/Employee`;

  private readonly httpClient = inject(HttpClient);

  getGraphUsersPaginated(pagination: PaginationQuery): Observable<PaginatedItems<EntraUser>> {
    let params = new HttpParams()
    .set('searchTerm', pagination.searchTerm ?? '')
    .set('pageNumber', pagination.pageNumber)
    .set('pageSize', pagination.pageSize);

    if (pagination.skipToken){
      params = params.set('skipToken', pagination.skipToken);
    }

    return this.httpClient.get<PaginatedItems<EntraUser>>(`${this.employeeApi}/graph/paginated`, {
      params
    });
  }

  addEmployeeRecord(employeeRecord: AddEmployeeRecord) {
    return this.httpClient.post(`${this.employeeApi}`, employeeRecord);
  }
}
