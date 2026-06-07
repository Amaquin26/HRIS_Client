import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ImageModule } from 'primeng/image';
import { FileUploadModule } from 'primeng/fileupload';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { EmployeeService } from '../../services/employee-service/employee-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { filter, map, switchMap, tap } from 'rxjs';
import { EmployeeDto } from '../../models/employee/employee.dto';
import { formatDate } from '../../utils/date-formatter';
import { EmployeeScheduleService } from '../../services/employee-schedule-service/employee-schedule-service';
import { EmployeeSchedule } from '../../models/schedule/employee-schedule.model';
import { EmployeeScheduleSection } from './components/employee-schedule/employee-schedule-section';
import { ScheduleDay } from '../../models/schedule/schedule-day.model';

@Component({
  selector: 'app-employee-profile-page',
  imports: [
    CardModule,
    ImageModule,
    FileUploadModule,
    ToastModule,
    InputTextModule,
    FormsModule,
    ReactiveFormsModule,
    FloatLabelModule,
    EmployeeScheduleSection,
  ],
  templateUrl: './employee-profile-page.html',
  styleUrl: './employee-profile-page.css',
})
export class EmployeeProfilePage implements OnInit {
  private readonly messageService = inject(MessageService);
  private readonly employeeService = inject(EmployeeService);
  private readonly employeeScheduleService = inject(EmployeeScheduleService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);

  employeeId?: number | null = null;
  employeeRecord = signal<EmployeeDto | null>(null);
  employeeSchedule = signal<EmployeeSchedule | null>(null);

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        map((params) => params.get('id')),
        tap((id) => {
          if (!id || isNaN(+id)) {
            this.messageService.add({
              severity: 'error',
              summary: 'No employee id found!',
              detail: 'Employee id is needed to retrieve employee record',
            });
          }
        }),
        filter((id): id is string => !!id && !isNaN(+id)),
        tap((id) => (this.employeeId = +id)),
        switchMap((id) => this.employeeService.getEmployeeById(+id)),
      )
      .subscribe({
        next: (employee) => {
          if (!employee) {
            this.messageService.add({
              severity: 'error',
              summary: 'No employee record found!',
              detail: 'This employee does not exist. Please check for validity',
            });
            return;
          }

          this.employeeRecord.set({
            ...employee,
            hiredDate: formatDate(employee.hiredDate),
          });

          this.getEmployeeSchedule();
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: err?.error?.title ?? 'An error occured',
            detail: err?.error?.detail ?? 'Something went wrong while processing your request.',
          });
        },
      });
  }

  getEmployeeSchedule() {
    if (!this.employeeId) return;

    this.employeeScheduleService
      .getEmployeeSchedule(this.employeeId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (schedule) => {
          this.employeeSchedule.set(schedule);
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: err?.error?.title ?? 'An error occured',
            detail: err?.error?.detail ?? 'Something went wrong while fetching employee schedule.',
          });
        },
      });
  }

  onScheduleDaysAdded(scheduleDays: ScheduleDay[]): void {
    this.employeeSchedule.update(
      (current) =>
        ({
          ...current,
          scheduleDays,
        }) as EmployeeSchedule,
    );
  }

  onProfileUpload(event: any) {
    // TODO: add logic for uploading profile to blob storage
  }
}
