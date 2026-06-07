import { Component, effect, input, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { EntraUser } from '../../../../models/entra-user/entra-user.model';
import {
  FormsModule,
  FormControl,
  ReactiveFormsModule,
  FormGroup,
  Validators,
} from '@angular/forms';
import { EmployeeStatus } from '../../../../models/employee/employee-status.model';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { AddEmployeeRecord } from '../../../../models/employee/add-employee-record';

@Component({
  selector: 'app-create-record-dialog',
  imports: [
    DialogModule,
    ButtonModule,
    InputTextModule,
    FormsModule,
    ReactiveFormsModule,
    SelectModule,
    DatePickerModule,
  ],
  templateUrl: './create-record-dialog.html',
  styleUrl: './create-record-dialog.css',
})
export class CreateRecordDialog {
  visible = input(false);
  entraUser = input<EntraUser | null>(null);
  employeeStatuses = input<EmployeeStatus[]>([]);
  visibleChange = output<boolean>();
  formSubmit = output<AddEmployeeRecord>();

  employeeRecordForm = new FormGroup({
    firstName: new FormControl<string>('', [Validators.required]),
    lastName: new FormControl<string>('', [Validators.required]),
    email: new FormControl<string>('', [Validators.email, Validators.required]),
    contactNumber: new FormControl<string | null>(null),
    employeeStatusId: new FormControl<number>(1, [Validators.required]),
    hiredDate: new FormControl<Date | string>('', [Validators.required]),
  });

  onVisibleChange(visibleValue: boolean) {
    this.visibleChange.emit(visibleValue);
  }

  constructor() {
    effect(() => {
      const user = this.entraUser();

      if (!user) return;

      this.employeeRecordForm.patchValue(
        {
          firstName: user.givenName ?? user.displayName,
          lastName: user.surName ?? '',
          email: user.email,
          contactNumber: user.mobilePhone,
        },
        { emitEvent: false },
      );
    });
  }

  onFormSubmit() {
    if (!this.entraUser()) {
      return;
    }

    if (this.employeeRecordForm.invalid) {
      this.employeeRecordForm.markAllAsTouched();
      return;
    }

    const employeeRecord = this.employeeRecordForm.value;

    if (employeeRecord.hiredDate && employeeRecord.hiredDate instanceof Date) {
      employeeRecord.hiredDate = employeeRecord.hiredDate.toISOString();
    }

    const addEmployeeRecord: AddEmployeeRecord = {
      entraObjectId: this.entraUser()!.objectId,
      firstName: employeeRecord.firstName!.trim(),
      lastName: employeeRecord.lastName!.trim(),
      email: employeeRecord.email!.trim(),
      contactNumber: employeeRecord.contactNumber,
      employeeStatusId: employeeRecord.employeeStatusId!,
      hiredDate: employeeRecord.hiredDate!,
    };

    this.formSubmit.emit(addEmployeeRecord);
    this.employeeRecordForm.reset();
    this.onVisibleChange(false);
  }
}
