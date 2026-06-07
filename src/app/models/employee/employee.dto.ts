export interface EmployeeDto {
  id: number;
  entraObjectId: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  contactNumber?: string | null;
  employeeStatusId: number;
  employeeStatusName: string;
  hiredDate: string;
}
