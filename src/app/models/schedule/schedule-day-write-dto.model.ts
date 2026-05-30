export interface ScheduleDayWriteDto {
  id: number;
  startTime?: string | null;
  endTime?: string | null;
  crossesMidnight: boolean;
  isRestDay: boolean;
}
