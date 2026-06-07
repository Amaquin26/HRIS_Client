import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatTimePipe',
})
export class FormatTimePipe implements PipeTransform {
  transform(value: Date | string | null | undefined): string {
    if (!value) return '';
    const date = new Date(value);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }
}
