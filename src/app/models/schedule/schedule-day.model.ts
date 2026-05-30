export interface ScheduleDay {
  id: number;
  scheduleId: number;
  dayOfWeek: number;
  dayName: string;
  startTime?: string | Date | null;
  endTime?: string | Date | null;
  crossesMidnight: boolean;
  isRestDay: boolean;
}
