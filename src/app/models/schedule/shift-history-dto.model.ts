import { ShiftStatus } from '../../enums/shift-status';

export interface ShiftHistoryDto {
  id: number;
  shiftDate: string;
  clockIn?: string;
  clockOut?: string | null;
  status?: ShiftStatus;
  isFlagged: boolean;
  flagReason?: string | null;
  isMissing: boolean;
}
