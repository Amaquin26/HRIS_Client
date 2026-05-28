import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatTimePipe',
})
export class FormatTimePipePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';

    const [hours, minutes] = value.split(':');

    let h = +hours;
    const ampm = h >= 12 ? 'PM' : 'AM';

    h = h % 12;
    h = h ? h : 12;

    return `${h}:${minutes} ${ampm}`;
  }
}
