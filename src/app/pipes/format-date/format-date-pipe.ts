import { Pipe, PipeTransform } from '@angular/core';
import { format, isValid, parseISO } from 'date-fns';

@Pipe({
  name: 'formatDate',
})
export class FormatDatePipe implements PipeTransform {

  transform(
    value: string | null | undefined,
    dateFormat: string = 'MMM dd, yyyy'
  ): string {
    if (!value) return '';

    const date = parseISO(value);
    if (!isValid(date)) return '';

    return format(date, dateFormat);
  }

}
