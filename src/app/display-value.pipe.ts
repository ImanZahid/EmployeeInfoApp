import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'displayValue',
})
export class DisplayValuePipe implements PipeTransform {
  transform(value: any): any {
    return value !== null && value !== undefined && value !== '' ? value : '-';
  }
}
