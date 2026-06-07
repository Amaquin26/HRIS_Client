import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { MessageService } from 'primeng/api';
import { finalize, interval, Subscription } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { DividerModule } from 'primeng/divider';
import { SkeletonModule } from 'primeng/skeleton';
import { CardModule } from 'primeng/card';
import { CommonModule, DatePipe } from '@angular/common';
import { ShiftStatus } from '../../../../enums/shift-status';
import { ShiftRecord } from '../../../../models/schedule/shift-record.model';
import { Store } from '@ngxs/store';
import { AuthState } from '../../../../states/auth.state';
import { ScheduledTimeDto } from '../../../../models/schedule/schedule-time-dto.model';
import { EmployeeScheduleService } from '../../../../services/employee-schedule-service/employee-schedule-service';
import { FormatTimePipe } from '../../../../pipes/format-time/format-time-pipe';
import { EmployeeScheduleDetailDto } from '../../../../models/schedule/employee-schedule-detail-dto.model';
import { ShiftHistoryDto } from '../../../../models/schedule/shift-history-dto.model';

@Component({
  selector: 'app-clock-in-clock-out',
  imports: [
    CommonModule,
    ButtonModule,
    TagModule,
    DialogModule,
    ToastModule,
    TooltipModule,
    DividerModule,
    SkeletonModule,
    CardModule,
    DatePipe,
    FormatTimePipe,
  ],
  templateUrl: './clock-in-clock-out.html',
  styleUrl: './clock-in-clock-out.css',
})
export class ClockInClockOut {
  shiftStatus = ShiftStatus;

  private timerSub?: Subscription;
  private undoSub?: Subscription;

  private readonly destroyRef = inject(DestroyRef);
  private readonly messageService = inject(MessageService);
  private readonly employeeScheduleService = inject(EmployeeScheduleService);
  private readonly store = inject(Store);

  employeeName = this.store.selectSignal(AuthState.user)()?.firstName;
  readonly scheduleSummary = signal<EmployeeScheduleDetailDto | null>(null);

  isLoading = signal(false);
  isLoadingHistory = signal(false);

  elapsedTime = signal('00:00:00');
  undoCountdown = signal(0);
  showUndoBanner = signal(false);

  clockOutDialogVisible = false;

  get today(): Date {
    return new Date();
  }

  get greeting(): string {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  }

  readonly todayShift = computed(() => {
    const summary = this.scheduleSummary();

    if (!summary?.recentShifts?.length) {
      return null;
    }

    return summary.recentShifts[0];
  });

  readonly isClockedIn = computed(() => {
    const shift = this.todayShift();

    const hasClockedInVal = shift !== null && shift.clockIn;

    if (hasClockedInVal) this.startTimer(shift.clockIn!);

    return hasClockedInVal;
  });

  readonly completedDuration = computed(() => {
    const shift = this.todayShift();
    if (shift === null || !shift.clockOut || !shift.clockIn) return '00:00:00';
    return this.computeDuration(shift.clockIn, shift.clockOut);
  });

  ngOnInit(): void {
    this.getEmployeeScheduleSummary();
  }

  ngOnDestroy(): void {
    this.timerSub?.unsubscribe();
    this.undoSub?.unsubscribe();
  }

  getEmployeeScheduleSummary() {
    this.employeeScheduleService
      .getShiftDetail()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (detail) => {
          this.scheduleSummary.set(detail);
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: err?.error?.title ?? 'An error occured',
            detail: err?.error?.detail ?? 'Something went wrong while fetching schedule detail.',
          });
        },
      });
  }

  clockIn(): void {
    this.isLoading.set(true);
    this.employeeScheduleService
      .clockIn()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe({
        next: (result) => {
          const todaySchedule: ShiftHistoryDto = {
            id: result.id,
            shiftDate: result.shiftDate,
            clockIn: result.clockIn,
            clockOut: result.clockOut,
            status: result.status,
            isFlagged: result.isFlagged,
            flagReason: result.flagReason,
            isMissing: false,
          };

          this.scheduleSummary.update((prev) => ({
            ...prev!,
            recentShifts: [todaySchedule, ...prev!.recentShifts.slice(1)],
          }));
          this.messageService.add({
            severity: 'success',
            summary: 'Clock In Successfully',
          });
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: err?.error?.title ?? 'An error occured',
            detail: err?.error?.detail ?? 'Something went wrong while clocking in.',
          });
        },
      });
  }

  openClockOutDialog(): void {
    this.clockOutDialogVisible = true;
  }

  clockOut(): void {
    this.clockOutDialogVisible = false;
    /* this.isLoading.set(true);
    // replace with: this.shiftService.clockOut().subscribe(...)
    setTimeout(() => {
      const shift = this.todayShift();
      if (!shift) return;
      const updated = {
        ...shift,
        clockOut: new Date().toISOString(),
        status: ShiftStatus.Completed,
      };
      this.todayShift.set(updated);
      this.stopTimer();
      this.isLoading.set(false);
      this.messageService.add({
        severity: 'info',
        summary: 'Clocked out',
        detail: 'See you tomorrow!',
      });
      this.startUndoCountdown();
    }, 600); */
  }

  undoClockOut(): void {
    this.isLoading.set(true);
    // replace with: this.shiftService.undoClockOut().subscribe(...)
    /* setTimeout(() => {
      const shift = this.todayShift();
      if (!shift) return;
      const updated = { ...shift, clockOut: null, status: ShiftStatus.Open };
      this.todayShift.set(updated);
      this.startTimer(shift.clockIn);
      this.showUndoBanner.set(false);
      this.undoSub?.unsubscribe();
      this.isLoading.set(false);
      this.messageService.add({
        severity: 'success',
        summary: 'Clock out undone',
        detail: 'Shift resumed.',
      });
    }, 400); */
  }

  private startTimer(clockInIso: string): void {
    if (!clockInIso) return;

    this.timerSub?.unsubscribe();
    this.timerSub = interval(1000)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        const diff = Date.now() - new Date(clockInIso).getTime();
        this.elapsedTime.set(this.msToHms(diff));
      });
  }

  private stopTimer(): void {
    this.timerSub?.unsubscribe();
  }

  private startUndoCountdown(): void {
    const windowSeconds = 5 * 60; // 5 minutes
    this.undoCountdown.set(windowSeconds);
    this.showUndoBanner.set(true);

    this.undoSub?.unsubscribe();
    this.undoSub = interval(1000)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        const remaining = this.undoCountdown() - 1;
        if (remaining <= 0) {
          this.showUndoBanner.set(false);
          this.undoSub?.unsubscribe();
        } else {
          this.undoCountdown.set(remaining);
        }
      });
  }

  private msToHms(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const h = Math.floor(totalSeconds / 3600)
      .toString()
      .padStart(2, '0');
    const m = Math.floor((totalSeconds % 3600) / 60)
      .toString()
      .padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  }

  computeDuration(clockIn: string, clockOut: string): string {
    const diff = new Date(clockOut).getTime() - new Date(clockIn).getTime();
    return this.msToHms(diff);
  }
}
