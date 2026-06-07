export interface AddEmployeeRecord {
  entraObjectId: string;
  firstName: string;
  lastName: string;
  email: string;
  contactNumber?: string | null;
  employeeStatusId: number;
  hiredDate: string;
}
