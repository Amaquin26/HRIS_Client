export interface ScheduleDay {
  id: number;
  scheduleId: number;
  dayOfWeek: number;
  dayName: string;
  startTime?: string | null;
  endTime?: string | null;
  crossesMidnight: boolean;
  isRestDay: boolean;
}
