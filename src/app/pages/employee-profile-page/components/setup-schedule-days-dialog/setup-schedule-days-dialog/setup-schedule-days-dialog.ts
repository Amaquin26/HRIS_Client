import { Component, input, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import {
  FormsModule,
  FormControl,
  ReactiveFormsModule,
  FormGroup,
  Validators,
} from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { AddScheduleDays } from '../../../../../models/schedule/add-schedule-days.model';
import { InputNumberModule } from 'primeng/inputnumber';
import { formatTimeOnly } from '../../../../../utils/date-formatter';

@Component({
  selector: 'app-setup-schedule-days-dialog',
  imports: [
    DialogModule,
    ButtonModule,
    InputTextModule,
    FormsModule,
    ReactiveFormsModule,
    SelectModule,
    DatePickerModule,
    InputNumberModule,
  ],
  templateUrl: './setup-schedule-days-dialog.html',
  styleUrl: './setup-schedule-days-dialog.css',
})
export class SetupScheduleDaysDialog {
  visible = input(false);
  visibleChange = output<boolean>();
  formSubmit = output<AddScheduleDays>();

  dayOptions = [
    { label: 'Sun', value: 0 },
    { label: 'Mon', value: 1 },
    { label: 'Tue', value: 2 },
    { label: 'Wed', value: 3 },
    { label: 'Thu', value: 4 },
    { label: 'Fri', value: 5 },
    { label: 'Sat', value: 6 },
  ];

  scheduleDaysForm = new FormGroup({
    startTime: new FormControl<Date | null>(null, [Validators.required]),
    endTime: new FormControl<Date | null>(null, [Validators.required]),
    breakMinutes: new FormControl<number>(0, [Validators.required]),
    restDays: new FormControl<number[]>([]),
  });

  toggleRestDay(day: number): void {
    const current = this.scheduleDaysForm.controls.restDays.value ?? [];
    const idx = current.indexOf(day);
    if (idx === -1) {
      this.scheduleDaysForm.controls.restDays.setValue([...current, day]);
    } else {
      this.scheduleDaysForm.controls.restDays.setValue(current.filter((d) => d !== day));
    }
  }

  saveSetup(): void {
    if (this.scheduleDaysForm.invalid) {
      this.scheduleDaysForm.markAllAsTouched();
      return;
    }

    const scheduleDays = this.scheduleDaysForm.value;

    const addScheduleDays: AddScheduleDays = {
      scheduleId: 0,
      startTime: formatTimeOnly(scheduleDays.startTime!),
      endTime: formatTimeOnly(scheduleDays.endTime!),
      breakMinutes: scheduleDays.breakMinutes!,
      restDays: scheduleDays.restDays ?? [],
    };

    this.formSubmit.emit(addScheduleDays);
    this.scheduleDaysForm.reset();
    this.onVisibleChange(false);
  }

  onVisibleChange(visibleValue: boolean) {
    this.visibleChange.emit(visibleValue);
  }
}
