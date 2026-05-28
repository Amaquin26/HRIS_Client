export interface AddScheduleDays {
  scheduleId: number;
  startTime: string;
  endTime: string;
  breakMinutes: number;
  restDays: number[];
}
