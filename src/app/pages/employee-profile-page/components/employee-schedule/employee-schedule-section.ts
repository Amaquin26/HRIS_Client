import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DatePicker } from 'primeng/datepicker';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { DividerModule } from 'primeng/divider';
import { ScheduleDay } from '../../../../models/schedule/schedule-day.model';
import { EmployeeSchedule } from '../../../../models/schedule/employee-schedule.model';
import { SetupScheduleDaysDialog } from '../setup-schedule-days-dialog/setup-schedule-days-dialog/setup-schedule-days-dialog';
import { AddScheduleDays } from '../../../../models/schedule/add-schedule-days.model';
import { EmployeeScheduleService } from '../../../../services/employee-schedule-service/employee-schedule-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { InputNumberModule } from 'primeng/inputnumber';
import { formatTimeOnly } from '../../../../utils/date-formatter';
import { ScheduleDayWriteDto } from '../../../../models/schedule/schedule-day-write-dto.model';
import { FormatTimePipe } from '../../../../pipes/format-time/format-time-pipe';

@Component({
  selector: 'app-employee-schedule',
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    CheckboxModule,
    TagModule,
    DialogModule,
    InputTextModule,
    DatePicker,
    ToastModule,
    TooltipModule,
    DividerModule,
    SetupScheduleDaysDialog,
    InputNumberModule,
    FormatTimePipe,
  ],
  templateUrl: './employee-schedule-section.html',
  styleUrl: './employee-schedule-section.css',
})
export class EmployeeScheduleSection {
  employeeSchedule = input.required<EmployeeSchedule>();
  employeeId = input.required<number>();
  scheduleDaysAdded = output<ScheduleDay[]>();
  editingRowId: number | null = null;
  editingDay: ScheduleDay | null = null;

  isSetupDialogVisible = signal(false);

  isEditMode = false;
  editingDays: Record<number, ScheduleDay> = {};

  private readonly employeeScheduleService = inject(EmployeeScheduleService);
  private readonly messageService = inject(MessageService);
  private readonly destroyRef = inject(DestroyRef);

  get activeDaysCount(): number {
    const days = this.isEditMode
      ? Object.values(this.editingDays)
      : this.employeeSchedule().scheduleDays;
    return days.filter((d) => !d.isRestDay).length;
  }

  get estimatedWeeklyHours(): number {
    const days = this.isEditMode
      ? Object.values(this.editingDays)
      : this.employeeSchedule().scheduleDays;
    return days
      .filter((d) => !d.isRestDay && d.startTime && d.endTime)
      .reduce((sum, d) => sum + this.computeShiftHours(d), 0);
  }

  computeShiftHours(day: ScheduleDay): number {
    if (!day.startTime || !day.endTime) return 0;
    const start = new Date(day.startTime).getTime();
    let end = new Date(day.endTime).getTime();
    if (day.crossesMidnight && end <= start) {
      end += 24 * 60 * 60 * 1000;
    }
    const durationMs = end - start;
    const breakMs = 60 * 60 * 1000;
    return Math.max(0, Math.round(((durationMs - breakMs) / (1000 * 60 * 60)) * 10) / 10);
  }

  // Setup Schedule Days
  openSetupDialog(): void {
    this.isSetupDialogVisible.set(true);
  }

  closeSetupDialog() {
    this.isSetupDialogVisible.set(false);
  }

  onSetupScheduleDaysSubmit(addScheduleDays: AddScheduleDays) {
    this.messageService.add({
      severity: 'info',
      summary: 'Processing Request',
      detail: 'Adding schedule days.',
    });

    this.employeeScheduleService
      .addScheduleDays(this.employeeSchedule().employeeId, addScheduleDays)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (scheduleDays) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Saved',
            detail: 'Schedule days added',
          });

          this.scheduleDaysAdded.emit(scheduleDays);
        },
      });
  }

  // Edit Mode
  isInvalidTimeRange(day: ScheduleDay): boolean {
    if (day.isRestDay || !day.startTime || !day.endTime) return false;
    const start = new Date(day.startTime).getTime();
    const end = new Date(day.endTime).getTime();
    return end <= start && !day.crossesMidnight;
  }

  enterEditMode(): void {
    this.isEditMode = true;
    // snapshot all rows keyed by id
    this.editingDays = this.employeeSchedule().scheduleDays.reduce(
      (acc, day) => {
        acc[day.id] = {
          ...day,
          startTime: day.startTime ? new Date(day.startTime) : null,
          endTime: day.endTime ? new Date(day.endTime) : null,
        };
        return acc;
      },
      {} as Record<number, ScheduleDay>,
    );
  }

  cancelAllEdits(): void {
    this.isEditMode = false;
    this.editingDays = {};
  }

  saveAllEdits(): void {
    const days = Object.values(this.editingDays);

    const invalid = days.find((day) => {
      if (day.isRestDay || !day.startTime || !day.endTime) return false;
      const start = new Date(day.startTime).getTime();
      const end = new Date(day.endTime).getTime();
      return end <= start && !day.crossesMidnight;
    });

    if (invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Invalid schedule',
        detail: `${invalid.dayName}: end time is before start time. Enable "Crosses Midnight" for night shifts.`,
      });
      return;
    }

    const scheduleDayWriteDto: ScheduleDayWriteDto[] = days.map((d) => {
      const start = d.startTime ? formatTimeOnly(new Date(d.startTime)) : null;
      const end = d.endTime ? formatTimeOnly(new Date(d.endTime)) : null;

      return {
        id: d.id,
        startTime: start,
        endTime: end,
        crossesMidnight: d.crossesMidnight,
        isRestDay: d.isRestDay,
      };
    });

    this.employeeScheduleService
      .editScheduleDays(this.employeeId(), scheduleDayWriteDto)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (scheduleDays) => {
          this.isEditMode = false;
          this.editingDays = {};

          this.messageService.add({
            severity: 'success',
            summary: 'Saved',
            detail: `Schedule Days updated`,
          });

          this.scheduleDaysAdded.emit(scheduleDays);
        },
        error: (err) => {
          this.messageService.add({
            summary: err?.error.title ?? 'Error occured',
            detail: err?.error?.detail ?? 'Something went wrong! Please try again later.',
            severity: 'error',
          });
        },
      });
  }

  private timeOnlyToDate(time: string): Date {
    const [hours, minutes, seconds] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, seconds ?? 0, 0);
    return date;
  }
}
