import { ScheduledTimeDto } from './schedule-time-dto.model';
import { ShiftHistoryDto } from './shift-history-dto.model';

export interface EmployeeScheduleDetailDto {
  todaySchedule: ScheduledTimeDto | null;
  recentShifts: ShiftHistoryDto[];
}
