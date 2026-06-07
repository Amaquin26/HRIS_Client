import { ShiftStatus } from '../../enums/shift-status';

export interface ShiftRecord {
  id: number;
  employeeId: number;
  shiftDate: string;
  clockIn: string;
  clockOut?: string | null;
  status: ShiftStatus;
  isFlagged: boolean;
  flagReason?: string | null;
  createdAt: string;
}
