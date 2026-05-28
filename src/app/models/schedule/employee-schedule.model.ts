import { ScheduleDay } from './schedule-day.model';

export interface EmployeeSchedule {
  id: number;
  employeeId: number;
  breakMinutes: number;
  scheduleDays: ScheduleDay[];
}
