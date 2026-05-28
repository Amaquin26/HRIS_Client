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
import { FormatTimePipePipe } from '../../../../pipes/format-time/format-time-pipe-pipe';

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
    FormatTimePipePipe,
  ],
  templateUrl: './employee-schedule-section.html',
  styleUrl: './employee-schedule-section.css',
})
export class EmployeeScheduleSection {
  employeeSchedule = input.required<EmployeeSchedule>();
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
    return this.employeeSchedule().scheduleDays.filter((d) => !d.isRestDay).length;
  }

  get estimatedWeeklyHours(): number {
    return this.employeeSchedule()
      .scheduleDays.filter((d) => !d.isRestDay && d.startTime && d.endTime)
      .reduce((sum, d) => sum + this.computeShiftHours(d), 0);
  }

  computeShiftHours(day: ScheduleDay): number {
    if (!day.startTime || !day.endTime) return 0;
    const start = this.timeOnlyToDate(day.startTime).getTime();
    let end = this.timeOnlyToDate(day.endTime).getTime();
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
  enterEditMode(): void {
    this.isEditMode = true;
    // snapshot all rows keyed by id
    this.editingDays = this.employeeSchedule().scheduleDays.reduce(
      (acc, day) => {
        acc[day.id] = { ...day };
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
    const updated = Object.values(this.editingDays);
    // call your service, then on success:
    //this.scheduleDaysUpdated.emit(updated);
    this.isEditMode = false;
    this.editingDays = {};
  }

  private timeOnlyToDate(time: string): Date {
    const [hours, minutes, seconds] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, seconds ?? 0, 0);
    return date;
  }
}
