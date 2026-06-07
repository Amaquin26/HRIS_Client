import { inject, Injectable } from '@angular/core';
import { environment } from '../../../enviroments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EmployeeSchedule } from '../../models/schedule/employee-schedule.model';
import { AddScheduleDays } from '../../models/schedule/add-schedule-days.model';
import { ScheduleDay } from '../../models/schedule/schedule-day.model';
import { ScheduleDayWriteDto } from '../../models/schedule/schedule-day-write-dto.model';
import { EmployeeScheduleDetailDto } from '../../models/schedule/employee-schedule-detail-dto.model';
import { ShiftRecord } from '../../models/schedule/shift-record.model';

@Injectable({
  providedIn: 'root',
})
export class EmployeeScheduleService {
  private readonly employeeScheduleApi = `${environment.employeeApiBaseUrl}/EmployeeSchedule`;

  private readonly httpClient = inject(HttpClient);

  getEmployeeSchedule(employeeId: number): Observable<EmployeeSchedule | null> {
    return this.httpClient.get<EmployeeSchedule | null>(
      `${this.employeeScheduleApi}/${employeeId}`,
    );
  }

  getShiftDetail(): Observable<EmployeeScheduleDetailDto> {
    return this.httpClient.get<EmployeeScheduleDetailDto>(
      `${this.employeeScheduleApi}/shift-detail`,
    );
  }

  addScheduleDays(employeeId: number, addScheduleDays: AddScheduleDays): Observable<ScheduleDay[]> {
    return this.httpClient.post<ScheduleDay[]>(
      `${this.employeeScheduleApi}/${employeeId}`,
      addScheduleDays,
    );
  }

  editScheduleDays(
    employeeId: number,
    scheduleDays: ScheduleDayWriteDto[],
  ): Observable<ScheduleDay[]> {
    return this.httpClient.put<ScheduleDay[]>(
      `${this.employeeScheduleApi}/${employeeId}/schedule-days`,
      scheduleDays,
    );
  }

  clockIn(): Observable<ShiftRecord> {
    return this.httpClient.post<ShiftRecord>(`${this.employeeScheduleApi}/clock-in`, {});
  }

  clockOut(): Observable<void> {
    return this.httpClient.post<void>(`${this.employeeScheduleApi}/clock-out`, {});
  }

  undoClockOut(): Observable<void> {
    return this.httpClient.post<void>(`${this.employeeScheduleApi}/clock-out/undo`, {});
  }
}
