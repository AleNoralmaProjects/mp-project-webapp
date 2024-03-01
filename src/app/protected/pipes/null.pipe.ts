import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'appNull',
})
export class NullPipe implements PipeTransform {
  transform(value: any, message: string = '...'): string {
    return value ? value : message;
  }
}
